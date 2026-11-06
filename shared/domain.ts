export type Status = 'NEW'|'VERIFICATION'|'CONFIRMED'|'RESPONDING'|'LOCALIZED'|'RESOLVED';
export const transitions: Record<Status, readonly Status[]> = {
 NEW:['VERIFICATION'], VERIFICATION:['CONFIRMED','RESOLVED'],
 CONFIRMED:['RESPONDING'], RESPONDING:['LOCALIZED'],
 LOCALIZED:['RESOLVED'], RESOLVED:[]
};
export class DomainError extends Error {
 constructor(public readonly code: string, message: string, public readonly httpStatus=409) { super(message); }
}
export class GeoPoint {
 constructor(public readonly lat:number, public readonly lng:number) {
  if (!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)
   throw new DomainError('INVALID_COORDINATES','Широта −90…90, долгота −180…180',400);
 }
}
export interface IncidentRecord {id:string;number:string;status_code:Status;title:string;}
export class Incident {
 constructor(public readonly data:IncidentRecord) {}
 transition(next:Status, activeResources:number): void {
  if (!transitions[this.data.status_code].includes(next))
   throw new DomainError('INVALID_TRANSITION',`Переход ${this.data.status_code} → ${next} запрещен`);
  if(next==='RESPONDING' && activeResources===0)
   throw new DomainError('RESOURCE_REQUIRED','Для реагирования назначьте ресурсы');
  this.data.status_code=next;
 }
 canAssign():void {
  if(!['CONFIRMED','RESPONDING','LOCALIZED'].includes(this.data.status_code))
   throw new DomainError('NOT_CONFIRMED','Назначение возможно после подтверждения');
 }
}
export interface RegisterInput {typeCode:string;severityCode:string;title:string;description:string;address:string;lat:number;lng:number;occurredAt:string;reporterName:string;phone:string;}
