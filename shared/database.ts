import {Injectable,OnModuleDestroy} from '@nestjs/common';
import {Pool,PoolClient,QueryResultRow} from 'pg';
export interface SqlExecutor {
 query<T extends QueryResultRow=any>(text:string,values?:any[]):Promise<{rows:T[];rowCount:number|null}>;
}
/** Pool adapter: explicit abstraction for repository and sequence participants. */
@Injectable()
export class Database implements OnModuleDestroy {
 readonly pool = new Pool({connectionString: process.env.DATABASE_URL,max:8,options:'-c search_path=aegis,public'});
 async query<T extends QueryResultRow=any>(sql:string,params:any[]=[]){return this.pool.query<T>(sql,params);}
 async transaction<T>(work:(tx:PoolClient)=>Promise<T>):Promise<T>{
  const tx=await this.pool.connect();
  try {await tx.query('BEGIN');const value=await work(tx);await tx.query('COMMIT');return value;}
  catch(error){await tx.query('ROLLBACK');throw error;}
  finally{tx.release();}
 }
 async onModuleDestroy(){await this.pool.end();}
}
