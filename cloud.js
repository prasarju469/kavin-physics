/* Same Firebase account/rules as maths; separate Physics payload, merge-only writes. */
window.PhysicsCloud=(()=>{
  const config=window.PHYSICS_CONFIG||{};
  const C={enabled:!!config.firebase,email:'',name:'',role:'local',status:'local',message:''};
  let auth,db,timer,pending=null,writing=null,account=null,offAccount=null;
  const notify=(status,message='')=>{C.status=status;C.message=message;window.dispatchEvent(new Event('physics-cloud-status'));};
  const norm=e=>String(e||'').trim().toLowerCase();
  const screen=html=>{document.getElementById('main').innerHTML=`<section class="auth-screen"><div class="auth-orbit">⚡</div><div class="eyebrow">QUANTUM QUEST · PLAYER LOGIN</div><div class="panel auth-panel">${html}</div></section>`;};
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');const timeout=setTimeout(()=>reject(new Error('Sign-in service timed out.')),20000);s.src=src;s.onload=()=>{clearTimeout(timeout);resolve();};s.onerror=()=>{clearTimeout(timeout);reject(new Error('Cannot reach the sign-in service.'));};document.head.appendChild(s);});
  const codeMessage=e=>({
    'auth/popup-blocked':'Allow the Google sign-in popup for this site, then try again.',
    'auth/popup-closed-by-user':'The sign-in window was closed. You can try again.',
    'auth/unauthorized-domain':'This site address must be added to Firebase Authentication’s authorised domains.',
    'auth/network-request-failed':'Cannot reach Google sign-in. Check the connection and try again.',
    'permission-denied':'This account does not have permission to access this course.'
  }[e?.code]||'Check the connection and try again.');
  C.ready=async()=>{
    if(!C.enabled)return;
    document.body.classList.add('auth-locked');screen('<h1>POWERING UP…</h1><p>Connecting to your Google player profile.</p>');
    try{
      const base='https://www.gstatic.com/firebasejs/10.12.2/';
      await load(base+'firebase-app-compat.js');await load(base+'firebase-auth-compat.js');await load(base+'firebase-firestore-compat.js');
      const app=firebase.apps.length?firebase.app():firebase.initializeApp(config.firebase);
      auth=app.auth();db=app.firestore();
      const user=await new Promise((resolve,reject)=>{const off=auth.onAuthStateChanged(u=>{off();resolve(u);},reject);});
      if(user)await accept(user);else await login();
      offAccount=auth.onAuthStateChanged(u=>{if((u?.uid||null)!==account)location.reload();});notify('connected');
    }catch(e){screen(`<h1>CONNECTION PAUSED.</h1><p>${codeMessage(e)}</p><p>Your saved progress stays on this browser.</p><button class="btn primary" id="auth-reload">Try again</button>`);document.getElementById('auth-reload').onclick=()=>location.reload();if(auth?.currentUser){const out=document.createElement('button');out.className='btn';out.textContent='Switch Google account';out.onclick=C.signOut;document.querySelector('.auth-panel').appendChild(out);}throw e;}
  };
  async function accept(user){
    if(!user.email||!user.emailVerified)throw new Error('A verified Google email is required.');
    const email=norm(user.email);let role;
    try{await db.collection('users').limit(1).get({source:'server'});role='teacher';}
    catch(e){if(e.code!=='permission-denied')throw e;await db.collection('users').doc(email).get({source:'server'});role='student';}
    const view=await window.LearnerView?.select({auth,db,user});C.preview=!!view?.parent;if(!C.preview)await window.PlayerProfile?.connect({auth,db,user,role});C.email=email;C.name=C.preview?view.name:(window.PlayerProfile?.name()||user.displayName||email);C.role=role;account=user.uid;if(!C.preview)window.LearningTracker?.start({subject:'physics',email,auth,db,role});
  }
  function login(){
    return new Promise(resolve=>{
      screen('<h1>READY, PLAYER ONE?</h1><p>Sign in with your Google account to save your Physics quest across devices.</p><p>Students enter the adventure. Teachers get a student-progress dashboard.</p><button class="btn primary" id="google-login">Sign in with Google ▶</button><p class="auth-error" id="auth-error" role="alert"></p><p class="muted">Use the same approved Google account as the maths game. Google handles your password.</p>');
      const button=document.getElementById('google-login');button.onclick=async()=>{button.disabled=true;document.getElementById('auth-error').textContent='';try{const provider=new firebase.auth.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});const result=await auth.signInWithPopup(provider);await accept(result.user);resolve();}catch(e){document.getElementById('auth-error').textContent=e?.code==='permission-denied'?'This Google account is not approved for the course. Try the account you use for maths.':codeMessage(e);await auth.signOut().catch(()=>{});button.disabled=false;}};
    });
  }
  const decode=record=>{
    try{const d=JSON.parse(record?.physics?.data||'null');return d?.version===1?d:null;}catch{return null;}
  };
  C.load=async local=>{
    if(C.preview)return window.LearnerView.data('physics');
    if(!C.enabled)return local;
    const snap=await db.collection('users').doc(C.email).get({source:'server'}),remote=decode(snap.exists?snap.data():null);
    if(remote&&(!local||(remote.updated||0)>=(local.updated||0))){if(local)window.PhysicsRewards.merge(remote,local);notify('saved');return remote;}
    if(local&&remote)window.PhysicsRewards.merge(local,remote);return local;
  };
  async function write(){
    if(writing)return writing;
    if(C.preview||!pending||!auth?.currentUser||auth.currentUser.uid!==account)return;
    const snapshot=pending,accountUid=account;pending=null;notify('saving');
    writing=window.SharedRewards.saveSubject(db,db.collection('users').doc(C.email),'physics',snapshot,window.PhysicsRewards,{name:C.name,role:C.role})
      .then(()=>{if(auth.currentUser?.uid!==accountUid)return;if(pending)window.PhysicsRewards.merge(pending,snapshot);window.dispatchEvent(new CustomEvent('physics-rewards-merged',{detail:snapshot}));notify(pending?'pending':'saved');})
      .catch(e=>{if(!pending)pending=snapshot;notify('error',codeMessage(e));throw e;})
      .finally(()=>{writing=null;});
    return writing;
  }
  C.push=data=>{
    if(C.preview||!C.enabled||!C.email)return;
    pending=JSON.parse(JSON.stringify(data));notify('pending');clearTimeout(timer);
    timer=setTimeout(()=>C.flush().catch(()=>{}),1000);
  };
  C.flush=async()=>{clearTimeout(timer);if(writing)await writing;while(pending&&auth?.currentUser?.uid===account)await write();};
  C.signOut=async()=>{await window.LearningTracker?.flush().catch(()=>{});window.LearningTracker?.stop();if(offAccount)offAccount();try{await C.flush();}catch{/* Account-specific local cache keeps unsent progress. */}clearTimeout(timer);pending=null;await auth.signOut();location.reload();};
  C.watchStudents=(onData,onError)=>{
    if(C.role!=='teacher'){onError(new Error('Teacher access required.'));return ()=>{};}
    return db.collection('users').onSnapshot(snap=>onData(snap.docs.filter(x=>x.id!==C.email&&x.data().role!=='teacher').map(x=>({email:x.id,name:x.data().name||x.id,progress:decode(x.data()),updated:x.data().physics?.updated||0}))),onError);
  };
  window.addEventListener('online',()=>C.flush().catch(()=>{}));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')C.flush().catch(()=>{});});
  C.showBootError=()=>{screen('<h1>PROGRESS IS SAFE.</h1><p>Your cloud save could not be checked. Reconnect and retry before starting so an older copy does not replace your progress.</p><button class="btn primary" id="auth-reload">Reconnect</button><button class="btn" id="auth-signout">Switch account</button>');document.getElementById('auth-reload').onclick=()=>location.reload();document.getElementById('auth-signout').onclick=C.signOut;};
  return C;
})();
