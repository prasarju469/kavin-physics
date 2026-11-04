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
function complete(s,id,correct,questions){entitlement(correct,questions);const previous=s.rewardLedger?.activities?.[id]?.bestScore||0,earned=award(s,id,questions,questions),a=s.rewardLedger.activities[id];a.bestScore=Math.max(previous,correct);a.completionCredited=true;return earned;}
function mergeInto(target,other){
 const a=target.rewardLedger,b=other.rewardLedger;if(!a||!b||a.version!==b.version||a.subject!==b.subject)throw Error('Cannot merge incompatible XP ledgers');
 a.openingXp=Math.max(a.openingXp,b.openingXp);a.carriedXp=Math.max(number(a.carriedXp),number(b.carriedXp));
 for(const [id,v]of Object.entries(b.activities)){if(!a.activities[id])a.activities[id]=copy(v);else{const t=a.activities[id];if(t.questions&&v.questions&&t.questions!==v.questions)throw Error('Assessment definition conflict');t.baselineXp=Math.max(t.baselineXp,v.baselineXp);t.bestXp=Math.max(t.bestXp,v.bestXp);t.bestScore=Math.max(t.bestScore||0,v.bestScore||0);t.questions=t.questions||v.questions;}}
 // Reconciliation must never lower a balance, even when old migrations had different baselines.
 const floor=Math.max(number(a.total),number(b.total));let total=recompute(target);if(total<floor){a.carriedXp+=floor-total;total=recompute(target);}return total;
}
const transient=e=>['unavailable','deadline-exceeded','aborted','resource-exhausted','internal','cancelled','unknown'].includes(String(e?.code||'').replace(/^firestore\//,''))||/offline|network|connection.*(?:lost|failed)|failed to fetch/i.test(e?.message||'');
function retryWait(ms){return new Promise(resolve=>{let timer;const done=()=>{clearTimeout(timer);root.removeEventListener?.('online',done);root.removeEventListener?.('focus',done);resolve();};timer=setTimeout(done,ms);root.addEventListener?.('online',done,{once:true});root.addEventListener?.('focus',done,{once:true});});}
async function retryTransaction(db,work,canWrite,wait=retryWait){let delay=1500;for(;;){if(!canWrite())throw Error('Read-only account or account changed');try{return await db.runTransaction(work);}catch(e){if(!canWrite()||!transient(e))throw e;await wait(delay);delay=Math.min(30000,delay*2);}}}
function mergeSaved(incoming,old,policy){if((old.updated||0)>(incoming.updated||0)){const local=copy(incoming);for(const key of Object.keys(incoming))delete incoming[key];Object.assign(incoming,copy(old));return policy.merge(incoming,local);}return policy.merge(incoming,old);}
async function saveSubject(db,ref,field,incoming,policy,extra={}){
 policy.ensure(incoming);
 await db.runTransaction(async tx=>{const snap=await tx.get(ref),record=snap.exists?snap.data():{},encoded=field?record[field]?.data:record.data;
  if(encoded){let old;try{old=JSON.parse(encoded)}catch{throw Error('Existing cloud progress could not be decoded; refusing to overwrite it');}mergeSaved(incoming,old,policy);}
  const value={data:JSON.stringify(incoming),updated:incoming.updated||Date.now(),schema:1};
  tx.set(ref,field?{...extra,[field]:value}:{...extra,data:value.data,updated:value.updated},{merge:true});
 });return incoming;
}
const dollars=xp=>number(xp)/XP_PER_DOLLAR;
const cash=xp=>'$'+dollars(xp).toFixed(number(xp)%5?3:2);
const api={VERSION,XP_PER_DOLLAR,TABLE,entitlement,complete,init,award,mergeInto,mergeSaved,retryTransaction,saveSubject,dollars,cash};root.SharedRewards=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
