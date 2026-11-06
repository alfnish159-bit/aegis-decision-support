import {Injectable} from '@nestjs/common';
import {Database,SqlExecutor} from '../shared/database';
import {DomainError} from '../shared/domain';
import {ResourceDto} from './dto';
import {ResourceCatalog} from './resource.repository';
@Injectable()
export class ResourceService {
 constructor(private readonly db:Database,private readonly catalog:ResourceCatalog){}
 private async admin(tx:SqlExecutor,id:string){const {rows:[u]}=await tx.query('SELECT role,active FROM app_user WHERE id=$1 FOR SHARE',[id]);if(!u?.active||u.role!=='ADMIN')throw new DomainError('FORBIDDEN','Требуется активный администратор',403);}
 get(id:string){return this.catalog.get(this.db,id);}
 create(d:ResourceDto,actor:string){return this.db.transaction(async tx=>{await this.admin(tx,actor);return this.catalog.create(tx,d);});}
 replace(id:string,d:ResourceDto,actor:string){return this.db.transaction(async tx=>{await this.admin(tx,actor);await this.catalog.get(tx,id,true);const busy=await tx.query('SELECT id FROM assignment WHERE resource_id=$1 AND released_at IS NULL',[id]);if(busy.rowCount)throw new DomainError('RESOURCE_BUSY','Нельзя менять назначенный ресурс');return this.catalog.replace(tx,id,d);});}
 remove(id:string,actor:string){return this.db.transaction(async tx=>{await this.admin(tx,actor);await this.catalog.get(tx,id,true);const history=await tx.query('SELECT id FROM assignment WHERE resource_id=$1 LIMIT 1',[id]);if(history.rowCount)throw new DomainError('RESOURCE_REFERENCED','Ресурс упоминается в истории назначений');await this.catalog.remove(tx,id);});}
}
