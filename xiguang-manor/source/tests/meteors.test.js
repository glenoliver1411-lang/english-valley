import test from 'node:test';import assert from 'node:assert/strict';
import {MeteorSystem,meteorPosition,meteorSchedule,meteorDedication} from '../src/meteors.js';
import {METEORS as C} from '../src/meteor-config.js';
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
test('Meteors travel diagonally through the sky; tails remain short and disappear promptly',()=>{
 for(const height of [240,320,466,700]){const m=new MeteorSystem(216,height,seeded(82));for(let i=0;i<150;i++){m.clear();const star=m.spawn(i%15===0?'xi':'ordinary'),angle=Math.atan2(star.vy,-star.vx)*180/Math.PI;assert.ok(angle>=C.angle[0]-.001&&angle<=C.angle[1]+.001);const before=meteorPosition(star,0),after=meteorPosition(star,star.duration);assert.ok(star.duration>0);assert.ok(after.x<before.x);assert.ok(after.y>before.y);assert.ok(after.y<=height*C.skyBottom);assert.ok(star.trailSeconds*Math.hypot(star.vx,star.vy)<=Math.max(...C[star.kind].tailLength));for(let t=0;t<3.5;t+=1/60)m.update(1/60,{mode:'off'});assert.equal(m.pool.some(s=>s.active),false);assert.equal(m.dust.some(s=>s.active),false)}}
});
test('Full and low-effects shows stay within caps and always include exactly one Xi meteor',()=>{
 for(const reduced of [false,true])for(let seed=1;seed<=25;seed++){const system=new MeteorSystem(216,410,seeded(seed));system.startShow();let peak=0,visiblePeak=0,xiBirths=0,xiSeen=false;for(let frame=0;frame<35*60;frame++){const was=system.specialEmitted;system.update(1/60,{mode:'show',reduced});if(!was&&system.specialEmitted)xiBirths++;const active=system.pool.filter(m=>m.active);peak=Math.max(peak,active.length);visiblePeak=Math.max(visiblePeak,active.filter(m=>m.x>0&&m.x<216&&m.age>.12&&m.age<m.duration-.15).length);assert.ok(active.length<=(reduced?C.limits.lowShow:C.limits.show));assert.ok(system.dust.filter(d=>d.active).length<=(reduced?C.lowDustLimit:C.dustPoolSize));if(active.some(m=>m.special))xiSeen=true}assert.equal(xiBirths,1);assert.equal(xiSeen,true);assert.ok(peak>=(reduced?6:9));assert.ok(visiblePeak>=(reduced?5:7),'the climax needs moving meteors actually visible inside the sky');assert.equal(system.finished,true);assert.equal(system.pool.some(m=>m.active),false)}
});
test('Idle sky remains sparse, skip clears all effects, and replay starts a fresh show',()=>{
 const system=new MeteorSystem(216,410,seeded(30));let births=0,activeBefore=new Set();for(let frame=0;frame<120*60;frame++){system.update(1/60,{mode:'idle'});const active=system.pool.filter(m=>m.active);for(const m of active)if(!activeBefore.has(m))births++;assert.ok(active.length<=2);activeBefore=new Set(active)}assert.ok(births>=24&&births<=57);system.startShow();for(let i=0;i<20*60;i++)system.update(1/60,{mode:'show'});system.clear();assert.ok(system.pool.every(m=>!m.active));assert.ok(system.dust.every(m=>!m.active));assert.equal(system.queue.length,0);system.startShow();assert.equal(system.showTime,0);assert.equal(system.specialEmitted,false);assert.ok(system.queue.length>10);
});
test('Quiet opening, irregular schedule, and dedication fade surround the special meteor',()=>{
 const events=meteorSchedule(seeded(51));assert.ok(events.every(e=>e.at>=4));assert.equal(events.filter(e=>e.kind==='xi').length,1);assert.equal(events.find(e=>e.kind==='xi').at,C.show.xiAt);assert.ok(events.length>=50&&events.length<=80);const peak=events.filter(e=>e.at>=C.show.peak[0]&&e.at<=C.show.peak[1]);assert.ok(peak.length>=28);assert.ok(new Set(peak.slice(1).map((e,i)=>(e.at-peak[i].at).toFixed(3))).size>12);assert.equal(meteorDedication(22),0);assert.equal(meteorDedication(26),1);assert.equal(meteorDedication(30),0);assert.ok(meteorDedication(24.6)>0&&meteorDedication(24.6)<1);
});
test('Shared radiant creates perspective, with varied paths and short moving tails across the sky',()=>{
 const system=new MeteorSystem(216,466,seeded(91)),columns=new Set(),angles=[];let distant=0;
 for(let i=0;i<200;i++){
  system.clear();const m=system.spawn('ordinary'),speed=Math.hypot(m.vx,m.vy);
  const dx=m.originX-m.radiantX,dy=m.originY-m.radiantY;
  assert.ok(Math.abs(dx*m.vy-dy*m.vx)<1e-7,'paths traced backwards converge on the same radiant');
  const head=meteorPosition(m,m.duration*.6),tail=meteorPosition(m,m.duration*.6-m.trailSeconds);
  assert.ok(tail.x>head.x&&tail.y<head.y,'tail follows behind the moving head');
  assert.ok(Math.hypot(head.x-tail.x,head.y-tail.y)<=m.tailLength+1);
  const centerX=m.originX+m.vx*C.ordinary.life[0]*.38;
  columns.add(Math.min(3,Math.floor(Math.max(0,centerX)/54)));
  angles.push(Math.atan2(m.vy,-m.vx)*180/Math.PI);if(m.distant)distant++;
  assert.ok(speed>=C.ordinary.speed[0]*C.distant.speed);
 }
 assert.equal(columns.size,4);assert.ok(Math.max(...angles)-Math.min(...angles)>18);
 assert.ok(distant>30&&distant<90,'small distant streaks are mixed with nearer meteors');
});
