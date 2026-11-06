import {Body,Controller,Get,Headers,Param,Post,Patch,Header} from '@nestjs/common';
import {readFileSync} from 'node:fs';import {join} from 'node:path';
import {IncidentService} from './service';import {PgIncidentRepository} from './repository';
import {DomainError,RegisterInput,Status,transitions} from './domain';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validId(value:unknown):string {if(typeof value!=='string'||!uuid.test(value))throw new DomainError('INVALID_ID','Ожидается идентификатор UUID',400);return value;}
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new DomainError('INVALID_BODY','Ожидается объект JSON',400);return value as Record<string,unknown>;}
function str(v:unknown,name:string,min=1,max=200):string{if(typeof v!=='string'||v.trim().length<min||v.trim().length>max)throw new DomainError('INVALID_FIELD',`Поле ${name}: длина ${min}…${max}`,400);return v.trim();}
@Controller()
export class IncidentController {
 constructor(private readonly service:IncidentService,private readonly repo:PgIncidentRepository){}
 @Get() @Header('Content-Type','text/html; charset=utf-8') console(){return readFileSync(join(process.cwd(),'public/console.html'),'utf8');}
 @Get('health') health(){return {status:'ok',mode:'educational'};}
 @Get('incidents') list(){return this.repo.list();}
 @Get('incidents/:id') details(@Param('id') id:string){return this.repo.details(validId(id));}
 @Get('resources') resources(){return this.repo.resources();}
 @Post('incidents') register(@Body() raw:unknown,@Headers('x-user-id') actor:string){
  const b=object(raw);
  const input:RegisterInput={typeCode:str(b.typeCode,'тип',1,20),severityCode:str(b.severityCode,'критичность',1,10),title:str(b.title,'заголовок',1,120),description:str(b.description,'описание',10,4000),address:str(b.address,'адрес',1,200),reporterName:str(b.reporterName,'заявитель',1,120),phone:str(b.phone,'телефон',7,30),lat:b.lat as number,lng:b.lng as number,occurredAt:str(b.occurredAt,'дата',20,35)};
  if(typeof b.lat!=='number'||typeof b.lng!=='number'||!/^\+?[0-9 ()-]{7,30}$/.test(input.phone)||!/^\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:\d{2})$/.test(input.occurredAt))throw new DomainError('INVALID_FIELD','Проверьте числовые координаты, телефон и ISO-дату с часовым поясом',400);
  return this.service.register(input,validId(actor));
 }
 @Post('incidents/:id/assignments') assign(@Param('id') id:string,@Body() raw:unknown,@Headers('x-user-id') actor:string){const b=object(raw);if(!Array.isArray(b.resourceIds))throw new DomainError('INVALID_FIELD','resourceIds должен быть массивом',400);return this.service.assign(validId(id),b.resourceIds.map(validId),validId(actor));}
 @Patch('incidents/:id/status') status(@Param('id') id:string,@Body() raw:unknown,@Headers('x-user-id') actor:string){const b=object(raw);if(typeof b.status!=='string'||!Object.hasOwn(transitions,b.status))throw new DomainError('INVALID_STATUS','Неизвестный статус',400);return this.service.transition(validId(id),b.status as Status,validId(actor));}
}
