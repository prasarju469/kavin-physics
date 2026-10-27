/* Run with node check-content.cjs. No dependencies or browser required. */
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const context={window:{},Math,Number};
vm.createContext(context);
for(const file of ['content.js','questions.js','widgets.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),context,{filename:file});
const {PhysicsQuestions:Q,PHYSICS_STATIONS:stations,PhysicsWidgets:W}=context.window;
assert.equal(stations.length,7);
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<Math.max(1e-12,Math.abs(expected)*1e-9),`${actual} differs from ${expected}`);
let count=0;
for(const station of stations){
  const skills=new Set();
  assert.equal(Q.templates[station.id].length,5);
  for(let template=0;template<5;template++)for(let run=0;run<40;run++){
    const q=Q.generate(station.id,template);count++;skills.add(q.skill);
    assert.equal(q.station,station.id);
    assert.ok(q.hint&&q.explanation&&q.prompt);
    if(q.type==='choice'){
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4,'Choices must be distinct');
      assert.ok(q.answer>=0&&q.answer<4);
    }else{
      assert.equal(q.answer.length,q.fields.length);
      q.answer.forEach(n=>assert.ok(Number.isFinite(n)));
      const clean=q.prompt.replace(/<[^>]+>/g,'').replaceAll(',','');
      const values=[...clean.matchAll(/(?:\d+(?:\.\d+)?)/g)].map(m=>Number(m[0]));
      // Independent dimensional factors and interval relationships check generated answers.
      const first=values[0];
      if(q.skill==='area')close(q.answer[0],first/100/100);
      if(q.skill==='area-reverse')close(q.answer[0],first*100*100);
      if(q.skill==='volume')close(q.answer[0],first/100/100/100);
      if(q.skill==='density')close(q.answer[0],first*1e-3/1e-6);
      if(q.skill==='time-conversion')close(q.answer[0]*60*60,first);
      if(q.skill==='prefix-down')close(q.answer[0]*1000,first);
      if(q.skill==='prefix-up')close(q.answer[0]/100,first);
      if(q.skill==='prefix-to-prefix')close(q.answer[0]*1e-9,first*1e-6);
      if(q.skill==='standard-form'){
        assert.ok(q.answer[0]>=1&&q.answer[0]<10);
        assert.ok(Number.isInteger(q.answer[1]));
        close(q.answer[0]*10**q.answer[1],first);
      }
      if(q.skill==='period')close(q.answer[0]*values[2],values[1]-values[0]);
      if(q.skill==='ruler-offset'){
        close(q.answer[0],q.diagram.end-q.diagram.start);
        assert.ok(q.diagram.start>0&&q.diagram.end<=8);
      }
      if(q.skill==='scale-reading'){
        assert.ok(q.diagram.value>=0&&q.diagram.value<=q.diagram.max);
        close(q.answer[0],q.diagram.value);
        close(q.diagram.value/(q.diagram.max/10),Math.round(q.diagram.value/(q.diagram.max/10)));
      }
      if(q.skill==='meniscus'){close(q.answer[0],q.diagram.value);assert.ok(q.diagram.value>=10&&q.diagram.value<=50);}
      if(q.skill==='same-direction')close(q.answer[0],q.diagram.a+q.diagram.b);
      if(q.skill==='opposite-direction'){
        close(q.answer[0],Math.abs(q.diagram.a+q.diagram.b));
        assert.equal(q.direction,q.diagram.a+q.diagram.b<0?'left':'right');
      }
      if(q.skill==='balanced')assert.equal(q.answer[0],0);
      if(q.diagram)assert.ok(W.diagram(q.diagram).includes('<svg'));
    }
  }
  assert.equal(skills.size,5,`Station ${station.id} needs five distinct skills`);
}
const mix=Q.session([1,2,3,4,5,6,7]);
assert.equal(mix.length,35);
assert.equal(new Set(mix.map(q=>`${q.station}:${q.skill}`)).size,35);
// A meniscus' quadratic curve is constructed so its midpoint is the target reading.
const drawing=W.cylinder(36.5);
assert.ok(drawing.includes('Q340 128 416 116'));
assert.ok(W.ruler(1.4,5.8).includes('cm'));
console.log(`Passed: ${count} generated questions across all 35 skills; units, calculations, diagram bounds, distinct choices and full-chapter coverage checked.`);
