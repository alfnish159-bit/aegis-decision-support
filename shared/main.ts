import 'reflect-metadata';
import {Module,Catch,ExceptionFilter,ArgumentsHost,HttpException} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {Database} from './database';import {DomainError} from './domain';
import {IncidentRepository,PgIncidentRepository,ResourceRepository,AuditRepository} from './repository';
import {IncidentService} from './service';import {IncidentController} from './controller';
@Catch()
export class ApiErrorFilter implements ExceptionFilter {
 catch(error:any,host:ArgumentsHost){let status=500,code='INTERNAL_ERROR',message='Внутренняя ошибка';
  if(error instanceof DomainError){status=error.httpStatus;code=error.code;message=error.message;}
  else if(error instanceof HttpException){status=error.getStatus();code='HTTP_ERROR';message=error.message;}
  else if(['23505','23514','23503','22P02','40001','40P01'].includes(error.code)){status=error.code==='22P02'?400:409;code=error.code;message=error.code==='23505'?'Конфликт уникальности или ресурс уже занят':error.code==='23503'?'Неизвестное значение справочника':error.code==='23514'?'Нарушено ограничение предметной области':'Конкурирующая операция: повторите запрос';}
  else console.error(error);
  host.switchToHttp().getResponse().status(status).json({error:code,message});
 }
}
@Module({controllers:[IncidentController],providers:[Database,PgIncidentRepository,{provide:IncidentRepository,useExisting:PgIncidentRepository},ResourceRepository,AuditRepository,IncidentService]})
export class AppModule {}
async function bootstrap(){const app=await NestFactory.create(AppModule);app.useGlobalFilters(new ApiErrorFilter());app.enableShutdownHooks();await app.listen(Number(process.env.PORT||3028),'127.0.0.1');console.log('AEGIS учебный API: http://127.0.0.1:3028');}
if(require.main===module)bootstrap().catch(error=>{console.error(error);process.exitCode=1;});
