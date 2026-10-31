import {FIREWORKS} from './fireworks-config.js';
// Fixed pools + analytic drag/gravity: no per-frame emitters or full-screen filters.
export class FireworkSystem{
 constructor({width=216,height=412,random=Math.random,onBurst=()=>{}}={}){this.w=width;this.h=height;this.random=random;this.onBurst=onBurst;this.rockets=Array.from({length:FIREWORKS.maxRockets},()=>({active:false}));this.sparks=Array.from({length:FIREWORKS.maxSparks},()=>({active:false}));this.children=Array.from({length:48},()=>({active:false}));this.smoke=Array.from({length:18},()=>({active:false}));this.time=0;this.lastLaunch=-10;this.showTime=0;this.auto=false;this.low=false;this.finished=false;this.bursts=0;this.flash=0}
 resize(w,h){const sx=w/this.w,sy=h/this.h;for(const p of this.sparks)if(p.active){p.x0*=sx;p.y0*=sy;p.vx*=sx;p.vy*=sy;p.gravity*=sy}for(const p of this.rockets)if(p.active){p.x0*=sx;p.y0*=sy;p.tx*=sx;p.ty*=sy}for(const p of this.children)if(p.active){p.x*=sx;p.y*=sy}for(const p of this.smoke)if(p.active){p.x*=sx;p.y*=sy}this.w=w;this.h=h}
 clear(){for(const group of [this.rockets,this.sparks,this.children,this.smoke])for(const p of group)p.active=false;this.auto=false;this.finished=false;this.flash=0;this.time=0;this.lastLaunch=-10;this.bursts=0}
 startShow(){this.clear();this.showTime=0;this.cursor=0;this.auto=true;this.finished=false}
 setReduced(value){value=!!value;if(value&&!this.low)for(let i=FIREWORKS.lowSparks;i<this.sparks.length;i++){const p=this.sparks[i];if(p.active)p.life=Math.min(p.life,p.age+.4)}this.low=value}
 launch(x=this.w*.5,y=this.h*.3,style='gold',scheduled=false){if(!FIREWORKS.styles.some(s=>s.id===style))style='gold';if(!scheduled&&this.time-this.lastLaunch<.38)return false;const max=this.low?4:this.rockets.length;if(this.rockets.slice(0,max).filter(p=>p.active).length>=max)return false;const p=this.rockets.find(p=>!p.active);if(!p)return false;this.lastLaunch=this.time;Object.assign(p,{active:true,age:0,duration:1.18+this.random()*.32,x0:this.w*(.42+this.random()*.16),y0:this.h*.76,tx:Math.max(30,Math.min(this.w-30,x)),ty:Math.max(48,Math.min(this.h*.48,y)),style,seed:this.random()*6.28});return true}
 particle(x,y,vx,vy,{life=3.5,gravity=9,drag=.7,color='#ffe2a1',white=false,twinkle=0,size=1,tail=.1}={}){const cap=this.low?FIREWORKS.lowSparks:this.sparks.length;let p;for(let i=0;i<cap;i++)if(!this.sparks[i].active){p=this.sparks[i];break}if(!p)return false;Object.assign(p,{active:true,x0:x,y0:y,vx,vy,age:0,life,gravity,drag,color,white,twinkle,size,tail,seed:this.random()*6.28});return true}
 burst(x,y,style='gold',small=false){
  this.bursts++;this.flash=Math.min(.11,this.flash+(small?.012:.05));
  const rand=this.random,count=small?(this.low?6:11):this.low?48:style==='comet'?82:style==='cascade'?70:128,rotation=rand()*.13;
  const palettes={gold:['#f2c886','#f8dfb2','#ddae83'],willow:['#e8bd7a','#f3d8a4','#cda3b0'],heart:['#e8a8c3','#f6d4d7','#d5b5dc'],star:['#b9c8e8','#e7d5ec','#f1d8b5'],layered:['#edb2c6','#d3bfe1','#f4d7ad'],comet:['#a9ceda','#d6deec','#d1b7d8'],cascade:['#f0d2a8','#dec1d4','#e8e2b7']};
  const colors=palettes[style]||palettes.gold;
  for(let i=0;i<count;i++){
   let angle=i/count*Math.PI*2+rotation+(rand()-.5)*.025,vx,vy;
   if(style==='heart'&&!small){const k=angle;vx=16*Math.sin(k)**3*2.8;vy=-(13*Math.cos(k)-5*Math.cos(2*k)-2*Math.cos(3*k)-Math.cos(4*k))*2.65}
   else if(style==='star'&&!small){const speed=27+36*(.5+.5*Math.cos(angle*5));vx=Math.cos(angle)*speed;vy=Math.sin(angle)*speed*.93}
   else if(style==='comet'&&!small){angle=-Math.PI*.9+i/count*Math.PI*.8;const speed=31+rand()*53;vx=Math.cos(angle)*speed;vy=Math.sin(angle)*speed}
   else{const shell=style==='layered'?[.4,.67,1][i%3]:i%7===0?.25:i%3===0?.55:1;const speed=small?7+rand()*10:(style==='willow'?72:67)*shell*(.9+rand()*.17);vx=Math.cos(angle)*speed;vy=Math.sin(angle)*speed*.9}
   this.particle(x,y,vx,vy,{life:small?.8+rand()*.8:style==='willow'?4.7+rand()*.8:3.1+rand()*1.1,gravity:small?4:style==='willow'?12:style==='comet'?8:7,drag:small?1.4:style==='willow'?.61:.83,color:colors[i%colors.length],white:i%13===0,twinkle:small?3:style==='willow'?1.5:2.2,size:1,tail:small?.045:style==='comet'?.24:style==='willow'?.20:.12});
   if(!small&&['gold','layered','cascade'].includes(style)&&i%(this.low?18:15)===0){const child=this.children.find(p=>!p.active);if(child)Object.assign(child,{active:true,delay:style==='cascade'?.4+(i/count)*1.5:1.05+rand()*.45,x,y,vx,vy,drag:.83,gravity:7,age:0,style:style==='cascade'?'cascade':style==='layered'?'star':'gold'})}
  }
  if(!small){this.onBurst(style);const smoke=this.smoke.find(p=>!p.active);if(smoke)Object.assign(smoke,{active:true,x,y,age:0,life:4.5,seed:rand()*6.28})}
 }
 update(dt){dt=Math.max(0,Math.min(.08,dt));this.time+=dt;this.flash=Math.max(0,this.flash-dt*.17);if(this.auto){this.showTime+=dt;while(this.cursor<FIREWORKS.schedule.length&&FIREWORKS.schedule[this.cursor].at<=this.showTime){const q=FIREWORKS.schedule[this.cursor++];this.launch(q.x*this.w,q.y*this.h,q.style,true)}if(this.showTime>=FIREWORKS.duration){this.auto=false;this.finished=true}}
  for(const p of this.rockets)if(p.active){p.age+=dt;if(p.age>=p.duration){p.active=false;this.burst(p.tx,p.ty,p.style)}}
  for(const p of this.sparks)if(p.active){p.age+=dt;if(p.age>=p.life)p.active=false}
  for(const p of this.children)if(p.active){p.age+=dt;if(p.age>=p.delay){p.active=false;const at=particlePosition({x0:p.x,y0:p.y,vx:p.vx,vy:p.vy,gravity:p.gravity,drag:p.drag},p.delay);this.burst(at.x,at.y,p.style||'gold',true)}}
  for(const p of this.smoke)if(p.active){p.age+=dt;if(p.age>=p.life)p.active=false}
 }
 draw(c){c.save();c.beginPath();c.rect(0,0,this.w,this.h*.73);c.clip();
  for(const p of this.smoke)if(p.active){c.globalAlpha=.035*Math.sin(Math.PI*p.age/p.life);c.fillStyle='#cebca4';for(let i=0;i<(this.low?4:8);i++){const r=6+p.age*3;c.fillRect(Math.round(p.x+Math.cos(i+p.seed)*r+p.age*3),Math.round(p.y+Math.sin(i*2+p.seed)*r*.4),8+p.age*2,4+p.age)}}
  for(const p of this.smoke)if(p.active&&p.age<.4){c.fillStyle='#eed7b5';for(let i=3;i>0;i--){c.globalAlpha=(1-p.age/.4)*.011;c.fillRect(Math.round(p.x-i*7),Math.round(p.y-i*4),i*14,i*8)}}
  for(const p of this.rockets)if(p.active){const q=Math.min(1,p.age/p.duration);for(let i=7;i>=0;i--){const t=Math.max(0,q-i*.014),ease=1-(1-t)**1.65,x=p.x0+(p.tx-p.x0)*t+Math.sin(t*7+p.seed)*.7,y=p.y0+(p.ty-p.y0)*ease;c.globalAlpha=(1-i/8)*.85;c.fillStyle=i%2?'#e8ba78':'#ffe5b5';c.fillRect(Math.round(x),Math.round(y),1,i===0?2:1)}}
  for(const p of this.sparks)if(p.active){const age=p.age,fade=Math.min(1,age*13)*Math.min(1,(p.life-age)/Math.max(.5,p.life*.42));const shimmer=1-Math.max(0,Math.sin(age*p.twinkle*9+p.seed))*.35;const head=particlePosition(p,age);let previous=head;const steps=this.low?3:5;for(let i=1;i<=steps;i++){const at=Math.max(0,age-i*p.tail),point=particlePosition(p,at);c.globalAlpha=fade*shimmer*(1-i/(steps+1))*.78;c.strokeStyle=p.color;c.lineWidth=1;c.beginPath();c.moveTo(Math.round(previous.x)+.5,Math.round(previous.y)+.5);c.lineTo(Math.round(point.x)+.5,Math.round(point.y)+.5);c.stroke();previous=point}c.globalAlpha=fade*shimmer;c.fillStyle=p.white?'#fff3d4':p.color;c.fillRect(Math.round(head.x),Math.round(head.y),1,1);if(p.white&&Math.sin(age*12+p.seed)>.5){c.globalAlpha=fade*.3;c.fillRect(Math.round(head.x)-1,Math.round(head.y),3,1);c.fillRect(Math.round(head.x),Math.round(head.y)-1,1,3)}}
  c.restore();
 }
 drawReflection(c,top,bottom){
  const height=bottom-top;let drawn=0;for(let i=0;i<this.sparks.length&&drawn<(this.low?9:22);i+=19){const p=this.sparks[i];if(!p.active||p.age<.1||p.age>p.life*.8)continue;const at=particlePosition(p,p.age);if(at.x<3||at.x>this.w-3)continue;drawn++;const alpha=Math.sin(Math.PI*p.age/p.life)*.10;c.fillStyle=p.color;for(let k=0;k<3;k++){c.globalAlpha=alpha*(1-k/4);c.fillRect(Math.round((at.x+Math.sin(this.time*.8+i+k)*2)*2)/2,Math.round((top+height*(.28+(at.y/this.h)*.48)+k*2)*2)/2,1.5+k,.5)}}c.globalAlpha=1;
 }
 get activeCount(){return this.sparks.reduce((n,p)=>n+Number(p.active),0)}
}
export function particlePosition(p,t){t=Math.max(0,t);const drag=Math.max(.1,p.drag),decay=(1-Math.exp(-drag*t))/drag;return{x:p.x0+p.vx*decay,y:p.y0+(p.vy-p.gravity/drag)*decay+p.gravity*t/drag}}
