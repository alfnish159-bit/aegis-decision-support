import {Injectable} from '@nestjs/common';
import {SqlExecutor} from '../shared/database';
import {DomainError} from '../shared/domain';
import {ResourceDto,ResourceView} from './dto';
export abstract class ResourceCatalog {
 abstract get(tx:SqlExecutor,id:string,lock?:boolean):Promise<ResourceView>;
 abstract create(tx:SqlExecutor,d:ResourceDto):Promise<ResourceView>;
 abstract replace(tx:SqlExecutor,id:string,d:ResourceDto):Promise<ResourceView>;
 abstract remove(tx:SqlExecutor,id:string):Promise<void>;
}
const fields='id,name,kind,capacity,location_name AS "locationName",maintenance';
@Injectable()
export class PgResourceCatalog extends ResourceCatalog {
 async get(tx:SqlExecutor,id:string,lock=false){const {rows:[r]}=await tx.query<ResourceView>(`SELECT ${fields} FROM resource WHERE id=$1${lock?' FOR UPDATE':''}`,[id]);if(!r)throw new DomainError('NOT_FOUND','Ресурс не найден',404);return r;}
 async create(tx:SqlExecutor,d:ResourceDto){return (await tx.query<ResourceView>(`INSERT INTO resource(name,kind,capacity,location_name,maintenance) VALUES($1,$2,$3,$4,$5) RETURNING ${fields}`,[d.name,d.kind,d.capacity,d.locationName,d.maintenance])).rows[0];}
 async replace(tx:SqlExecutor,id:string,d:ResourceDto){return (await tx.query<ResourceView>(`UPDATE resource SET name=$2,kind=$3,capacity=$4,location_name=$5,maintenance=$6 WHERE id=$1 RETURNING ${fields}`,[id,d.name,d.kind,d.capacity,d.locationName,d.maintenance])).rows[0];}
 async remove(tx:SqlExecutor,id:string){await tx.query('DELETE FROM resource WHERE id=$1',[id]);}
}
