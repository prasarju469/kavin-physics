/* Chapter structure only: existing topic IDs, saves and reward IDs remain unchanged. */
(function(root){
 const topics=[{id:1,name:'Physical quantities & SI units',tab:'01 Units'},{id:2,name:'Prefixes & standard form',tab:'02 Prefixes'},{id:3,name:'Converting units',tab:'03 Conversions'},{id:4,name:'Choosing measuring instruments',tab:'04 Instruments'},{id:5,name:'Readings & measurements',tab:'05 Measurements'},{id:6,name:'Measuring time & pendulums',tab:'06 Pendulums'},{id:7,name:'Scalars, vectors & resultants',tab:'07 Vectors'}];
 const complete=(d,id)=>!!(d.labs?.[id]&&d.mastery?.version===2&&d.mastery.topics?.[id]?.qualifiedAt);
 const started=(d,id)=>!!(d.labs?.[id]||d.stats?.[id]?.total||d.steps?.[id]?.length||Object.values(d.sessions||{}).some(s=>s.questions?.some(q=>q.station===id)));
 const open=(d,id)=>Number.isInteger(id)&&id>=1&&id<=7&&(complete(d,id)||started(d,id)||topics.filter(t=>t.id<id).every(t=>complete(d,t.id)));
 const allComplete=d=>topics.every(t=>complete(d,t.id));
 const api={topics,complete,started,open,allComplete};root.PhysicsCourse=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
