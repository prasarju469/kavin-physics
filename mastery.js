/* Qualification evidence is separate from lifetime practice. */
(function(){
  const VERSION=2,DAY=86400000,INTERVALS=[1,3,7,14,30];
  function sync(d){
    if(d.mastery?.version===VERSION)return;
    d.mastery={version:VERSION,topics:{},events:[]};
    // Old badges remain in a historical snapshot; they cannot satisfy stricter gates.
    d.mastery.legacy={skills:{...d.skills},arcade:JSON.parse(JSON.stringify(d.arcade||{}))};
    d.arcade={avatar:d.arcade?.avatar||'cyan',claims:{},reviews:{},boss:false};d.sessions={};
  }
  const topic=(d,id)=>{sync(d);return d.mastery.topics[id]||=( {best:0,resets:0,qualifiedAt:null,retention:0,due:null,lapses:0});};
  function event(d,e){d.mastery.events.push({...e,at:Date.now()});d.mastery.events=d.mastery.events.slice(-200);}
  function fail(d,id,kind,skill,now=Date.now()){
    const t=topic(d,id);t.resets++;if(kind==='memory'&&t.due&&t.due<=now){t.retention=0;t.lapses++;t.due=now+DAY;const r=d.arcade.reviews[id];if(r){r.stage=0;r.due=t.due;}}
    event(d,{id,kind,skill,result:'reset'});
  }
  const flawless=s=>!s.failed&&!s.expired&&s.questions.length>0&&s.states.length===s.questions.length&&s.states.every(x=>x.done&&x.clean);
  function qualify(d,id,s,now=Date.now()){
    const t=topic(d,id);t.best=Math.max(t.best,s.states.filter(x=>x.clean).length);
    const keys=window.PhysicsQuestions.templates[id].map(f=>f().skill);
    if(!flawless(s)||s.questions.length!==10||!keys.every(k=>s.questions.filter(q=>q.station===id&&q.skill===k).length===2))return false;
    if(!t.qualifiedAt){t.qualifiedAt=now;t.due=now+DAY;}event(d,{id,kind:'qualification',result:'pass'});return true;
  }
  function recall(d,id,s,now=Date.now()){
    const t=topic(d,id);if(!t.qualifiedAt||!t.due||t.due>now||!flawless(s)||s.questions.length!==10)return false;
    const keys=window.PhysicsQuestions.templates[id].map(f=>f().skill);if(!keys.every(k=>s.questions.filter(q=>q.station===id&&q.skill===k).length===2))return false;
    t.retention++;t.lastRecall=now;t.due=t.retention===INTERVALS.length?null:now+(INTERVALS[t.retention]-INTERVALS[t.retention-1])*DAY;
    event(d,{id,kind:'memory',result:'pass'});return true;
  }
  const status=(d,id,now=Date.now())=>{const t=d.mastery?.version===VERSION?d.mastery.topics[id]:null;return !t?.qualifiedAt?'TRAINING':t.retention===5?'RETAINED':t.due<=now?'RECALL DUE':'QUALIFIED · RECALL PENDING';};
  window.PhysicsMastery={VERSION,INTERVALS,sync,topic,fail,flawless,qualify,recall,status};
})();
