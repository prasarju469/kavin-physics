/* Shared assessment rewards. 500 XP = $1. Earned XP is never spent by games. */
(function(root){
'use strict';
const VERSION=1,XP_PER_DOLLAR=500,TABLE=Object.freeze([0,2,4,6,8,15,25,40,60,80,100]);
const number=n=>Math.max(0,Math.trunc(Number(n)||0));
const copy=o=>JSON.parse(JSON.stringify(o));
function entitlement(correct,questions){if(!Number.isInteger(questions)||questions<1||!Number.isInteger(correct)||correct<0||correct>questions)throw Error('Invalid completed assessment');return Math.round(TABLE[Math.floor(correct*10/questions)]*questions/10);}
function recompute(s){const l=s.rewardLedger;l.total=l.openingXp+number(l.carriedXp)+Object.values(l.activities).reduce((n,a)=>n+Math.max(0,a.bestXp-a.baselineXp),0);s.xp||={};s.xp.total=l.total;return l.total;}
function init(s,subject,opening=0,seeds={}){
 if(s.rewardLedger){if(s.rewardLedger.version!==VERSION||s.rewardLedger.subject!==subject)throw Error('Unsupported XP ledger; progress was not changed');const credited=Math.max(number(s.xp?.total),number(s.rewardLedger.total)),total=recompute(s);if(credited>total){s.rewardLedger.carriedXp=number(s.rewardLedger.carriedXp)+credited-total;return recompute(s);}return total;}
 const preserved=Math.max(number(opening),number(s.xp?.total));
 s.rewardLedger={version:VERSION,subject,openingXp:preserved,carriedXp:0,total:preserved,migratedAt:Date.now(),previousXp:s.xp?copy(s.xp):null,activities:{}};
 for(const [id,value] of Object.entries(seeds)){const xp=number(value);s.rewardLedger.activities[id]={baselineXp:xp,bestXp:xp};}
 return recompute(s);
}
function award(s,id,correct,questions){if(!s.rewardLedger)throw Error('Initialise the XP ledger first');if(typeof id!=='string'||!id||id.length>200)throw Error('Stable assessment ID required');const target=entitlement(correct,questions),l=s.rewardLedger,a=l.activities[id]||(l.activities[id]={baselineXp:0,bestXp:0});if(a.questions&&a.questions!==questions)throw Error('Assessment question count changed; use a new content ID');a.questions=questions;const earned=Math.max(0,target-a.bestXp);a.bestXp=Math.max(a.bestXp,target);a.bestScore=Math.max(a.bestScore||0,correct);recompute(s);return earned;}
function mergeInto(target,other){
 const a=target.rewardLedger,b=other.rewardLedger;if(!a||!b||a.version!==b.version||a.subject!==b.subject)throw Error('Cannot merge incompatible XP ledgers');
 a.openingXp=Math.max(a.openingXp,b.openingXp);a.carriedXp=Math.max(number(a.carriedXp),number(b.carriedXp));
 for(const [id,v]of Object.entries(b.activities)){if(!a.activities[id])a.activities[id]=copy(v);else{const t=a.activities[id];if(t.questions&&v.questions&&t.questions!==v.questions)throw Error('Assessment definition conflict');t.baselineXp=Math.max(t.baselineXp,v.baselineXp);t.bestXp=Math.max(t.bestXp,v.bestXp);t.bestScore=Math.max(t.bestScore||0,v.bestScore||0);t.questions=t.questions||v.questions;}}
 // Reconciliation must never lower a balance, even when old migrations had different baselines.
 const floor=Math.max(number(a.total),number(b.total));let total=recompute(target);if(total<floor){a.carriedXp+=floor-total;total=recompute(target);}return total;
}
async function saveSubject(db,ref,field,incoming,policy,extra={}){
 policy.ensure(incoming);
 await db.runTransaction(async tx=>{const snap=await tx.get(ref),record=snap.exists?snap.data():{},encoded=field?record[field]?.data:record.data;
  if(encoded){let old;try{old=JSON.parse(encoded)}catch{throw Error('Existing cloud progress could not be decoded; refusing to overwrite it');}policy.merge(incoming,old);}
  const value={data:JSON.stringify(incoming),updated:incoming.updated||Date.now(),schema:1};
  tx.set(ref,field?{...extra,[field]:value}:{...extra,data:value.data,updated:value.updated},{merge:true});
 });return incoming;
}
const dollars=xp=>number(xp)/XP_PER_DOLLAR;
const cash=xp=>'$'+dollars(xp).toFixed(number(xp)%5?3:2);
const api={VERSION,XP_PER_DOLLAR,TABLE,entitlement,init,award,mergeInto,saveSubject,dollars,cash};root.SharedRewards=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
