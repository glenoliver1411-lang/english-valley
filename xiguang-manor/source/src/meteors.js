import {METEORS as C} from './meteor-config.js';
import {mix} from './sky-model.js';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
const snap=v=>Math.round(v*2)/2;
export function meteorPosition(m,age,out={}){const t=clamp(age,0,m.duration),q=t/m.duration,curve=m.bend*q*q;out.x=m.originX+m.vx*t+m.normalX*curve;out.y=m.originY+m.vy*t+m.normalY*curve;return out}
export function meteorDedication(time){const f=C.caption,t=time-f.start;if(t<0)return 0;if(t<f.fadeIn)return ease(t/f.fadeIn);if(t<f.fadeIn+f.hold)return 1;return 1-ease((t-f.fadeIn-f.hold)/f.fadeOut)}
export function meteorSchedule(random=Math.random){
 const range=([a,b])=>a+(b-a)*random(),events=[{at:C.show.firstAt,kind:'bright'}];
 for(const [span,gap]of [[C.show.development,C.show.developmentGap],[C.show.rise,C.show.riseGap],[C.show.peak,C.show.peakGap]])for(let at=span[0];at<span[1];at+=range(gap))events.push({at,kind:random()<C.show.brightChance?'bright':'ordinary'});
 events.push({at:C.show.xiAt,kind:'xi'});for(const at of C.show.closing)events.push({at:at+random()*.3,kind:'ordinary'});return events.sort((a,b)=>a.at-b.at);
}
export class MeteorSystem{
 constructor(w=216,h=400,random=Math.random){this.w=w;this.h=h;this.random=random;this.pool=Array.from({length:C.poolSize},()=>({active:false}));this.dust=Array.from({length:C.dustPoolSize},()=>({active:false}));this.time=0;this.showTime=0;this.queue=[];this.showing=false;this.finished=false;this.low=false;this.sequence=0;this.nextIdle=this.range(C.idleInterval);this.specialEmitted=false;this.samples=[{},{}];this.specialColors=Array.from({length:C.tailSamples},(_,i)=>mix(C.xi.gold,C.xi.lavender,i/(C.tailSamples-1)))}
 range([a,b]){return a+(b-a)*this.random()}
 resize(w,h){this.w=w;this.h=h;this.clearObjects()}
 clearObjects(){for(const m of this.pool)m.active=false;for(const d of this.dust)d.active=false}
 clear(){this.clearObjects();this.showing=false;this.finished=false;this.queue=[];this.nextIdle=this.time+this.range(C.idleInterval)}
 startShow(){this.clear();this.showTime=0;this.sequence=0;this.showing=true;this.specialEmitted=false;this.queue=meteorSchedule(this.random)}
 spawn(kind='ordinary',age=0){
  const max=this.showing?(this.low?C.limits.lowShow:C.limits.show):C.limits.idle;
  const reserve=kind!=='xi'&&this.showing&&this.showTime>=C.show.xiAt-2&&this.showTime<C.show.xiAt;if(this.pool.filter(m=>m.active).length>=max-(reserve?1:0))return null;
  const m=this.pool.find(m=>!m.active);if(!m)return null;
  const spec=C[kind],special=kind==='xi',bright=kind!=='ordinary',distant=!bright&&this.random()<C.distant.chance;
  const speed=this.range(spec.speed)*(distant?C.distant.speed:1),requestedLife=this.range(spec.life);
  // Distribute mid-flight positions across the sky, rather than spawning everything at its top edge.
  // Their direction is derived from a common radiant: perspective changes the angle naturally.
  const field=C.field,radiantX=this.w*C.radiant.x,radiantY=this.h*C.radiant.y;
  const column=(this.sequence++%field.columns+this.random())/field.columns;
  const centerX=this.w*(special?.67:field.left+(field.right-field.left)*column),dx=radiantX-centerX;
  const lowY=Math.max(this.h*field.top,radiantY+dx*Math.tan(C.angle[0]*Math.PI/180));
  const highY=Math.min(this.h*field.bottom,radiantY+dx*Math.tan(C.angle[1]*Math.PI/180));
  const centerY=special?clamp(this.h*.26,lowY,highY):lowY+(highY-lowY)*this.random();
  const angle=Math.atan2(centerY-radiantY,dx),vx=-Math.cos(angle)*speed,vy=Math.sin(angle)*speed;
  const originX=centerX-vx*requestedLife*.38,originY=centerY-vy*requestedLife*.38;
  const duration=Math.min(requestedLife,(this.h*C.skyBottom-originY-2)/vy,(originX+10)/-vx);
  let pick=this.random(),color=C.colors[0];for(let i=0;i<C.colors.length;i++){pick-=C.colorWeights[i];if(pick<=0){color=C.colors[i];break}}
  Object.assign(m,{active:true,caught:false,kind,special,hero:bright,distant,age,duration,originX,originY,radiantX,radiantY,vx,vy,normalX:Math.sin(angle),normalY:Math.cos(angle),bend:this.range(spec.bend),tailLength:this.range(spec.tailLength)*(distant?C.distant.tail:1),brightness:this.range(spec.brightness)*(distant?C.distant.brightness:1),color:special?C.xi.gold:color,hasDust:bright||!distant&&this.random()<spec.dustChance,nextDust:.10+this.random()*.06,seed:this.random()*1000});
  m.trailSeconds=Math.min(this.range(spec.tailSeconds),m.tailLength/speed);meteorPosition(m,age,m);if(special)this.specialEmitted=true;return m;
 }
 spawnDust(m){const d=this.dust.find(d=>!d.active);if(!d||this.low&&this.dust.filter(d=>d.active).length>=C.lowDustLimit)return;const side=(this.random()-.5)*C.dust.spread,at=Math.max(0,m.age-.035);meteorPosition(m,at,this.samples[0]);Object.assign(d,{active:true,age:0,life:this.range(C.dust.life),x:this.samples[0].x,y:this.samples[0].y,vx:m.vx*(.035+this.random()*.05)+m.normalX*side,vy:m.vy*.035+m.normalY*side,color:m.special?C.xi.lavender:m.color,brightness:C.dust.brightness*(m.special?1:.6),glint:m.special&&this.random()<.2})}
 update(dt,{mode='idle',reduced=false}={}){
  dt=clamp(dt,0,.25);this.time+=dt;this.low=reduced;
  for(const m of this.pool)if(m.active){m.age+=dt;meteorPosition(m,m.age,m);if(m.age>=m.duration+C.afterglow){m.active=false;continue}if(m.hasDust&&m.age<m.duration-.12&&m.age>=m.nextDust){m.nextDust=m.age+this.range(C.dust.interval)*(this.low?1.7:1);this.spawnDust(m)}}
  for(const d of this.dust)if(d.active){d.age+=dt;if(d.age>=d.life)d.active=false}
  if(mode==='show'&&this.showing){this.showTime+=dt;while(this.queue.length&&this.queue[0].at<=this.showTime){const event=this.queue.shift();this.spawn(event.kind,this.showTime-event.at)}if(this.showTime>=C.duration){this.showing=false;this.finished=true;this.nextIdle=this.time+this.range(C.idleInterval)}}
  else if(mode==='idle'&&!this.showing&&this.time>=this.nextIdle){this.nextIdle=this.time+this.range(C.idleInterval);this.spawn(this.random()<C.idleBrightChance?'bright':'ordinary')}
 }
 hit(x,y){return this.pool.find(m=>m.active&&!m.caught&&m.age<m.duration&&Math.hypot(m.x-x,m.y-y)<12)}
 get light(){let light=0;for(const m of this.pool)if(m.active&&m.special)light=Math.max(light,.018*Math.sin(clamp(m.age/m.duration)*Math.PI)**2);return light}
 draw(c){
  const count=this.low?C.lowTailSamples:C.tailSamples;for(const m of this.pool)if(m.active&&m.special&&m.age<m.duration){c.fillStyle=C.xi.gold;for(let ring=3;ring>0;ring--){const radius=ring*6;c.globalAlpha=this.light*.12;for(let y=-radius;y<=radius;y++){const width=Math.floor(Math.sqrt(radius*radius-y*y));c.fillRect(Math.round(m.x-width),Math.round(m.y+y),width*2+1,1)}}}c.globalAlpha=1;
  for(const m of this.pool){if(!m.active)continue;const after=m.age>m.duration,life=after?.035*(1-ease((m.age-m.duration)/C.afterglow)):ease(m.age/C.headFadeIn)*(.035+.965*ease((m.duration-m.age)/C.headFadeOut)),headAge=Math.min(m.age,m.duration);
   for(let i=count-1;i>=0;i--){const u=i/(count-1),at=headAge-u*m.trailSeconds;if(at<0)continue;const p=meteorPosition(m,at,this.samples[0]),next=meteorPosition(m,Math.min(headAge,at+m.trailSeconds/(count-1)),this.samples[1]);if(i>2&&(i+Math.floor(m.seed))%C.gapEvery===0)continue;
    const color=m.special?this.specialColors[Math.round(u*(C.tailSamples-1))]:m.color,alpha=m.brightness*life*(1-u)**C.tail.taper*(m.special?C.tail.specialAlpha:C.tail.alpha);c.fillStyle=color;c.globalAlpha=alpha;
    const steps=Math.max(1,Math.ceil(Math.hypot(next.x-p.x,next.y-p.y)*2));for(let k=0;k<steps;k++){const f=k/steps;c.fillRect(snap(p.x+(next.x-p.x)*f),snap(p.y+(next.y-p.y)*f),.5,.5)}
    // Nearer tails have a faint half-pixel fringe at the front; it tapers away.
    if(u<.45&&!m.distant){c.globalAlpha=alpha*C.tail.fringe*(1-u/.45);c.fillRect(snap(p.x+m.normalX*.5),snap(p.y+m.normalY*.5),.5,.5)}
   }
   if(!after){const x=snap(m.x),y=snap(m.y),alpha=m.brightness*ease(m.age/C.headFadeIn)*ease((m.duration-m.age)/C.headFadeOut);c.fillStyle=m.color;c.globalAlpha=alpha*.035;c.fillRect(x-1.5,y,3.5,.5);c.fillRect(x,y-1.5,.5,3.5);c.globalAlpha=alpha*(m.distant?.12:.24);c.fillRect(x-.5,y,1.5,.5);c.fillRect(x,y-.5,.5,1.5);if(m.special){c.globalAlpha=alpha*.38;c.fillRect(x-.5,y,.5,.5);c.fillRect(x+.5,y,.5,.5);c.fillRect(x,y-.5,.5,.5);c.fillRect(x,y+.5,.5,.5)}c.globalAlpha=alpha;c.fillStyle=C.core;c.fillRect(x,y,.5,.5)}
  }
  for(const d of this.dust){if(!d.active)continue;const drag=(1-Math.exp(-C.dust.drag*d.age))/C.dust.drag,x=snap(d.x+d.vx*drag),y=snap(d.y+d.vy*drag+d.age*d.age*.8),alpha=d.brightness*(1-d.age/d.life)**2;c.fillStyle=d.color;c.globalAlpha=alpha;c.fillRect(x,y,.5,.5);if(d.glint){c.globalAlpha=alpha*.3;c.fillRect(x-.5,y,1.5,.5);c.fillRect(x,y-.5,.5,1.5)}}
  c.globalAlpha=1;
 }
 drawReflection(c,top,bottom){
  const height=bottom-top;for(const m of this.pool){if(!m.active||!m.hero||m.x<0||m.x>this.w)continue;const progress=clamp(m.age/m.duration),alpha=C.reflection.brightness*m.brightness*Math.sin(progress*Math.PI)**2;if(alpha<.002)continue;const center=clamp(m.x,5,this.w-5),y=top+height*(.27+progress*.44);c.fillStyle=m.special?C.xi.gold:m.color;for(let i=0;i<C.reflection.rows;i++){const wave=Math.sin(this.time*1.4+i*2.3+m.seed),x=snap(center+wave*2-i*.6),length=1.5+(i%3)*1.2;c.globalAlpha=alpha*(1-i/(C.reflection.rows+1));c.fillRect(x-length/2,snap(y+i*2.2),length,.5)}}c.globalAlpha=1;
 }
}
