/* Display names are separate from account IDs, subject saves and reward ledgers. */
(function(root){
 const clean=value=>String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ');
 const valid=value=>{const n=clean(value);return n.length>=2&&n.length<=24&&!/[<>\u0000-\u001f\u007f]/.test(n);};
 let context=null,dialog=null,button=null,off=null,offAuth=null;
 function label(){if(button)button.textContent=context?.name?context.name:'Your name';}
 function editor(required=false){
  if(dialog)return;const ctx=context;if(!ctx)return;
  dialog=document.createElement('dialog');dialog.className='player-profile-dialog';dialog.setAttribute('aria-labelledby','player-profile-heading');
  dialog.innerHTML='<form><h2 id="player-profile-heading">What should we call you?</h2><p>Choose a display name for your learning apps. You can change it later by selecting your name in the navigation bar.</p><label for="player-display-name">Display name</label><input id="player-display-name" name="displayName" minlength="2" maxlength="24" autocomplete="nickname" required><p class="profile-error" role="alert"></p><div class="profile-actions"><button type="submit" class="btn primary">Save name</button><button type="button" class="btn" data-cancel>Cancel</button></div><p class="muted">Your Google account keeps your XP and progress safe. Changing this name does not change your account.</p></form>';
  const style=document.createElement('style');style.textContent='.player-profile-dialog{box-sizing:border-box;width:min(460px,calc(100vw - 32px));padding:24px;border:2px solid #282238;border-radius:14px;background:#fffaf0;color:#282238;box-shadow:5px 5px 0 #282238;font:15px/1.6 Nunito,sans-serif}.player-profile-dialog::backdrop{background:#28223899}.player-profile-dialog h2{font:24px Lilita One,Nunito,sans-serif;margin:0 0 12px}.player-profile-dialog label{display:block;font-weight:800}.player-profile-dialog input{box-sizing:border-box;width:100%;padding:10px;border:2px solid #282238;border-radius:8px;font:inherit}.profile-actions{display:flex;gap:10px;flex-wrap:wrap}.profile-error{color:#ad2634}.player-profile-button{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';dialog.appendChild(style);document.body.appendChild(dialog);
  const node=dialog,input=node.querySelector('input'),error=node.querySelector('.profile-error');input.value=ctx.name||'';node.querySelector('[data-cancel]').hidden=required;
  function close(){node.close();node.remove();if(dialog===node)dialog=null;}
  node.addEventListener('cancel',e=>{if(required)e.preventDefault();else close();});node.querySelector('[data-cancel]').onclick=close;
  node.querySelector('form').onsubmit=async e=>{e.preventDefault();const name=clean(input.value);if(!valid(name)){error.textContent='Use 2–24 characters, without angle brackets or control characters.';return;}if(ctx.auth.currentUser?.uid!==ctx.uid){error.textContent='Your account changed. Reload and sign in again.';return;}const save=node.querySelector('[type=submit]');save.disabled=true;
   try{await ctx.ref.set({learningProfile:{displayName:name,version:1}},{merge:true});if(context!==ctx||ctx.auth.currentUser?.uid!==ctx.uid){close();return;}ctx.name=name;label();root.dispatchEvent(new CustomEvent('player-name-changed',{detail:{name}}));close();}catch{error.textContent='Could not save your name. Check the connection and try again.';save.disabled=false;}
  };node.showModal();input.focus();
 }
 async function connect({auth,db,user,role}){
  if(!user?.email)return;off?.();offAuth?.();off=null;offAuth=null;dialog?.close();dialog?.remove();dialog=null;button?.remove();button=null;
  const ref=db.collection('users').doc(user.email.trim().toLowerCase()),snap=await ref.get({source:'server'});if(auth.currentUser?.uid!==user.uid)return;
  const name=clean(snap.exists?snap.data().learningProfile?.displayName:'');context={auth,db,ref,uid:user.uid,name:valid(name)?name:''};
  const header=document.querySelector('.learning-header-row')||document.querySelector('body>header');if(header){button=document.createElement('button');button.type='button';button.className='btn player-profile-button';button.title='Change your display name';button.setAttribute('aria-label','Change your display name');button.onclick=()=>editor();const actions=header.querySelector('.learning-account-actions');if(actions)actions.prepend(button);else header.appendChild(button);Object.assign(button.style,{maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'});label();}
  off=ref.onSnapshot?.(s=>{if(context?.uid!==user.uid)return;const n=clean(s.data()?.learningProfile?.displayName);if(valid(n)){context.name=n;label();}},()=>{});
  offAuth=auth.onAuthStateChanged?.(u=>{if(u?.uid===user.uid)return;off?.();off=null;context=null;dialog?.close();dialog?.remove();dialog=null;button?.remove();button=null;});
  if(context&&!context.name&&role==='student')editor(true);
  return context?.name||'';
 }
 root.PlayerProfile={connect,clean,valid,name:()=>context?.name||''};
})(window);
