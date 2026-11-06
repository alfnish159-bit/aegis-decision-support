import {Body,Controller,Get,Post,Put,Delete,Param,Headers,HttpCode,Res} from '@nestjs/common';
import {validId} from '../shared/controller';
import {DomainError} from '../shared/domain';
import {resourceDto} from './dto';
import {ResourceService} from './resource.service';
export function actorId(value:unknown):string {if(!value)throw new DomainError('MISSING_ACTOR','Укажите X-User-Id',401);return validId(value);}
@Controller('resources')
export class ResourceController {
 constructor(private readonly service:ResourceService){}
 @Get(':id') get(@Param('id') id:string){return this.service.get(validId(id));}
 @Post() async create(@Body() raw:unknown,@Headers('x-user-id') actor:string,@Res({passthrough:true}) response:any){const result=await this.service.create(resourceDto(raw),actorId(actor));response.setHeader('Location',`/resources/${result.id}`);return result;}
 @Put(':id') replace(@Param('id') id:string,@Body() raw:unknown,@Headers('x-user-id') actor:string){return this.service.replace(validId(id),resourceDto(raw),actorId(actor));}
 @Delete(':id') @HttpCode(204) async remove(@Param('id') id:string,@Headers('x-user-id') actor:string){await this.service.remove(validId(id),actorId(actor));}
}
