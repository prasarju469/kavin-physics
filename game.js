/* Original platform-world art and movement. Learning rewards come from evidence, not clicks. */
(function(){
  const worlds=[
    {name:'Unit Uplands',biome:'GRASSLAND',color:'#9bf268',icon:'◈',relic:'Unit Crystal'},
    {name:'Micro Mushroom Grove',biome:'GLOW FOREST',color:'#fd89cc',icon:'↗',relic:'Scale Crystal'},
    {name:'Dimension Dunes',biome:'DESERT',color:'#ffdc62',icon:'▧',relic:'Dimension Crystal'},
    {name:'Gadget Foundry',biome:'LAVA WORKS',color:'#ff9772',icon:'⚒',relic:'Gadget Crystal'},
    {name:'Parallax Reef',biome:'OCEAN',color:'#61e7f7',icon:'⌁',relic:'Focus Crystal'},
    {name:'Pendulum Peaks',biome:'SKY ISLANDS',color:'#b8b0ff',icon:'◷',relic:'Time Crystal'},
    {name:'Vector Citadel',biome:'FINAL WORLD',color:'#e3fa77',icon:'⇄',relic:'Vector Crystal'}
  ];
  const DAY=86400000;
  const skills=id=>window.PhysicsQuestions.templates[id].map(fn=>fn().skill);
  const certified=(d,id)=>!!d.labs[id]&&skills(id).every(s=>d.skills[`${id}:${s}`]);
  function sync(d,now=Date.now()){
    d.arcade||={claims:{},reviews:{},avatar:'cyan',sound:false};d.arcade.claims||={};d.arcade.reviews||={};
    const newClaims=[];
    for(let id=1;id<=7;id++)if(certified(d,id)&&!d.arcade.claims[id]){
      d.arcade.claims[id]=now;d.arcade.reviews[id]={stage:0,due:now+DAY,last:null};newClaims.push(id);
    }
    return newClaims;
  }
  function xp(d){return Object.values(d.skills).filter(Boolean).length*25+Object.values(d.labs).filter(Boolean).length*60+Object.keys(d.arcade?.claims||{}).length*150+Object.values(d.arcade?.reviews||{}).reduce((n,r)=>n+r.stage*100,0)+(d.arcade?.boss?300:0);}
  function rank(d){const points=xp(d),level=1+Math.floor(points/250),names=['Rookie Runner','Unit Scout','Scale Surfer','Lab Adventurer','Crystal Hunter','Physics Ranger','Quantum Knight','Realm Guardian'];return {points,level,name:names[Math.min(names.length-1,Math.floor((level-1)/2))],into:points%250};}
  const due=(d,now=Date.now())=>Object.entries(d.arcade?.reviews||{}).filter(([,r])=>r.stage<3&&r.due<=now).map(([id])=>+id);
  function review(d,id,passed,now=Date.now()){
    const r=d.arcade?.reviews[id];if(!r||r.stage>=3||r.due>now)return false;
    if(passed){r.stage++;r.last=now;r.due=r.stage===3?null:now+(r.stage===1?2:4)*DAY;return true;}
    r.due=now+DAY;r.last=now;return false;
  }
  function sprite(color='cyan'){
    const c={cyan:'#50e9ff',pink:'#ff82d4',lime:'#c7ff63'}[color]||'#50e9ff';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" shape-rendering="crispEdges" aria-hidden="true"><path fill="#241946" d="M6 0h12v3h3v3h3v12h-3v3h-3v3H6v-3H3v-3H0V6h3V3h3Z"/><path fill="#fff1af" d="M6 3h12v3h3v9h-3v3H6v-3H3V6h3Z"/><path fill="#2d3867" d="M6 7h12v7H6Z"/><path fill="#b7f9ff" d="M7 8h5v2H7Z"/><path fill="${c}" d="M6 18h12v8H6ZM2 19h4v6H2Zm16 0h4v6h-4Z"/><path fill="#ffe354" d="M9 19h6v5H9Z"/><path fill="#211b43" d="M5 26h6v4H5Zm8 0h6v4h-6Z"/></svg>`;
  }
  function gem(color='#72efff'){return `<svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 1L29 13V27L16 39L3 27V13Z" fill="${color}" stroke="#2c195a" stroke-width="2"/><path d="M16 1V39L3 27V13Z" fill="#fff" opacity=".25"/><path d="M3 13H29M3 27H29L16 13Z" fill="none" stroke="#fff" opacity=".5"/></svg>`;}
  const heights=[270,225,255,200,245,180,220];
  function mapMarkup(d){return `<div class="overworld" id="overworld" tabindex="0" role="region" aria-label="Playable world map. Arrow keys or A and D to move, Space to jump, E to enter the nearby world."><div class="map-landscape"><div class="pixel-cloud cloud-a"></div><div class="pixel-cloud cloud-b"></div><div class="pixel-cloud cloud-c"></div><div class="pixel-sun"></div><div class="mountain mountain-a"></div><div class="mountain mountain-b"></div><div class="mountain mountain-c"></div><div class="map-stars">✧　　　　　　　✦　　　　　　　　　✧　　　　　　　✦</div>${worlds.map((w,i)=>`<a class="world-portal ${certified(d,i+1)?'captured':''}" href="#/station/${i+1}" style="left:${85+i*158}px;top:${heights[i]-88}px;--world:${w.color}" aria-label="World ${i+1}: ${w.name}${certified(d,i+1)?', crystal captured':''}"><span class="portal-number">${i+1}-1</span><span class="portal-gem">${gem(w.color)}</span><span class="portal-name">${w.name}</span><span class="portal-flag">${certified(d,i+1)?'⚑':'?'}</span></a><div class="pixel-platform" style="left:${62+i*158}px;top:${heights[i]}px;width:112px;--world:${w.color}"></div>`).join('')}<div class="map-ground"></div><div class="pixel-bush bush-a"></div><div class="pixel-bush bush-b"></div><div class="map-player" id="map-player">${sprite(d.arcade?.avatar)}</div><div class="spawn-sign">START →</div></div></div><div class="map-toolbar"><div><span class="keyboard-hint">← →</span> MOVE <span class="keyboard-hint">SPACE</span> JUMP <span class="keyboard-hint">E</span> ENTER <span class="map-tip">or click any crystal portal</span></div><div class="touch-controls"><button class="pad" id="map-left" aria-label="Move left">◀</button><button class="pad" id="map-jump" aria-label="Jump">▲</button><button class="pad" id="map-right" aria-label="Move right">▶</button><button class="pad enter-pad" id="map-enter">ENTER</button></div></div><div id="map-status" class="map-status" role="status">Walk, jump, explore. Your physics skills capture the crystals.</div>`;}
  // Coordinate system: player y is the bottom of the sprite; platforms are one-way.
  function stepPlayer(p,keys,dt=1){
    p.x=Math.max(8,Math.min(1160,p.x+((keys.right?1:0)-(keys.left?1:0))*4*dt));
    if(p.vy===0&&p.grounded&&keys.jump){p.vy=-12.8;p.grounded=false;}
    const oldY=p.y;p.vy+=.58*dt;p.y+=p.vy*dt;p.grounded=false;
    const floors=[{x:0,w:1200,y:350},...heights.map((y,i)=>({x:62+i*158,w:112,y}))];
    for(const f of floors)if(p.vy>=0&&p.x+24>f.x&&p.x<f.x+f.w&&oldY<=f.y+.5&&p.y>=f.y){p.y=f.y;p.vy=0;p.grounded=true;break;}
    return p;
  }
  function mountMap(host,d){
    const viewport=host.querySelector('#overworld'),player=host.querySelector('#map-player'),status=host.querySelector('#map-status');
    const p={x:20,y:350,vy:0,grounded:true},keys={left:false,right:false,jump:false};let frame=0,last=0,near=0,destroyed=false;
    const closest=()=>Math.max(0,Math.min(6,Math.round((p.x-85)/158)));
    const enter=()=>{location.hash=`/station/${closest()+1}`;};
    const clear=()=>{keys.left=keys.right=keys.jump=false;};
    const onKey=e=>{if(e.target.closest('a,button'))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','a','d',' ','e'].includes(k)){e.preventDefault();if(k==='e'){if(e.type==='keydown'&&!e.repeat)enter();return;}const prop=['a','arrowleft'].includes(k)?'left':['d','arrowright'].includes(k)?'right':'jump';keys[prop]=e.type==='keydown';if(prop==='jump'&&e.type==='keydown'&&!e.repeat&&p.grounded){p.vy=-12.8;p.grounded=false;}}};
    viewport.addEventListener('keydown',onKey);viewport.addEventListener('keyup',onKey);viewport.addEventListener('blur',clear);window.addEventListener('blur',clear);
    ['left','right'].forEach(dir=>{const b=host.querySelector('#map-'+dir);b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[dir]=true;};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys[dir]=false;b.onclick=()=>{p.x+=dir==='left'?-28:28;};});
    host.querySelector('#map-jump').onclick=()=>{if(p.grounded){p.vy=-12.8;p.grounded=false;}};host.querySelector('#map-enter').onclick=enter;
    const tick=now=>{if(destroyed)return;const dt=last?Math.min(2,(now-last)/16.667):1;last=now;stepPlayer(p,keys,dt);player.style.transform=`translate(${p.x}px,${p.y-40}px) scaleX(${keys.left?-1:1})`;player.classList.toggle('airborne',!p.grounded);const n=closest();if(n!==near||!status.dataset.ready){near=n;status.dataset.ready='1';status.textContent=`Nearby: ${worlds[n].name}. ${certified(d,n+1)?'Crystal captured!':'Press E or tap its portal to enter.'}`;}if(keys.left||keys.right)viewport.scrollLeft=Math.max(0,p.x-viewport.clientWidth/2);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
    return ()=>{destroyed=true;cancelAnimationFrame(frame);clear();viewport.removeEventListener('keydown',onKey);viewport.removeEventListener('keyup',onKey);viewport.removeEventListener('blur',clear);window.removeEventListener('blur',clear);};
  }
  window.PhysicsGame={worlds,sync,xp,rank,due,review,certified,sprite,gem,mapMarkup,mountMap,stepPlayer,DAY};
})();
