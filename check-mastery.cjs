const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={window:{},Math,Number,Date};vm.createContext(ctx);
for(const f of ['questions.js','question-depth.js','widgets.js','mastery.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
const {PhysicsQuestions:Q,PhysicsMastery:M,PhysicsGame:G}=ctx.window,now=1800000000000,D=86400000;
const d={labs:{1:true},skills:{'1:magnitude':true},sessions:{old:{}},arcade:{claims:{1:now},reviews:{1:{stage:3}},boss:true},history:[]};
G.sync(d,now);assert.equal(G.certified(d,1),false);assert.equal(d.mastery.legacy.arcade.boss,true);assert.equal(Object.keys(d.sessions).length,0);assert.equal(d.skills['1:magnitude'],true);
const run=id=>{const questions=Q.qualification(id);return {questions,states:questions.map(()=>({done:true,clean:true}))};};
for(let id=1;id<=7;id++)for(let i=0;i<100;i++){
 const r=run(id);assert.equal(r.questions.length,10);assert.equal(new Set(r.questions.map(q=>q.skill)).size,5);
 for(const q of r.questions){assert.ok(q.prompt&&q.hint&&q.explanation);if(q.type==='choice'){assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.answer]);}else q.answer.forEach(x=>assert.ok(Number.isFinite(x)));}
}
const bad=run(1);bad.states[9].clean=false;assert.equal(M.qualify(d,1,bad,now),false);assert.equal(G.certified(d,1),false);
const good=run(1);assert.equal(M.qualify(d,1,good,now),true);G.sync(d,now);assert.equal(G.certified(d,1),true);assert.equal(G.sync(d,now).length,0);
assert.equal(M.recall(d,1,run(1),now+D-1),false);assert.equal(M.recall(d,1,run(1),now+D),true);
const t=M.topic(d,1);assert.equal(t.due,now+3*D);M.fail(d,1,'memory','magnitude',now+2*D);assert.equal(t.retention,1,'Early practice errors must not reset earned retention');assert.equal(t.due,now+3*D);M.fail(d,1,'memory','magnitude',now+3*D);assert.equal(t.retention,0);assert.equal(t.due,now+4*D);assert.equal(t.lapses,1);assert.equal(t.resets,2);
assert.equal(M.recall(d,1,run(1),now+3*D),false);
for(const day of [4,6,10,17,33])assert.equal(M.recall(d,1,run(1),now+day*D),true);
assert.equal(t.retention,5);assert.equal(t.due,null);assert.equal(M.status(d,1),'RETAINED');assert.equal(M.recall(d,1,run(1),now+100*D),false);
const short=run(2);short.questions.pop();short.states.pop();assert.equal(M.qualify(d,2,short,now),false);
const hinted=run(2);hinted.states[0].clean=false;assert.equal(M.qualify(d,2,hinted,now),false);
const reload=JSON.parse(JSON.stringify(d));G.sync(reload);assert.equal(reload.mastery.topics[1].retention,5);assert.equal(reload.mastery.topics[1].resets,2);
const boss=Q.boss();assert.equal(boss.length,35);assert.equal(new Set(boss.map(q=>q.station+':'+q.skill)).size,35);
// Independent numerical oracles for newly generated application questions.
for(let i=0;i<100;i++){
 const vector=Q.depth[7][4]();assert.ok(Math.abs(vector.answer[0]-Math.hypot(vector.diagram.a,vector.diagram.b)*vector.diagram.scale)<1e-8);assert.equal(vector.answer[1],Math.round(Math.atan2(vector.diagram.b,vector.diagram.a)*180/Math.PI));assert.ok(ctx.window.PhysicsWidgets.diagram(vector.diagram).includes('Head-to-tail'));
 const q=Q.depth[3][2](),v=[...q.prompt.matchAll(/\d+/g)].map(m=>+m[0]);assert.equal(q.answer[0],v[0]/v[1]*1000);
 const c=Q.depth[5][4](),ns=[...c.prompt.matchAll(/\d+(?:\.\d+)?/g)].map(m=>+m[0]);assert.ok(Math.abs(c.answer[0]-(ns[2]-ns[1])/(ns[0]-1))<1e-10);
}
console.log('Passed: 700 balanced qualification runs; distinct choices; migration; strict qualification; early recall rejection; lapse and 30-day ladder; reload; all 35 boss families; independent application calculations.');
