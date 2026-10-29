const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),C=require('./course.js'),P=require('./reward-policy.js');
const d={version:1,stats:{},steps:{},labs:{},sessions:{},skills:{},history:[],mastery:{version:2,topics:{}},xp:{total:1200}};
P.ensure(d);const before=JSON.stringify(d);assert.equal(C.open(d,1),true);for(let i=2;i<=7;i++)assert.equal(C.open(d,i),false);assert.equal(C.allComplete(d),false);assert.equal(JSON.stringify(d),before,'Checking access must not mutate saves');
d.labs[1]=true;assert.equal(C.open(d,2),false,'Guided work alone cannot unlock the next topic');
d.mastery.topics[1]={qualifiedAt:123,retention:0};assert.equal(C.open(d,2),true);assert.equal(C.open(d,3),false);
const legacy={...JSON.parse(before),labs:{5:true},stats:{5:{total:3,clean:2}},steps:{5:[0,1]}};assert.equal(C.open(legacy,5),true,'Retain access to existing work');assert.equal(C.open(legacy,6),false,'Old started work cannot bypass unfinished prerequisites');
for(let i=1;i<=7;i++){d.labs[i]=true;d.mastery.topics[i]={qualifiedAt:i};}assert.equal(C.allComplete(d),true);assert.equal(P.total(d),1200,'Unlocking never creates or removes XP');
const ctx={window:{PHYSICS_STATIONS:Array.from({length:7},(_,i)=>({id:i+1,lesson:''}))}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('guided-lessons.js','utf8'),ctx);const G=ctx.window.PhysicsGuided;
assert.equal(Object.keys(G.lessons).length,7);for(const lesson of Object.values(G.lessons)){assert.equal(lesson.steps.length,3);assert.ok(lesson.explain&&lesson.transfer);for(const [prompt,answer,explanation]of lesson.steps){assert.ok(prompt&&explanation);assert.equal(G.correct(answer,answer),true);assert.equal(G.correct('',answer),false);}}
assert.equal(G.correct(' MASS ','mass'),true);assert.equal(G.correct('0.0004','0.0004'),true);assert.equal(G.correct('0.04','0.0004'),false);assert.match(ctx.window.PHYSICS_STATIONS[4].lesson,/two position judgements/);
console.log('PASS: topic order, guided-plus-independent gates, legacy access, zero XP mutation, all seven guided lessons and chapter reading/measurement coverage.');
