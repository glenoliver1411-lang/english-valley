import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fresh} from '../src/save.js';
import {compactMenuClicks} from './compact-menu.mjs';
const engine=process.argv.includes('--webkit')?webkit:chromium,url=process.env.ROOM_URL||'http://localhost:5240/',dir='verification/room-meteor/'+engine.name();await mkdir(dir,{recursive:true});
const browser=await engine.launch(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']}),context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}),p=await context.newPage();compactMenuClicks(p);p.setDefaultTimeout(60000);const report={errors:[],physicalDevice:false,engine:engine.name()},errors=report.errors;p.on('pageerror',e=>errors.push(e.message));
const d=fresh();Object.assign(d,{accepted:true,completed:true,stage:5,music:false,favorite:'lavender',candies:120});d.scenery.clock=7.5;
await p.addInitScript(d=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify(d))},d);
const world=()=>p.waitForFunction(()=>__manor?.district?.view?.player&&!__manor.session.returning),home=()=>p.waitForFunction(()=>__manor.romantic.active&&__manor.romantic.view?.player),screen=async n=>{await p.waitForTimeout(500);await p.screenshot({path:`${dir}/${n}.png`})};
async function enter(){await p.click('#district-map');await p.click('[data-district-way="cabin"]');await home()}
async function editor(){await p.click('#retreat-decor');await p.waitForSelector('#room-catalog')}
async function state(){return p.evaluate(()=>({saved:JSON.parse(localStorage.getItem('xiguang-manor-v1')),draft:JSON.parse(JSON.stringify(__manor.romantic.home.loaded?__manor.romantic.home.room:__manor.data.romance.room)),sprites:[...__manor.romantic.view.homeSprites.keys()]}))}
try{
 await p.goto(url);await p.click('#skip-return');await world();await enter();await screen('home-before-edit');await editor();await screen('editor-full-room');
 for(let i=0;i<2;i++){await p.click('#room-catalog');await p.click('[data-home-add="chair"]')}
 let s=await state();assert.equal(s.draft.items.filter(i=>i.type==='chair').length,3);assert.equal(new Set(s.draft.items.map(i=>i.id)).size,s.draft.items.length);assert.equal(s.saved.romance.room.items.filter(i=>i.type==='chair').length,1);await screen('three-chairs');
 // Exercise the real pointer input, holding before a drag. Coordinates are derived from the actual camera.
 const setup=await p.evaluate(()=>{const v=__manor.romantic.view,c=v.cameras.main,i=__manor.romantic.home.room.items.find(i=>i.type==='bed');__manor.romantic.home.fit();return i.id});await p.waitForTimeout(250);
 async function location(id){return p.evaluate(id=>{const v=__manor.romantic.view,im=v.homeSprites.get(id),cam=v.cameras.main,r=v.game.canvas.getBoundingClientRect(),b=im.getBounds();return{x:r.x+((b.centerX-cam.scrollX-cam.width/2)*cam.zoom+cam.width/2)/v.scale.gameSize.width*r.width,y:r.y+((b.centerY-cam.scrollY-cam.height/2)*cam.zoom+cam.height/2)/v.scale.gameSize.height*r.height}},id)}
 async function dragId(id,dx,dy){const q=await p.evaluate(id=>{const v=__manor.romantic.view,im=v.homeSprites.get(id),cam=v.cameras.main,rect=v.game.canvas.getBoundingClientRect(),b=im.getBounds(),world={x:b.centerX,y:b.bottom-12};return{x:rect.x+((world.x-cam.scrollX-cam.width/2)*cam.zoom+cam.width/2)/v.scale.gameSize.width*rect.width,y:rect.y+((world.y-cam.scrollY-cam.height/2)*cam.zoom+cam.height/2)/v.scale.gameSize.height*rect.height}},id);await p.mouse.move(q.x,q.y);await p.mouse.down();await p.waitForTimeout(380);await p.mouse.move(q.x+dx,q.y+dy,{steps:12});await p.mouse.up();await p.waitForTimeout(150)}
 await dragId(setup,-18,30);let after=await state();assert.notDeepEqual(after.draft.items.find(i=>i.id===setup),s.draft.items.find(i=>i.id===setup));await screen('bed-moved');
 await p.click('#room-undo');s=await state();assert.deepEqual(s.draft.items.find(i=>i.id===setup),d.romance.room.items.find(i=>i.id===setup));await p.click('#room-redo');
 const books=await p.evaluate(()=>__manor.romantic.home.room.items.find(i=>i.type==='bookcase'));await dragId(books.id,-13,14);assert.notDeepEqual((await state()).draft.items.find(i=>i.id===books.id),books);
 if(engine===chromium){
  await p.click('#room-fit');await p.waitForTimeout(200);const q=await location(setup),cdp=await context.newCDPSession(p),before=(await state()).draft.items.find(i=>i.id===setup);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:q.x,y:q.y,id:1}]});await p.waitForTimeout(380);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:q.x-8,y:q.y+40,id:1}]});await p.waitForTimeout(120);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notDeepEqual((await state()).draft.items.find(i=>i.id===setup),before);report.nativeTouchDrag=true;
  const oldZoom=await p.evaluate(()=>__manor.romantic.view.cameras.main.zoom);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:330,id:1},{x:240,y:330,id:2}]});await p.waitForTimeout(100);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120,y:330,id:1},{x:270,y:330,id:2}]});await p.waitForTimeout(120);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await p.evaluate(old=>__manor.romantic.view.cameras.main.zoom>old,oldZoom));report.nativePinchZoom=true;await p.click('#room-fit');
 }

 await p.click('#room-catalog');await p.click('[data-home-add="rug"]');s=await state();assert.equal(s.draft.items.filter(i=>i.type==='rug').length,2);await p.click('#room-plans');await p.fill('#room-plan-name','窗边的午后');await p.click('#room-plan-save');await p.click('#room-plan-back');await p.click('#room-save');await p.waitForSelector('#leave-retreat');await screen('home-saved');
 const committed=(await state()).saved;assert.equal(committed.romance.room.items.filter(i=>i.type==='chair').length,3);assert.equal(committed.romance.room.layouts.length,1);assert.equal(committed.candies,120);
 await editor();await p.click('#room-catalog');await p.click('[data-home-tab="placed"]');await p.locator('[data-home-store]').first().click();await p.click('#room-return-editor');await p.click('#room-cancel');assert.deepEqual((await state()).saved.romance.room,committed.romance.room);
 await p.click('#leave-retreat');await world();await enter();let re=(await state());assert.deepEqual(re.saved.romance.room,committed.romance.room);assert.equal(re.sprites.length,committed.romance.room.items.length);
 await p.setViewportSize({width:375,height:667});await editor();await screen('small-editor');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.click('#room-cancel');
 await p.reload();await p.click('#skip-return');await world();await enter();assert.deepEqual((await state()).saved.romance.room,committed.romance.room);assert.deepEqual(errors,[]);await writeFile(`${dir}/room-report.json`,JSON.stringify(report,null,2));console.log('Room editor checks passed',engine.name());
}catch(e){await screen('failure').catch(()=>{});console.error(errors);throw e}finally{await browser.close()}
