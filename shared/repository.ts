import {Injectable} from '@nestjs/common';
import {Database,SqlExecutor} from './database';
import {DomainError,IncidentRecord,RegisterInput,Status} from './domain';
/** Repository pattern isolates SQL from application rules. */
export abstract class IncidentRepository {
 abstract lock(tx:SqlExecutor,id:string):Promise<IncidentRecord>;
 abstract create(tx:SqlExecutor,d:RegisterInput,actor:string):Promise<IncidentRecord>;
 abstract setStatus(tx:SqlExecutor,id:string,status:Status):Promise<IncidentRecord>;
}
@Injectable()
export class PgIncidentRepository extends IncidentRepository {
 constructor(private readonly db:Database){super();}
 async lock(tx:SqlExecutor,id:string){const {rows}=await tx.query<IncidentRecord>('SELECT id,number,status_code,title FROM incident WHERE id=$1 FOR UPDATE',[id]);if(!rows[0])throw new DomainError('NOT_FOUND','Происшествие не найдено',404);return rows[0];}
 async create(tx:SqlExecutor,d:RegisterInput,actor:string){
  const {rows:[reporter]}=await tx.query('INSERT INTO reporter(display_name,phone) VALUES($1,$2) RETURNING id',[d.reporterName,d.phone]);
  const {rows:[incident]}=await tx.query<IncidentRecord>(`INSERT INTO incident(type_code,severity_code,reporter_id,created_by,title,description,address,location,occurred_at)
   VALUES($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326)::geography,$10) RETURNING id,number,status_code,title`,
   [d.typeCode,d.severityCode,reporter.id,actor,d.title,d.description,d.address,d.lng,d.lat,d.occurredAt]);return incident;
 }
 async setStatus(tx:SqlExecutor,id:string,status:Status){const {rows:[i]}=await tx.query<IncidentRecord>('UPDATE incident SET status_code=$2 WHERE id=$1 RETURNING id,number,status_code,title',[id,status]);return i;}
 async list(){return (await this.db.query('SELECT * FROM incident_overview ORDER BY registered_at DESC')).rows;}
 async details(id:string){const {rows:[i]}=await this.db.query(`SELECT i.*,ST_Y(location::geometry) AS lat,ST_X(location::geometry) AS lng FROM incident i WHERE id=$1`,[id]);if(!i)throw new DomainError('NOT_FOUND','Происшествие не найдено',404);const {rows:history}=await this.db.query('SELECT * FROM audit_log WHERE incident_id=$1 ORDER BY occurred_at,id',[id]);const {rows:assignments}=await this.db.query('SELECT a.*,r.name FROM assignment a JOIN resource r ON r.id=a.resource_id WHERE incident_id=$1 ORDER BY assigned_at',[id]);return {...i,history,assignments};}
 async resources(){return (await this.db.query(`SELECT r.*,a.incident_id FROM resource r LEFT JOIN assignment a ON a.resource_id=r.id AND a.released_at IS NULL ORDER BY name`)).rows;}
}
export class AuditLog {
 constructor(public readonly incidentId:string,public readonly actorId:string,public readonly eventType:string,public readonly details:string,public readonly fromStatus:Status|null=null,public readonly toStatus:Status|null=null,public readonly assignmentId:string|null=null){}
}
@Injectable()
export class AuditRepository {
 async append(tx:SqlExecutor,e:AuditLog){
  const {rows:[row]}=await tx.query(`INSERT INTO audit_log(incident_id,actor_id,event_type,details,from_status,to_status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,[e.incidentId,e.actorId,e.eventType,e.details,e.fromStatus,e.toStatus]);
  if(e.assignmentId) await tx.query('INSERT INTO audit_assignment(audit_id,assignment_id) VALUES($1,$2)',[row.id,e.assignmentId]);
 }
}
@Injectable()
export class ResourceRepository {
 async lockAvailable(tx:SqlExecutor,ids:string[]){
  const {rows}=await tx.query('SELECT id,maintenance FROM resource WHERE id=ANY($1::uuid[]) ORDER BY id FOR UPDATE',[ids]);
  if(rows.length!==ids.length)throw new DomainError('RESOURCE_NOT_FOUND','Один из ресурсов не найден',404);
  if(rows.some(r=>r.maintenance))throw new DomainError('MAINTENANCE','Ресурс на обслуживании');
  const busy=await tx.query('SELECT id FROM assignment WHERE resource_id=ANY($1::uuid[]) AND released_at IS NULL',[ids]);
  if(busy.rowCount)throw new DomainError('RESOURCE_BUSY','Ресурс уже назначен на активное происшествие');
 }
 async assign(tx:SqlExecutor,incidentId:string,resourceId:string,actor:string){return (await tx.query('INSERT INTO assignment(incident_id,resource_id,assigned_by) VALUES($1,$2,$3) RETURNING id',[incidentId,resourceId,actor])).rows[0].id as string;}
 async active(tx:SqlExecutor,id:string){return (await tx.query('SELECT id,resource_id FROM assignment WHERE incident_id=$1 AND released_at IS NULL ORDER BY resource_id',[id])).rows;}
}
