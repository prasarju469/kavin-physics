/* Parent inspection uses server-authorized reads, never learner impersonation. */
(function(root){
const V={readOnly:false,current:null};let uid='';
const clone=x=>JSON.parse(JSON.stringify(x));
function name(record,email=''){const value=record.learningProfile?.displayName||record.name||'Learner';return root.PlayerProfile?.resolveName?.(email,value)??value;}
async function select({auth,db,user}){
 if(!user?.emailVerified)throw Error('Verified account required');let list;
 try{list=await db.collection('users').get({source:'server'});}catch(e){if(e.code!=='permission-denied')throw e;clear();return {parent:false};}
 if(auth.currentUser?.uid!==user.uid)throw Error('Account changed');
 const candidates=list.docs.filter(d=>d.id!==user.email.toLowerCase()&&d.id.includes('@')&&d.data().role!=='teacher').map(d=>({id:d.id,name:name(d.data(),d.id),record:clone(d.data())}));
 if(!candidates.length)throw Error('No learner record available');
 let saved;try{saved=sessionStorage.getItem('learner-view:'+user.uid);}catch{}
 const selected=candidates.find(d=>d.id===saved)||candidates[0];uid=user.uid;V.readOnly=true;V.current=selected;
 document.body?.classList.add('learner-readonly');arm();return {parent:true,...selected,candidates};
}
function clear(){V.readOnly=false;V.current=null;if(typeof document==='undefined')return;document.body?.classList.remove('learner-readonly');document.getElementById('learner-view-label')?.remove();for(const n of document.querySelectorAll('[data-preview-locked]')){n.disabled=n.getAttribute('data-preview-was-disabled')==='true';n.removeAttribute('data-preview-locked');n.removeAttribute('data-preview-was-disabled');}}
function choose(id){if(!V.current)return;try{sessionStorage.setItem('learner-view:'+uid,id);}catch{}}
function data(subject){if(!V.current)return null;const r=V.current.record,raw=subject==='maths'?r.data:r[subject]?.data;if(raw==null)return null;const d=JSON.parse(raw);if(!d||typeof d!=='object'||Array.isArray(d))throw Error('Unreadable learner save');return clone(d);}
function navigation(n){return !!n?.closest('header,nav,.learning-tabs,.practice-tabs,.lesson-steps,[aria-label="Learning steps"],summary,a,#next,#prev,#finishBreak,#gamesTab,#paperLine,#retry,[data-game]');}
function arm(){if(typeof document==='undefined'||!document.body)return;
 if(!document.getElementById('learner-readonly-style')){const s=document.createElement('style');s.id='learner-readonly-style';s.textContent='.learner-view-label{font:800 11px/1.4 Nunito,system-ui,sans-serif;color:#645d75;max-width:190px}.learner-view-label span{display:block}.learner-readonly [data-preview-locked]{cursor:default}';document.head.appendChild(s);}
 const refresh=()=>{if(!V.readOnly)return;const row=document.querySelector('.learning-account-actions');if(row&&!document.getElementById('learner-view-label')){const p=document.createElement('div');p.id='learner-view-label';p.className='learner-view-label';const n=document.createElement('span');n.textContent=V.current.name;const label=document.createElement('span');label.textContent='Read-only view';p.append(n,label);row.prepend(p);}
 for(const n of document.querySelectorAll('main input,main textarea,main select,main button,#subjectArcade button,#subjectArcade input')){if(navigation(n))continue;if(!n.hasAttribute('data-preview-locked')){n.setAttribute('data-preview-was-disabled',String(n.disabled));n.setAttribute('data-preview-locked','');}if(!n.disabled)n.disabled=true;}};
 refresh();if(!V.watching){V.watching=true;new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
 const stop=e=>{if(!V.readOnly||navigation(e.target))return;const n=e.target.closest('input,textarea,select,button,canvas,[contenteditable]');if(n){e.preventDefault();e.stopImmediatePropagation();}};for(const type of ['click','input','change','keydown','submit'])document.addEventListener(type,stop,true);}
}
Object.assign(V,{select,choose,data,name,clone,arm,clear});root.LearnerView=V;if(typeof module!=='undefined')module.exports=V;
})(typeof window==='undefined'?globalThis:window);
