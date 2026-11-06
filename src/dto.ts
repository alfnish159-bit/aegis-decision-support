import {DomainError} from '../shared/domain';
export const resourceKinds=['FIRE','MEDICAL','RESCUE','POLICE','GAS','POWER','VEHICLE'] as const;
export interface ResourceDto {name:string;kind:typeof resourceKinds[number];capacity:number;locationName:string;maintenance:boolean;}
export interface ResourceView extends ResourceDto {id:string;}
export function resourceDto(raw:unknown):ResourceDto {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new DomainError('INVALID_BODY','Ожидается объект JSON',400);
 const b=raw as Record<string,unknown>;
 if(Object.keys(b).some(k=>!['name','kind','capacity','locationName','maintenance'].includes(k)))throw new DomainError('UNKNOWN_FIELD','Передано неизвестное поле',400);
 function text(k:string){const v=b[k];if(typeof v!=='string'||!v.trim()||v.trim().length>120)throw new DomainError('INVALID_FIELD',`${k}: строка длиной 1…120`,400);return v.trim();}
 const name=text('name'),locationName=text('locationName');
 if(!resourceKinds.includes(b.kind as any)||!Number.isInteger(b.capacity)||(b.capacity as number)<1||(b.capacity as number)>100||typeof b.maintenance!=='boolean')throw new DomainError('INVALID_FIELD','Проверьте kind, capacity 1…100 и maintenance boolean',400);
 return {name,kind:b.kind as ResourceDto['kind'],capacity:b.capacity as number,locationName,maintenance:b.maintenance};
}
