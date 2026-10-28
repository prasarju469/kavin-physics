/* Editing is the shared presentation baseline; subject data and scenes stay in their own apps. */
(function(){
 const header=document.querySelector('body>header');if(!header)return;
 header.classList.add('learning-header');
 const row=document.createElement('div');row.className='learning-header-row';
 for(const node of [...header.children])if(node.tagName!=='NAV')row.appendChild(node);
 header.prepend(row);
 const tabs=document.querySelector('#tabs,.practice-tabs')||header.querySelector('nav');
 tabs?.classList.add('learning-tabs');if(tabs&&['coding','english'].includes(document.body.dataset.learningSubject))header.appendChild(tabs);
 const hud=document.querySelector('#hud');if(hud&&hud.closest('nav'))row.appendChild(hud);
 let metrics=row.querySelector('.header-account');
 if(!metrics){metrics=document.createElement('div');metrics.className='learning-header-metrics';row.appendChild(metrics);for(const n of [...row.children])if(n.matches('.xp-card,.completion-card,.token-card,.subject-token-card,#hud'))metrics.appendChild(n);}
 const actions=document.createElement('div');actions.className='learning-account-actions';row.appendChild(actions);
 function arrange(){
  const token=header.querySelector('.subject-token-card');if(token&&token.parentElement!==metrics)metrics.appendChild(token);
  for(const id of ['signOut','signout','sign-out']){const n=document.getElementById(id);if(n&&n.parentElement!==actions)actions.appendChild(n);}
 }
 arrange();new MutationObserver(arrange).observe(document.body,{childList:true,subtree:true});
 function active(){if(!tabs||tabs.id==='tabs'||tabs.classList.contains('practice-tabs'))return;const hash=location.hash||'#/';for(const link of tabs.querySelectorAll('a[href^="#/"]')){const match=link.getAttribute('href')===hash;link.classList.toggle('active',match);if(match)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}}
 active();window.addEventListener('hashchange',active);
})();
