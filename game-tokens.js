/* Subject-local game credit. XP is never spent. Spending is a mergeable per-session counter. */
(function(root){
'use strict';
const PER_TOKEN=750,number=n=>Math.max(0,Math.trunc(Number(n)||0));
function wallet(s,subject=s.rewardLedger?.subject||s.gameTokens?.subject){
 if(!subject)throw Error('A subject is required for game tokens');
 const a=s.gameTokens||=( {version:1,subject,earned:0,spentBy:{}});
 if(a.version!==1||a.subject!==subject)throw Error('Cannot share game tokens across subjects');
 a.earned=Math.max(number(a.earned),number(s.rewardLedger?.total));a.spentBy||={};
 a.spent=Object.values(a.spentBy).reduce((n,v)=>n+number(v),0)/PER_TOKEN;
 a.creditMs=Math.max(0,a.earned*PER_TOKEN-Math.round(a.spent*PER_TOKEN));a.remaining=a.creditMs;a.tokens=a.creditMs/PER_TOKEN;return a;
}
function merge(a,b){const x=wallet(a),y=wallet(b);if(x.subject!==y.subject)throw Error('Cannot merge different subject wallets');x.earned=Math.max(x.earned,y.earned);for(const [id,ms]of Object.entries(y.spentBy))x.spentBy[id]=Math.max(number(x.spentBy[id]),number(ms));return wallet(a);}
function use(s,ms){const a=wallet(s),used=Math.min(a.remaining,number(ms)),id=a.session?.owner||'local';a.spentBy[id]=number(a.spentBy[id])+used;wallet(s);return used;}
function recover(s,now){const a=wallet(s);if(!a.session)return 0;const used=use(s,Math.min(2000,Math.max(0,now-a.session.at)));a.session=null;return used;}
const api={wallet,merge,use,recover,finish:s=>{wallet(s).session=null;},start:s=>wallet(s).remaining>0,canPlay:s=>wallet(s).remaining>0,PER_TOKEN,MINUTE:60000,COST:80};
root.SubjectGameTokens=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
