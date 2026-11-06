import {Injectable} from '@nestjs/common';
import {Database,SqlExecutor} from './database';
import {DomainError,GeoPoint,Incident,RegisterInput,Status} from './domain';
import {IncidentRepository,AuditLog,AuditRepository,ResourceRepository} from './repository';
@Injectable()
export class IncidentService {
 constructor(private readonly db:Database,private readonly incidents:IncidentRepository,private readonly resources:ResourceRepository,private readonly audit:AuditRepository){}
 private async actor(tx:SqlExecutor,id:string){const {rows:[u]}=await tx.query('SELECT role,active FROM app_user WHERE id=$1 FOR SHARE',[id]);if(!u?.active||!['DISPATCHER','ADMIN'].includes(u.role))throw new DomainError('FORBIDDEN','Нет активного диспетчера',403);}
 async register(input:RegisterInput,actor:string){
  new GeoPoint(input.lat,input.lng);
  const time=new Date(input.occurredAt).getTime();
  if(!Number.isFinite(time)||time>Date.now())throw new DomainError('INVALID_DATE','Время происшествия не должно быть в будущем',400);
  return this.db.transaction(async tx=>{
   await this.actor(tx,actor);
   const i=await this.incidents.create(tx,input,actor);
   await this.audit.append(tx,new AuditLog(i.id,actor,'CREATED','Сообщение зарегистрировано',null,'NEW'));
   return i;
  });
 }
 async assign(id:string,ids:string[],actor:string){
  if(!ids.length||ids.length>8||new Set(ids).size!==ids.length)throw new DomainError('INVALID_RESOURCES','Выберите от 1 до 8 разных ресурсов',400);
  return this.db.transaction(async tx=>{
   await this.actor(tx,actor);
   const incident=new Incident(await this.incidents.lock(tx,id));incident.canAssign();
   await this.resources.lockAvailable(tx,[...ids].sort());
   const result:string[]=[];
   for(const r of [...ids].sort()){
    const assignmentId=await this.resources.assign(tx,id,r,actor);result.push(assignmentId);
    await this.audit.append(tx,new AuditLog(id,actor,'RESOURCE_ASSIGNED',`Назначен ресурс ${r}`,null,null,assignmentId));
   }
   return {incidentId:id,assignmentIds:result};
  });
 }
 async transition(id:string,next:Status,actor:string){
  return this.db.transaction(async tx=>{
   await this.actor(tx,actor);
   const incident=new Incident(await this.incidents.lock(tx,id));
   const active=await this.resources.active(tx,id);const from=incident.data.status_code;
   incident.transition(next,active.length);
   const updated=await this.incidents.setStatus(tx,id,next);
   await this.audit.append(tx,new AuditLog(id,actor,'STATUS_CHANGED',`Статус ${from} → ${next}`,from,next));
   if(next==='RESOLVED')for(const a of active)await this.audit.append(tx,new AuditLog(id,actor,'RESOURCE_RELEASED','Ресурс освобожден при завершении',null,null,a.id));
   return updated;
  });
 }
}
