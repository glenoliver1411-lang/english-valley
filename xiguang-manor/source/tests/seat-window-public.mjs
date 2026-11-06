// Production-only validation: real taps and cached lazy modules, no game debug API.
import {chromium,webkit,devices} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh} from '../src/save.js';
import {compactMenuClicks} from './compact-menu.mjs';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const scope=process.env.SEAT_PRODUCTION_URL||'http://localhost:4180/english-valley/xiguang-manor/reference-art-preview/';
const dir=process.env.SEAT_RESULTS||'verification/seat-production';await mkdir(dir,{recursive:true});
const b=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']})});
const c=await b.newContext({...devices[engine===webkit?'iPhone 13':'Pixel 7'],viewport:{width:390,height:844}}),p=await c.newPage();compactMenuClicks(p);p.setDefaultTimeout(30000);
const d=fresh();Object.assign(d,{accepted:true,completed:true,candies:77,catName:'奶盖'});d.romance.theme='cream';d.scenery.clock=7.5;
const report={engine:engine.name(),scope,errors:[]};p.on('pageerror',e=>report.errors.push(e.message));
try{
 await p.addInitScript(d=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify(d))},d);
 await p.goto(scope+'?v=reference-art-20261106-2');await p.click('#skip-return');await p.waitForFunction(()=>!document.querySelector('.device').classList.contains('returning'));
 await p.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:90000});
 report.cache=await p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration(location.href),ch=new MessageChannel();return new Promise(resolve=>{ch.port1.onmessage=e=>resolve(e.data);r.active.postMessage({type:'PWA_STATUS'},[ch.port2])})});assert.equal(report.cache.version,'reference-art-20261106-2');assert.equal(report.cache.complete,true);
 await c.setOffline(true);await p.reload();await p.click('#skip-return');await p.waitForFunction(()=>!document.querySelector('.device').classList.contains('returning'));
 await p.click('#world-wander');await p.click('#world-cabin');await p.waitForSelector('#leave-retreat');await p.waitForTimeout(1800);
 const tap=async(x,y)=>{const r=await p.locator('#game canvas').boundingBox(),h=await p.locator('#game canvas').evaluate(el=>el.height);await p.touchscreen.tap(r.x+x/432*r.width,r.y+(y-Math.max(0,850-h))/h*r.height)};
 await tap(72,676);await p.waitForSelector('#stand-retreat');await p.waitForTimeout(2400);await p.screenshot({path:`${dir}/${engine.name()}-offline-chair.png`});
 await p.click('#quiet-photo');await p.waitForSelector('#end-photo');await p.click('#end-photo');await p.click('#stand-retreat');await p.waitForSelector('#leave-retreat');await p.waitForTimeout(1800);
 await tap(212,325);await p.waitForSelector('#stand-retreat');await p.waitForTimeout(2400);await p.screenshot({path:`${dir}/${engine.name()}-offline-window.png`});await p.click('#stand-retreat');await p.click('#leave-retreat');
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1')));assert.equal(saved.candies,77);assert.equal(saved.catName,'奶盖');assert.deepEqual(saved.romance.room,d.romance.room);assert.deepEqual(report.errors,[]);
 report.passed=['complete new release cached','offline reload and first lazy cabin visit','real touch chair approach, sit, photo, stand','real touch window approach and stand','old candies/cat/room layout preserved'];await writeFile(`${dir}/${engine.name()}-production.json`,JSON.stringify(report,null,2));
}finally{await b.close()}
