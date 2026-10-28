(function(root){
const T=root.SubjectGameTokens||(typeof require==='function'?require('./game-tokens.js'):null);
const R=root.SharedRewards||(typeof require==='function'?require('./shared-rewards.js'):null);
function oldValue(skills,labs,arcade){return Object.values(skills||{}).filter(Boolean).length*25+Object.values(labs||{}).filter(Boolean).length*60+Object.keys(arcade?.claims||{}).length*150+Object.values(arcade?.reviews||{}).reduce((n,r)=>n+(r.rewardedStage||r.stage||0)*100,0)+(arcade?.boss?300:0);}
function legacy(d){return Math.max(oldValue(d.skills,d.labs,d.arcade),oldValue(d.mastery?.legacy?.skills||d.skills,d.labs,d.mastery?.legacy?.arcade));}
function ensure(d){const seeds={};for(const [id,t] of Object.entries(d.mastery?.topics||{})){if(t.qualifiedAt)seeds['physics:topic:'+id]=100;const stage=Math.max(t.retention||0,d.arcade?.reviews?.[id]?.rewardedStage||0);for(let n=1;n<=stage;n++)seeds['physics:recall:'+id+':'+n]=100;}
for(const arcade of [d.arcade,d.mastery?.legacy?.arcade]){for(const [id]of Object.entries(arcade?.claims||{}))seeds['physics:topic:'+id]=100;for(const [id,r]of Object.entries(arcade?.reviews||{}))for(let n=1;n<=Math.max(r.stage||0,r.rewardedStage||0);n++)seeds['physics:recall:'+id+':'+n]=100;}
for(const h of d.history||[])if(h.total>0&&!h.reset){const id=h.mode==='memory'?null:h.mode==='boss'?'physics:boss':h.station?'physics:topic:'+h.station:'physics:mixed';if(id)seeds[id]=Math.max(seeds[id]||0,R.entitlement(Math.max(0,Math.min(h.total,h.clean||0)),h.total));}
if(d.arcade?.boss)seeds['physics:boss']=350;const total=R.init(d,'physics',legacy(d),seeds);T?.wallet(d,'physics');return total;}
function award(d,id,correct,n){ensure(d);const earned=R.award(d,'physics:'+id,correct,n);T?.wallet(d,'physics');return earned;}
function merge(a,b){ensure(a);ensure(b);const total=R.mergeInto(a,b);if(T)T.merge(a,b);return total;}
const api={ensure,award,merge,legacy,total:ensure};root.PhysicsRewards=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
