import 'reflect-metadata';
import {Module,Controller,Get,Header,Injectable,NestMiddleware,MiddlewareConsumer,RequestMethod} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {readFileSync} from 'node:fs';import {join} from 'node:path';
import {Database} from '../shared/database';
import {IncidentRepository,PgIncidentRepository,ResourceRepository,AuditRepository} from '../shared/repository';
import {IncidentController} from '../shared/controller';
import {IncidentService} from '../shared/service';
import {ApiErrorFilter} from '../shared/main';
import {ResourceCatalog,PgResourceCatalog} from './resource.repository';
import {ResourceService} from './resource.service';import {ResourceController} from './resource.controller';
@Controller()
class DocsController {
 @Get('openapi.json') spec(){return JSON.parse(readFileSync(join(process.cwd(),'openapi.json'),'utf8'));}
 @Get('docs') @Header('Content-Type','text/html; charset=utf-8') docs(){return readFileSync(join(process.cwd(),'public/docs.html'),'utf8');}
}
@Module({controllers:[IncidentController,ResourceController,DocsController],providers:[Database,PgIncidentRepository,{provide:IncidentRepository,useExisting:PgIncidentRepository},ResourceRepository,AuditRepository,IncidentService,PgResourceCatalog,{provide:ResourceCatalog,useExisting:PgResourceCatalog},ResourceService]})
export class AppModule {}
export async function createApp(){const app=await NestFactory.create(AppModule,{logger:false});app.useGlobalFilters(new ApiErrorFilter());app.enableShutdownHooks();return app;}
if(require.main===module)createApp().then(async app=>{await app.listen(Number(process.env.PORT||3029),'127.0.0.1');console.log('Aegis API http://127.0.0.1:'+ (process.env.PORT||3029)+'/docs');}).catch(e=>{console.error(e);process.exitCode=1;});
