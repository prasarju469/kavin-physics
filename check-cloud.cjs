/* No real accounts or network calls: checks both subjects against an in-memory Firestore. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function setup({role='student',denied=false,records={},fail=false}={}){
  const writes=[],callbacks=new Set(),user={uid:'test-uid',email:'learner@example.test',emailVerified:true,displayName:'Test Player'};
  let reloads=0;
  const auth={currentUser:user,onAuthStateChanged(fn){callbacks.add(fn);queueMicrotask(()=>{if(callbacks.has(fn))fn(auth.currentUser);});return ()=>callbacks.delete(fn);},async signOut(){auth.currentUser=null;for(const fn of callbacks)fn(null);}};
  const error=()=>Object.assign(new Error('Permission denied'),{code:'permission-denied'});
  const snap=(email)=>({exists:!!records[email],data:()=>records[email]});
  const db={collection(name){assert.equal(name,'users');return {
    limit(){return {get:async()=>{if(role!=='teacher')throw error();return {docs:[]};}};},
    doc(email){return {get:async()=>{if(denied)throw error();return snap(email);},set:async(payload,options)=>{if(fail)throw new Error('Simulated network failure');writes.push({email,payload,options});records[email]=options?.merge?{...(records[email]||{}),...payload}:payload;}};},
    onSnapshot(cb){if(role!=='teacher')throw error();cb({docs:Object.entries(records).map(([id,d])=>({id,data:()=>d}))});return ()=>{};},
    get:async()=>({docs:Object.entries(records).map(([id,d])=>({id,data:()=>d}))})
  };}};
  const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',className:'',onclick:null,appendChild(){}});return nodes.get(id);};
  const app={auth:()=>auth,firestore:()=>db};const firebase={apps:[],initializeApp:()=>app,app:()=>app,auth:()=>auth,firestore:()=>db};
  const ctx={window:{PHYSICS_CONFIG:{firebase:{projectId:'test'}},KQ_CONFIG:{firebase:{projectId:'test'}},dispatchEvent(){},addEventListener(){}},document:{body:{classList:{add(){},remove(){}}},getElementById:node,querySelector:node,createElement:()=>({}),head:{appendChild:s=>queueMicrotask(()=>s.onload())},addEventListener(){}},firebase,location:{reload(){reloads++;}},setTimeout,clearTimeout,Event,console};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/cloud.js','utf8'),ctx);
  return {ctx,C:ctx.window.PhysicsCloud,auth,records,writes,setFail:v=>fail=v,get reloads(){return reloads;}};
}
(async()=>{
  const mathData=JSON.stringify({done:{1:true},updated:100});
  const env=setup({records:{'learner@example.test':{data:mathData,updated:100,role:'student',name:'Test Player'}}});
  await env.C.ready();assert.equal(env.C.role,'student');assert.equal(env.C.email,'learner@example.test');assert.equal(await env.C.load(null),null);
  const physics={version:1,updated:200,labs:{5:true},skills:{},stats:{}};
  env.C.push(physics);physics.labs[6]=true;await env.C.flush();
  assert.equal(env.records['learner@example.test'].data,mathData,'Physics must preserve maths data');
  assert.equal(env.records['learner@example.test'].updated,100,'Physics must not change the maths timestamp');
  assert.equal(env.writes[0].options.merge,true);assert.equal(JSON.parse(env.records['learner@example.test'].physics.data).labs[6],undefined,'Queued data is a snapshot');
  assert.equal((await env.C.load({version:1,updated:150})).updated,200,'A newer cloud copy wins');
  assert.equal((await env.C.load({version:1,updated:300})).updated,300,'A newer account-local copy is retained');
  env.C.push({version:1,updated:400,stats:{}});env.setFail(true);await assert.rejects(env.C.flush());assert.equal(env.C.status,'error');
  env.setFail(false);await env.C.flush();assert.equal(JSON.parse(env.records['learner@example.test'].physics.data).updated,400,'Retry saves the retained pending copy');
  let refused=false;env.C.watchStudents(()=>{},()=>refused=true);assert.equal(refused,true,'Student report subscriptions are blocked');
  // Run the actual maths writer to ensure the companion fix preserves Physics.
  const mathsPath=__dirname+'/../kavin-quadratics/cloud.js';const actualMaths=fs.existsSync(mathsPath);if(actualMaths){vm.runInContext(fs.readFileSync(mathsPath,'utf8')+';window.MathCloud=Cloud;',env.ctx);
  const maths=env.ctx.window.MathCloud;await maths.ready();await maths.push({done:{1:true,2:true},updated:500},true);
  assert.equal(JSON.parse(env.records['learner@example.test'].physics.data).updated,400,'Maths must preserve Physics');
  assert.equal(JSON.parse(env.records['learner@example.test'].data).updated,500);}
  const denied=setup({denied:true});await assert.rejects(denied.C.ready());assert.equal(denied.C.email,'','Unapproved users must never become players');
  const teacher=setup({role:'teacher',records:{'student@example.test':{name:'Learner',role:'student',physics:{data:JSON.stringify({version:1,updated:200}),updated:200}},'other@example.test':{name:'New learner',role:'student',data:'{}'},'teacher@example.test':{role:'teacher'}}});
  await teacher.C.ready();assert.equal(teacher.C.role,'teacher');let students;teacher.C.watchStudents(list=>students=list,e=>{throw e;});assert.equal(students.length,2);assert.equal(students.find(s=>s.email==='student@example.test').progress.version,1);assert.equal(students.find(s=>s.email==='other@example.test').progress,null);
  const writes=env.writes.length;env.auth.currentUser={uid:'different-account',email:'other@example.test'};env.C.push({version:1,updated:600});await env.C.flush();assert.equal(env.writes.length,writes,'A changed identity must not write the previous user’s progress');
  env.auth.currentUser={uid:'test-uid'};await env.C.flush();await env.C.signOut();assert.ok(env.reloads>=1);
  console.log('Passed: Google account/role gates; rejected accounts; account-bound writes; newer-save recovery; retry after network failure; snapshot isolation; live teacher report mapping; Physics preserves maths data; companion maths merge verified when its checkout is available.');
})().catch(e=>{console.error(e);process.exitCode=1;});
