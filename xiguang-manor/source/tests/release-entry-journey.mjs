import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {fresh} from '../src/save.js';
import {compactMenuClicks} from './compact-menu.mjs';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const origin=process.env.RELEASE_ORIGIN||'http://localhost:4198',root=origin+'/english-valley/xiguang-manor/',version='full-stage1-20261114-3',oldRelease=process.env.OLD_RELEASE||'a',oldVersion=oldRelease==='c'?'full-stage1-20261114-2':'manor-flowers-20261107-1';
const dir='verification/loading-gate/'+engine.name(),profile=await mkdtemp(tmpdir()+'/manor-release-entry-');
await mkdir(dir,{recursive:true});
const report={engine:engine.name(),physicalDevice:false,steps:[],errors:[]};let context,p;
const admin=async(release,offline=false,fail='')=>fetch(origin+'/__test?release='+release+'&offline='+(offline?1:0)+'&fail='+fail);
async function failedDownloads(){return (await(await fetch(origin+'/__test')).json()).failedRequests}
const step=s=>{console.log(s);report.steps.push(s)};
const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1')));
async function launch(offline=false){context=await engine.launchPersistentContext(profile,{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,offline,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']})});p=context.pages()[0];compactMenuClicks(p);p.setDefaultTimeout(150000);p.on('pageerror',e=>report.errors.push(e.message))}
async function audit(){return p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration(location.href),ch=new MessageChannel();return new Promise(resolve=>{ch.port1.onmessage=e=>resolve(e.data);r.active.postMessage({type:'PWA_STATUS'},[ch.port2])})})}
async function returning(){await p.click('#skip-return');await p.waitForSelector('.world-region-ui.loaded')}
async function native(){await p.click('#skip-return');await p.waitForSelector('#game canvas[data-forest-period]');await p.waitForSelector('.forest-garden-ui');await p.waitForTimeout(500)}
function protectedFields(a,b){for(const k of ['candies','catName','favorite','wardrobe','adventure','play','completed','music','shop'])assert.deepEqual(a[k],b[k],k);for(const k of ['beds','starWishes','secrets','treeAwakened'])assert.deepEqual(a.romance[k],b.romance[k],k);assert.deepEqual(a.scenery.stars,b.scenery.stars);assert.equal(a.scenery.starCandy,b.scenery.starCandy);for(const old of b.romance.room.items){const item=a.romance.room.items.find(v=>v.type===old.type);assert.ok(item,old.type);assert.equal(item.x,old.x);assert.equal(item.y,old.y);if('flip'in old)assert.equal(item.flip,old.flip);if('on'in old)assert.equal(item.on,old.on)}}
try{
 await admin(oldRelease);await launch();
 const d=fresh();Object.assign(d,{accepted:true,completed:true,stage:5,favorite:'lavender',music:false,candies:89,catName:'奶盖'});d.scenery.clock=7.5;d.romance.room={wallpaper:'floral',floor:'pale',bouquet:'lily',items:[{type:'chair',x:72,y:704,flip:true},{type:'laceDrape',x:352,y:744,on:true}]};d.play.furnitureOwned=['laceDrape'];d.play.flowers.rose=4;d.wardrobe.owned.push('cocoa');d.wardrobe.equipped='cocoa';d.adventure.inventory={oldkey:2,crown:1};d.romance.treeAwakened=true;d.romance.secrets=['hollow'];d.romance.beds[0]={flower:'lily',wateredAt:Date.now()-70000};d.romance.starWishes.xi='平安喜乐';d.scenery.stars=['xi','petal'];d.scenery.starCandy=true;
 await p.addInitScript(({d,root})=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify(d));localStorage.setItem('xiguang-pocket:'+root+':snooze',String(Date.now()+86400000))},{d,root});
 await p.goto(root+'?renderer=canvas');await returning();await p.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');report.before=await audit();assert.equal(report.before.version,oldVersion);const before=await saved();step('Old formal '+oldVersion+' offline package installed with legacy progress');
 await admin('b',false,'night-7VZr6uUH');const started=Date.now();
 await p.goto(root+'enter-stage1.html?renderer=canvas#forest-garden');await native();
 report.onlineEntryMs=Date.now()-started;assert.ok(p.url().includes('game-'+version+'.html'));assert.equal((await audit()).version,oldVersion);protectedFields(await saved(),before);await p.screenshot({path:dir+'/online-with-incomplete-cache.png'});
 step('Latest native garden starts under the old controller without waiting for a complete new offline package');
 for(let n=0;n<60&&!await failedDownloads();n++)await p.waitForTimeout(500);
 report.failedNonessentialDownloads=await failedDownloads();assert.ok(report.failedNonessentialDownloads>0);assert.notEqual(await p.evaluate(()=>document.documentElement.dataset.offlineReady),'true');
 step('Simulated night-art download failure prevents a false offline-ready message but does not block morning gameplay');
 await admin('b');await p.click('#leave-retreat');await p.waitForSelector('.world-region-ui.loaded');await p.click('#journal');await p.click('#pocket-journal');await p.click('#pocket-check');await p.waitForSelector('#pocket-update:visible');await p.click('#pocket-update');await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.click('#pocket-accept-update')]);await returning();
 await p.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');report.after=await audit();assert.equal(report.after.version,version);assert.equal(report.after.complete,true);protectedFields(await saved(),before);const backup=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1:before-update')));assert.equal(JSON.parse(backup.raw).candies,89);
 step('Retry downloads the complete package; explicit saved update activates it and preserves the legacy save');
 const expected=await saved();await context.close();context=null;await admin('b',true);await launch(true);await p.goto(root+'enter-stage1.html?renderer=canvas#forest-garden');await native();await p.screenshot({path:dir+'/offline-direct-entry.png'});protectedFields(await saved(),expected);assert.equal((await audit()).version,version);step('After whole-browser close, same direct entry starts offline with server503 and saved progress');
 await p.click('#leave-retreat');await p.goto(root+'?renderer=canvas');await returning();assert.ok((await p.title()).includes('完整版第一阶段'));await p.click('#district-map');await p.click('[data-district-way="garden"]');await p.waitForSelector('canvas[data-forest-period]');protectedFields(await saved(),expected);step('Original formal root bookmark also stays on the new client offline; old garden is absent');
 assert.deepEqual(report.errors,[]);await writeFile(dir+'/report.json',JSON.stringify(report,null,2));
}catch(e){console.error(report.errors,p?.url());console.error(await p?.locator('body').innerText().catch(()=>''));await p?.screenshot({path:dir+'/failure.png'}).catch(()=>{});await writeFile(dir+'/failed-report.json',JSON.stringify(report,null,2));throw e}finally{await context?.close();await admin('b')}
