import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh,sanitize} from '../src/save.js';
import {ADVENTURE} from '../src/adventure-config.js';
import {compactMenuClicks} from './compact-menu.mjs';
const engine=process.argv.includes('--webkit')?webkit:chromium,url=process.env.DAYLIGHT_URL||'http://localhost:5221/english-valley/xiguang-manor/daylight-preview/',dir='verification/characters/'+engine.name();await mkdir(dir,{recursive:true});
const browser=await engine.launch(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']}),p=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});compactMenuClicks(p);p.setDefaultTimeout(60000);
const report={engine:engine.name(),costumes:[],scenes:[],errors:[],physicalDevice:false},saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1'))),ready=()=>p.waitForFunction(()=>window.__manor?.district?.view?.player&&!window.__manor.session.returning),shot=async n=>{await p.waitForTimeout(700);await p.screenshot({path:`${dir}/${n}.png`})};p.on('pageerror',e=>report.errors.push(e.message));
async function wardrobe(id){await p.click('#district-map');await p.click('[data-district-pocket="wardrobe"]');await p.click(`[data-outfit="${id}"]`);if(await p.locator('#buy-outfit').isEnabled())await p.click('#buy-outfit');await p.click('#adventure-close');await p.waitForFunction(id=>__manor.district.view.player.texture.key===(id==='original'?'girl':'girl-'+id),id)}
async function travel(id){await p.click('#district-map');await p.click(`[data-district-way="${id}"]`)}
async function actor(which,id){return p.evaluate(({which,id})=>{const s=which==='world'?__manor.district.view:which==='home'?__manor.romantic.view:which==='candy'?__manor.workshop.view:which==='florist'?__manor.florist.view:__manor.adventure.view;return{key:s.player.texture.key,width:s.player.frame.width,height:s.player.frame.height,frame:s.player.frame.name,scale:s.player.scaleX,expected:id==='original'?'girl':'girl-'+id}}, {which,id})}
function detailed(a){assert.equal(a.key,a.expected);assert.equal(a.width,64);assert.equal(a.height,80)}
try{
 const d=fresh();Object.assign(d,{accepted:true,completed:true,stage:5,music:false,favorite:'lavender',candies:120,catName:'红豆'});d.scenery.clock=7.5;d.wardrobe.owned=ADVENTURE.outfits.map(o=>o.id);d.adventure.inventory={oldkey:2,crown:1,ghostlamp:1,rosepin:1,catbell:1};d.play.equipment={head:'crown',pin:'rosepin',hand:'ghostlamp',companion:'catbell'};
 await p.addInitScript(d=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify(d))},d);await p.goto(url);await p.click('#skip-return');await ready();await p.waitForTimeout(2500);const baseline=await saved();await shot('original-world');
 for(const {id}of (process.argv.includes('--scenes-only')?[]:ADVENTURE.outfits)){
  await wardrobe(id);detailed(await actor('world',id));await shot(id+'-world');
  await travel('cabin');await p.waitForFunction(()=>__manor.romantic.active&&__manor.romantic.view?.player);detailed(await actor('home',id));await shot(id+'-home');
  const directions=[];
  for(const [key,facing]of [['ArrowLeft',1],['ArrowRight',2],['ArrowUp',3],['ArrowDown',0]]){await p.keyboard.down(key);await p.waitForTimeout(250);const a=await p.evaluate(()=>{const s=__manor.romantic.view;return{animation:s.player.anims.currentAnim?.key,facing:s.facing,key:s.player.texture.key,width:s.player.frame.width}});await p.keyboard.up(key);assert.equal(a.animation,`dress-${id}-${facing}`);assert.equal(a.width,64);directions.push(a)}
  // Use the real scene action: fixed sofa follows the same sit/stand path as touch interaction.
  await p.evaluate(()=>__manor.romantic.sit('sofa'));await p.waitForTimeout(1000);const frames=[];for(let i=0;i<8;i++){await p.waitForTimeout(60);frames.push(await p.evaluate(()=>__manor.romantic.view.player.texture.key+'/'+__manor.romantic.view.player.frame.name))}assert.deepEqual([...new Set(frames)],[`xiaoxi-seated/${id}-front`]);await shot(id+'-seated');await p.click('#stand-retreat');detailed(await actor('home',id));
  await p.click('#leave-retreat');await ready();detailed(await actor('world',id));assert.equal((await saved()).candies,120);report.costumes.push({id,directions,seated:frames[0]});console.log(id+' remains detailed through 4-way walking, sofa, stand and return');
 }
 await wardrobe('cocoa');
 for(const id of ['florist','shop','garden','meadow']){await travel(id);const which=id==='florist'?'florist':id==='shop'?'candy':'home';await p.waitForFunction(which=>{const ui=which==='florist'?__manor.florist:which==='candy'?__manor.workshop:__manor.romantic;return ui.active&&ui.view?.player},which);detailed(await actor(which,'cocoa'));await shot(id);const leave=id==='florist'?'#leave-florist':id==='shop'?'#leave-candy-house':'#leave-retreat';await p.click(leave);await ready();report.scenes.push(id)}
 await travel('ruins');await p.waitForFunction(()=>__manor.adventure.view?.player);detailed(await actor('ruins','cocoa'));await shot('ruins');await p.click('#run-rest');await p.click('#pause-expedition');await ready();report.scenes.push('ruins');
 await p.click('#district-views');await p.click('[data-district-view="stars"]');await p.waitForFunction(()=>__manor.scenery.view);await shot('lake');await p.click('#leave-sky');await ready();report.scenes.push('lake');
 await p.click('#district-views');await p.click('[data-district-view="aurora"]');await p.waitForSelector('#aurora-canvas canvas');await shot('aurora');await p.click('#aurora-back');await ready();report.scenes.push('independent aurora');
 const expected=await saved();for(const k of ['candies','romance','shop','plots','catName'])assert.deepEqual(sanitize(expected)[k],sanitize(baseline)[k],k);assert.deepEqual(expected.wardrobe.owned,baseline.wardrobe.owned);assert.deepEqual(expected.adventure.inventory,baseline.adventure.inventory);
 await p.reload();await p.click('#skip-return');await ready();detailed(await actor('world','cocoa'));assert.equal((await saved()).wardrobe.equipped,'cocoa');
 await p.setViewportSize({width:375,height:667});await travel('cabin');await p.waitForFunction(()=>__manor.romantic.active&&__manor.romantic.view?.player);detailed(await actor('home','cocoa'));await shot('small-home');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(report.errors,[]);await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));console.log('All character and save checks passed');
}catch(e){console.error(report,e);await shot('failure').catch(()=>{});throw e}finally{await browser.close()}
