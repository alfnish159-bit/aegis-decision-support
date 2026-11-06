const assert=require('node:assert/strict'),fs=require('node:fs');
fs.mkdirSync('screenshots',{recursive:true});const {createApp}=require('../dist/src/main');const {ResourceService}=require('../dist/src/resource.service');
(async()=>{const app=await createApp();await app.listen(0,'127.0.0.1');const base=await app.getUrl(),cases=[];try{
const doc=await fetch(base+'/docs');assert.equal(doc.status,200);assert((await doc.text()).includes('Aegis REST API'));cases.push('GET /docs: 200 HTML');
const spec=await(await fetch(base+'/openapi.json')).json();assert.equal(spec.openapi,'3.0.3');assert(spec.paths['/resources/{id}'].delete);cases.push('GET /openapi.json: specification served');
let r=await fetch(base+'/resources',{method:'POST',headers:{'Content-Type':'application/json'},body:'{broken'});assert.equal(r.status,400);cases.push('Malformed JSON: 400');
r=await fetch(base+'/absent-route');assert.equal(r.status,404);cases.push('Unknown route: 404');
const service=app.get(ResourceService),original=service.get;service.get=async()=>{throw Error('CONTROLLED_PRIVATE_FAILURE');};r=await fetch(base+'/resources/40000000-0000-4000-8000-999999999999');assert.equal(r.status,500);const body=await r.json();assert.deepEqual(body,{error:'INTERNAL_ERROR',message:'Внутренняя ошибка'});service.get=original;cases.push('Controlled service failure: 500 without internal details');
const before=await(await fetch(base+'/resources')).json();const after=await(await fetch(base+'/resources')).json();assert.deepEqual(after,before);cases.push('Repeated GET leaves resources unchanged');
fs.writeFileSync('screenshots/supporting-results.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:cases.length,cases},null,2));console.log('SUPPORTING',cases.length,'PASSED');
}finally{await app.close();}})().catch(e=>{console.error(e);process.exitCode=1});
