/* Editing is the shared presentation baseline; subject data and scenes stay in their own apps. */
(function(){
 const header=document.querySelector('body>header');if(!header)return;
 header.classList.add('learning-header');
 const row=document.createElement('div');row.className='learning-header-row';
 for(const node of [...header.children])if(node.tagName!=='NAV')row.appendChild(node);
 header.prepend(row);
 const tabs=document.querySelector('#tabs,.practice-tabs')||header.querySelector('nav');
 tabs?.classList.add('learning-tabs');if(tabs&&['coding','english'].includes(document.body.dataset.learningSubject))header.appendChild(tabs);
 if(tabs){
  const strip=document.createElement('div');strip.className='learning-tab-strip';
  const left=document.createElement('button'),right=document.createElement('button');
  for(const [button,label,glyph]of [[left,'Scroll tabs left','‹'],[right,'Scroll tabs right','›']]){button.type='button';button.className='tab-scroll';button.setAttribute('aria-label',label);button.textContent=glyph;}
  tabs.before(strip);strip.append(left,tabs,right);if(!tabs.id)tabs.id='learning-sections';left.setAttribute('aria-controls',tabs.id);right.setAttribute('aria-controls',tabs.id);tabs.tabIndex=0;if(!tabs.hasAttribute('aria-label'))tabs.setAttribute('aria-label','Learning sections');
  function updateScroll(){const overflow=tabs.scrollWidth>tabs.clientWidth+2;strip.dataset.overflow=String(overflow);left.hidden=right.hidden=!overflow;left.disabled=tabs.scrollLeft<2;right.disabled=tabs.scrollLeft+tabs.clientWidth>=tabs.scrollWidth-2;}
  const move=direction=>tabs.scrollBy({left:direction*Math.max(160,tabs.clientWidth*.75),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  left.onclick=()=>move(-1);right.onclick=()=>move(1);tabs.addEventListener('scroll',updateScroll,{passive:true});
  tabs.addEventListener('keydown',event=>{if(event.target!==tabs)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();tabs.scrollTo({left:event.key==='Home'?0:tabs.scrollWidth,behavior:'instant'});}});
  new ResizeObserver(updateScroll).observe(tabs);new MutationObserver(updateScroll).observe(tabs,{childList:true});updateScroll();
 }
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
