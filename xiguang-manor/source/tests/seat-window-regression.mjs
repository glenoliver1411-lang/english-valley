import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh} from '../src/save.js';
import {compactMenuClicks} from './compact-menu.mjs';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const dir=process.env.SEAT_RESULTS||'verification/seat-window';await mkdir(dir,{recursive:true});
const b=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']})});
const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});compactMenuClicks(p);p.setDefaultTimeout(20000);
const d=fresh();Object.assign(d,{accepted:true,completed:true,stage:5});d.romance.theme='cream';d.romance.weather='clear';d.scenery.clock=7.5;
const report={engine:engine.name(),errors:[],seats:[]};p.on('pageerror',e=>report.errors.push(e.message));
try{
 await p.addInitScript(d=>localStorage.setItem('xiguang-manor-v1',JSON.stringify(d)),d);
 await p.goto(process.env.PLAY_DEV_URL||'http://localhost:5199');await p.click('#skip-return');await p.waitForFunction(()=>__manor.scene.ready&&!__manor.session.returning);
 await p.evaluate(()=>{__manor.scenery.updateTime=()=>{}});await p.click('#world-wander');await p.click('#world-cabin');await p.waitForFunction(()=>__manor.romantic.view?.player);await p.waitForTimeout(1000);
 for(const type of ['chair','window']){
  await p.evaluate(type=>{const u=__manor.romantic;if(type==='window')u.action({id:'window'});else u.action({id:'homeItem',item:u.data.romance.room.items.find(i=>i.type===type)})},type);
  await p.waitForTimeout(2300);await p.screenshot({path:`${dir}/${engine.name()}-${type}.png`});
  for(const low of [false,true]){
   await p.evaluate(low=>__manor.data.scenery.lowEffects=low,low);
   const sampled=await p.evaluate(async()=>{const s=__manor.romantic.view,actor=s.player,original=actor.setTexture,calls=[];
    actor.setTexture=function(key,...args){calls.push(key);return original.call(this,key,...args)};
    return new Promise(resolve=>{const samples=[];const sample=()=>{samples.push({texture:actor.texture.key,depth:actor.depth,playing:actor.anims.isPlaying,x:actor.x,y:actor.y});if(samples.length===90){s.events.off('postupdate',sample);actor.setTexture=original;resolve({samples,calls})}};s.events.on('postupdate',sample)})});
   report.seats.push({type,low,textures:[...new Set(sampled.samples.map(s=>s.texture))],textureAssignments:[...new Set(sampled.calls)],samples:sampled.samples});
  }
  if(type==='window'){
   report.window=await p.evaluate(()=>{const c=__manor.romantic.view.background.texture.getSourceImage(),ctx=c.getContext('2d'),d=ctx.getImageData(177,129,80,6).data;let maxRun=0;for(let y=0;y<6;y++){let run=0;for(let x=0;x<80;x++){const i=(y*80+x)*4;run=Math.max(d[i],d[i+1],d[i+2])<65?run+1:0;maxRun=Math.max(run,maxRun)}}return{maxDarkRun:maxRun,width:c.width,height:c.height}});
  }
  if(type==='chair'){
   await p.click('#quiet-photo');await p.waitForTimeout(250);assert.ok(await p.evaluate(()=>__manor.romantic.view.player.texture.key.startsWith('home-seated-')));await p.click('#end-photo');
  }
  await p.click('#stand-retreat');await p.waitForFunction(()=>!__manor.romantic.view.quiet);assert.ok(!await p.evaluate(()=>__manor.romantic.view.player.texture.key.includes('seated')));
 }
 await writeFile(`${dir}/${engine.name()}.json`,JSON.stringify(report,null,2));assert.deepEqual(report.errors,[]);
 for(const seat of report.seats)if(seat.type==='chair'){assert.ok(seat.textures.every(k=>k.startsWith('home-seated-')),'chair must keep its seated texture on every frame: '+seat.textures.join(','));assert.ok(seat.textureAssignments.every(k=>k.startsWith('home-seated-')),'standing texture must never be assigned while sitting');assert.equal(new Set(seat.samples.map(s=>s.depth)).size,1,'seated draw order must be stable')}assert.equal(report.window.maxDarkRun,0,'no spare black rail across window glass');
}finally{await b.close()}
