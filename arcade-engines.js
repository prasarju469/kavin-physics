/* Original canvas game rules; no third-party game code or assets. */
(function(root){
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
class Maze{
 constructor(seed=17){this.rand=rng(17);this.w=15;this.h=13;this.map=Array.from({length:this.h},(_,y)=>Array.from({length:this.w},(_,x)=>x===0||y===0||x===this.w-1||y===this.h-1||(x%2===0&&y%2===0)?1:0));
 // Start with connected loops; retain two independent routes around every corridor.
 const candidates=[];for(let y=2;y<this.h-2;y++)for(let x=2;x<this.w-2;x++)if((x%2===0)!==(y%2===0))candidates.push({x,y});candidates.sort(()=>this.rand()-.5);
 for(const p of candidates){if(this.map[p.y][p.x])continue;const mx=this.w-1-p.x;this.map[p.y][p.x]=this.map[p.y][mx]=1;if(!this.hasEscapeRoutes())this.map[p.y][p.x]=this.map[p.y][mx]=0;}

 this.player={x:1,y:1};this.enemies=[{x:13,y:11,c:'#ff7e9c'},{x:13,y:1,c:'#c2a6ff'},{x:1,y:11,c:'#68dfdc'},{x:13,y:7,c:'#ffb663'},{x:1,y:7,c:'#99dc7c'},{x:7,y:11,c:'#74b9ff'}];for(const e of this.enemies){if(this.map[e.y][e.x])e.y=7;e.home={x:e.x,y:e.y};e.previous=null;e.released=this.enemies.indexOf(e)<3;}this.stepMs=210;this.dots=new Set();for(let y=1;y<this.h-1;y++)for(let x=1;x<this.w-1;x++)if(!this.map[y][x])this.dots.add(x+','+y);this.dots.delete('1,1');this.power=new Set(['13,11','13,1','1,11']);this.dir=1;this.next=1;this.score=0;this.lives=3;this.tick=0;this.safe=1;this.lifeStart=0;this.powered=0;this.elapsed=0;this.safeUntil=3000;this.powerUntil=0;this.smooth=true;this.player=this.mover(1,1);for(const e of this.enemies)Object.assign(e,this.mover(e.x,e.y));this.over=false;this.won=false;
 }
 hasEscapeRoutes(){const nodes=[];for(let y=1;y<this.h-1;y++)for(let x=1;x<this.w-1;x++)if(this.map[y][x]===0)nodes.push({x,y});if(nodes.length<3)return false;
 for(const removed of nodes){const start=nodes.find(p=>p!==removed),q=[start],seen=new Set([start.x+','+start.y]);for(let i=0;i<q.length;i++)for(const [dx,dy] of DIRS){const x=q[i].x+dx,y=q[i].y+dy,k=x+','+y;if(this.map[y]?.[x]===0&&(x!==removed.x||y!==removed.y)&&!seen.has(k)){seen.add(k);q.push({x,y});}}if(seen.size!==nodes.length-1)return false;}return true;}
 walk(x,y){return !!this.map[y]&&this.map[y][x]===0;}
 turn(d){this.next=d;}
 distances(tx,ty){let best=null,d=Infinity;for(let y=1;y<this.h-1;y++)for(let x=1;x<this.w-1;x++)if(this.walk(x,y)){const n=Math.abs(x-tx)+Math.abs(y-ty);if(n<d){d=n;best={x,y};}}const q=[best],dist=new Map([[best.x+','+best.y,0]]);for(let i=0;i<q.length;i++){const p=q[i],n=dist.get(p.x+','+p.y)+1;for(const [dx,dy] of DIRS){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(this.walk(x,y)&&!dist.has(k)){dist.set(k,n);q.push({x,y});}}}return dist;}
 mover(x,y){return {x,y,cx:x,cy:y,tx:x,ty:y,progress:0};}
 move(m,distance,choose,arrive){while(distance>0){if(m.progress===0&&m.tx===m.cx&&m.ty===m.cy){const next=choose();if(!next)return;m.tx=next.x;m.ty=next.y;}const part=Math.min(distance,1-m.progress);m.progress+=part;distance-=part;m.x=m.cx+(m.tx-m.cx)*m.progress;m.y=m.cy+(m.ty-m.cy)*m.progress;if(m.progress>=1-1e-8){const previous={x:m.cx,y:m.cy};m.cx=m.tx;m.cy=m.ty;m.x=m.cx;m.y=m.cy;m.progress=0;m.previous=previous;arrive?.();}}}
 chooseEnemy(e,i){const age=this.elapsed-this.lifeStart,[vx,vy]=DIRS[this.dir],ahead=i===1?2:i===2?1:0;let tx=this.player.x+vx*ahead,ty=this.player.y+vy*ahead;if(i===2){tx+=vy*2;ty-=vx*2;}if(age%20000<6000||(i===3&&Math.abs(e.x-this.player.x)+Math.abs(e.y-this.player.y)<6)){tx=e.home.x;ty=e.home.y;}const dist=this.distances(tx,ty);let options=DIRS.map(([dx,dy])=>({x:e.cx+dx,y:e.cy+dy})).filter(v=>this.walk(v.x,v.y));const forward=options.filter(v=>!e.previous||v.x!==e.previous.x||v.y!==e.previous.y);if(forward.length)options=forward;options.sort((a,b)=>((dist.get(a.x+','+a.y)??999)-(dist.get(b.x+','+b.y)??999))*(this.powered?-1:1));return options[0];}
 step(){this.advance(this.stepMs);}
 advance(ms){let remaining=ms;while(remaining>0&&!this.over){const dt=Math.min(20,remaining);remaining-=dt;this.elapsed+=dt;this.tick=Math.floor(this.elapsed/this.stepMs);this.safe=this.elapsed<this.safeUntil;this.powered=this.elapsed<this.powerUntil;
 this.move(this.player,dt/this.stepMs,()=>{let [dx,dy]=DIRS[this.next];if(this.walk(this.player.cx+dx,this.player.cy+dy))this.dir=this.next;[dx,dy]=DIRS[this.dir];return this.walk(this.player.cx+dx,this.player.cy+dy)?{x:this.player.cx+dx,y:this.player.cy+dy}:null;},()=>{const key=this.player.cx+','+this.player.cy;if(this.dots.delete(key))this.score+=10;if(this.power.delete(key))this.powerUntil=this.elapsed+6000;});
 this.powered=this.elapsed<this.powerUntil;for(let i=0;i<this.enemies.length;i++){const e=this.enemies[i];e.released=this.elapsed-this.lifeStart>=[0,0,0,8000,11000,13000][i];if(!e.released)continue;this.move(e,dt/this.stepMs*(this.powered?.5:.75),()=>this.chooseEnemy(e,i));}
 for(const e of this.enemies)if(e.released&&Math.hypot(e.x-this.player.x,e.y-this.player.y)<.55){if(this.powered){this.score+=50;Object.assign(e,this.mover(e.home.x,e.home.y));e.previous=null;}else if(!this.safe){this.lives--;this.player=this.mover(1,1);this.dir=this.next=1;this.lifeStart=this.elapsed;this.safeUntil=this.elapsed+3000;for(const g of this.enemies){Object.assign(g,this.mover(g.home.x,g.home.y));g.previous=null;g.released=false;}if(!this.lives)this.over=true;break;}}
 if(!this.dots.size){this.over=true;this.won=true;}}}

}
class Snake{
 constructor(seed=11){this.rand=rng(seed);this.w=14;this.h=11;this.body=[{x:7,y:5},{x:6,y:5},{x:5,y:5},{x:4,y:5},{x:3,y:5}];this.dir=1;this.next=1;this.score=0;this.over=false;this.won=false;this.food=this.spawn();}
 spawn(){const spaces=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++)if(!this.body.some(v=>v.x===x&&v.y===y))spaces.push({x,y});return spaces[Math.floor(this.rand()*spaces.length)]||null;}
 turn(d){if((d+2)%4!==this.dir)this.next=d;}
 step(){if(this.over)return;this.dir=this.next;const [dx,dy]=DIRS[this.dir],head={x:this.body[0].x+dx,y:this.body[0].y+dy},eat=this.food&&head.x===this.food.x&&head.y===this.food.y;const occupied=eat?this.body:this.body.slice(0,-1);if(head.x<0||head.x>=this.w||head.y<0||head.y>=this.h||occupied.some(v=>v.x===head.x&&v.y===head.y)){this.over=true;return;}this.body.unshift(head);if(eat){this.score+=10;this.food=this.spawn();if(!this.food){this.over=true;this.won=true;}}else this.body.pop();}
}
class BlockBreaker{
 constructor(){this.w=22;this.h=18;this.score=0;this.lives=3;this.level=1;this.over=false;this.won=false;this.smooth=true;this.paddle={x:11,y:16.4,width:3.6};this.target=11;this.direction=0;this.build();this.serve();}
 build(){this.bricks=[];for(let row=0;row<6;row++)for(let col=0;col<7;col++)this.bricks.push({x:1+col*2.9,y:2+row*.85,w:2.6,h:.6,hp:row<2?2:1,row});}
 serve(){this.ball={x:this.paddle.x,y:this.paddle.y-.45,vx:2.8*(this.level%2?1:-1),vy:-7.2};this.wait=900;}
 turn(d){if(d===1||d===3){this.target=Math.max(1.8,Math.min(this.w-1.8,this.target+(d===1?2:-2)));}}
 aim(x){this.direction=0;this.target=Math.max(1.8,Math.min(this.w-1.8,x));}
 advance(ms){let left=ms;while(left>0&&!this.over){const dt=Math.min(left,8)/1000;left-=dt*1000;const p=this.paddle,b=this.ball,r=.22;
 if(this.direction)this.target=Math.max(p.width/2,Math.min(this.w-p.width/2,this.target+this.direction*14*dt));
 p.x+=Math.max(-18*dt,Math.min(18*dt,this.target-p.x));
 if(this.wait>0){this.wait-=dt*1000;b.x=p.x;b.y=p.y-.45;continue;}
 const oldX=b.x,oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
 if(b.x<r){b.x=r;b.vx=Math.abs(b.vx);}if(b.x>this.w-r){b.x=this.w-r;b.vx=-Math.abs(b.vx);}if(b.y<r){b.y=r;b.vy=Math.abs(b.vy);}
 if(b.vy>0&&oldY+r<=p.y&&b.y+r>=p.y&&Math.abs(b.x-p.x)<=p.width/2+r){const offset=Math.max(-1,Math.min(1,(b.x-p.x)/(p.width/2))),speed=Math.min(11,7.8+(this.level-1)*.5),angle=offset*1.05;b.y=p.y-r;b.vx=Math.sin(angle)*speed;b.vy=-Math.cos(angle)*speed;}
 for(let i=0;i<this.bricks.length;i++){const k=this.bricks[i],nearX=Math.max(k.x,Math.min(k.x+k.w,b.x)),nearY=Math.max(k.y,Math.min(k.y+k.h,b.y));if((b.x-nearX)**2+(b.y-nearY)**2>r*r)continue;
 if(oldY+r<=k.y||oldY-r>=k.y+k.h){b.vy=-b.vy;b.y=oldY;}else{b.vx=-b.vx;b.x=oldX;}k.hp--;this.score+=10;if(k.hp===0){this.bricks.splice(i,1);this.score+=10;}break;}
 if(b.y>this.h+r){this.lives--;if(this.lives===0){this.over=true;break;}this.serve();}
 if(!this.bricks.length){this.level++;this.build();this.serve();}
 }}
}
const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
class Tetris{
 constructor(seed=23){this.rand=rng(seed);this.w=10;this.h=20;this.board=Array.from({length:20},()=>Array(10).fill(0));this.bag=[];this.score=0;this.lines=0;this.level=1;this.over=false;this.won=false;this.elapsed=0;this.next=this.take();this.spawn();}
 take(){if(!this.bag.length){this.bag=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){const j=Math.floor(this.rand()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}return this.bag.pop();}
 spawn(){const type=this.next;this.next=this.take();const shape=SHAPES[type].map(r=>r.slice());this.piece={type,shape,x:Math.floor((10-shape[0].length)/2),y:0};this.elapsed=0;if(!this.fits(shape,this.piece.x,0))this.over=true;}
 fits(shape,x,y){return shape.every((row,dy)=>row.every((v,dx)=>!v||(x+dx>=0&&x+dx<10&&y+dy>=0&&y+dy<20&&!this.board[y+dy][x+dx])));}
 move(dx){if(this.over)return false;const p=this.piece;if(!this.fits(p.shape,p.x+dx,p.y))return false;p.x+=dx;return true;}
 rotate(){if(this.over)return;const p=this.piece,shape=p.shape[0].map((_,x)=>p.shape.map(row=>row[x]).reverse());for(const dx of [0,-1,1,-2,2])if(this.fits(shape,p.x+dx,p.y)){p.shape=shape;p.x+=dx;return;}}
 lock(){const p=this.piece;for(let y=0;y<p.shape.length;y++)for(let x=0;x<p.shape[y].length;x++)if(p.shape[y][x])this.board[p.y+y][p.x+x]=p.type+1;const kept=this.board.filter(r=>r.some(v=>!v)),count=20-kept.length;while(kept.length<20)kept.unshift(Array(10).fill(0));this.board=kept;this.score+=[0,100,300,500,800][count]*this.level;this.lines+=count;this.level=1+Math.floor(this.lines/10);this.spawn();}
 down(manual=false){if(this.over)return;const p=this.piece;if(this.fits(p.shape,p.x,p.y+1)){p.y++;if(manual)this.score++;}else this.lock();}
 drop(){if(this.over)return;const p=this.piece;while(this.fits(p.shape,p.x,p.y+1)){p.y++;this.score+=2;}this.lock();}
 ghost(){let y=this.piece.y;while(this.fits(this.piece.shape,this.piece.x,y+1))y++;return y;}
 turn(d){if(d===0)this.rotate();else if(d===1)this.move(1);else if(d===3)this.move(-1);else this.down(true);}
 advance(ms){if(this.over)return;this.elapsed+=ms;const interval=Math.max(100,750-(this.level-1)*55);while(this.elapsed>=interval&&!this.over){this.elapsed-=interval;this.down();}}
}
root.TowerGames={Maze,Snake,BlockBreaker,Tetris,SHAPES,DIRS};if(typeof module!=='undefined')module.exports=root.TowerGames;
})(typeof window==='undefined'?globalThis:window);
