const assert=require('node:assert/strict'),T=require('./game-tokens.js');
const fresh=(subject,xp=100)=>({rewardLedger:{subject,total:xp}}),copy=s=>JSON.parse(JSON.stringify(s));
for(const subject of ['maths','physics','coding']){
 const s=fresh(subject,234);assert.equal(T.wallet(s).tokens,234);T.wallet(s);assert.equal(s.gameTokens.earned,234,'opening credit once');
 s.gameTokens.session={owner:'a',at:0};assert.equal(T.use(s,750),750);assert.equal(T.wallet(s).tokens,233);assert.equal(s.rewardLedger.total,234,'spending never changes XP');
 s.rewardLedger.total=240;assert.equal(T.wallet(s).tokens,239,'new XP earns only the increment');const saved=copy(s);T.finish(saved);assert.equal(T.wallet(saved).tokens,239);
 const stale=copy(s);T.use(s,7500);T.merge(s,stale);assert.equal(T.wallet(s).tokens,229,'stale saves cannot refund spending');
 const b=copy(stale);b.gameTokens.session={owner:'b',at:0};T.use(b,1500);T.merge(s,b);assert.equal(T.wallet(s).tokens,227,'independent session debits merge');const before=copy(s);T.merge(s,b);assert.equal(s.gameTokens.tokens,before.gameTokens.tokens,'merge idempotent');
 T.use(s,999999999);assert.equal(T.wallet(s).tokens,0);assert(!T.canPlay(s));assert.equal(T.use(s,1000),0);
 const crash=fresh(subject);T.wallet(crash).session={owner:'crash',at:1000};assert.equal(T.recover(crash,99000),2000);assert.equal(T.recover(crash,99999),0);
 assert.throws(()=>T.wallet(s,'other'),/share/);assert.throws(()=>T.merge(s,fresh('other')),/different/);
}
console.log('PASS: per-subject one-time credit, new XP, unchanged XP, pause/reload, stale and concurrent merge, zero cutoff, crash recovery and cross-subject rejection.');

const Policy=require('./reward-policy.js');const a={xp:{total:100}},b={xp:{total:100}};Policy.ensure(a);Policy.ensure(b);a.gameTokens.session={owner:'first'};T.use(a,7500);b.gameTokens.session={owner:'second'};T.use(b,1500);Policy.merge(a,b);assert.equal(a.gameTokens.tokens,88);assert.equal(a.rewardLedger.total,100);Policy.award(a,'token-test',10,10);assert.equal(a.gameTokens.tokens,188);assert.equal(a.rewardLedger.total,200);console.log('PASS: subject reward/cloud merge keeps independent debits and earns new tokens once.');
