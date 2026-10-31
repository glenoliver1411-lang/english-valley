// Mobile browser integration: real UI entry paths, camera/rendering, and save invariants.
import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
const errors=[];
const create=async(options={})=>{const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,...options});page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.__audioCount=0;const Real=window.AudioContext||window.webkitAudioContext;if(Real)window.AudioContext=new Proxy(Real,{construct(target,args){window.__audioCount++;return Reflect.construct(target,args)}})});return page};
const ready=page=>page.waitForFunction(()=>window.__manor?.gift);
const free=page=>page.waitForFunction(()=>!__manor.gift.active&&!__manor.scene.locked,{},{timeout:20000});
const tap=async(page,selector)=>{await page.locator(selector).scrollIntoViewIfNeeded();const b=await page.locator(selector).boundingBox();await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2)};
const profile=page=>page.evaluate(()=>{const d=__manor.data;delete d.scenery.clock;return d});
const clean=async page=>{assert.deepEqual(await page.evaluate(()=>({opening:!!__manor.scene.giftOpening,texture:__manor.scene.textures.exists('gift-journey-sky'),bounds:__manor.scene.cameras.main.getBounds().y,visible:__manor.scene.world.visible,raf:__manor.gift.raf})),{opening:false,texture:false,bounds:0,visible:true,raf:0})};
try {
  const p=await create();await p.goto('http://localhost:5173');await ready(p);
  assert.equal(await p.locator('#gift-envelope').textContent(),'小曦亲启');assert.equal(await p.evaluate(()=>__manor.data.accepted),false);assert.equal(await p.evaluate(()=>__audioCount),0);
  const before=await p.evaluate(()=>Array.from(__manor.gift.canvas.getContext('2d').getImageData(78,Math.round(__manor.gift.canvas.height*.51)-60,276,210).data));
  await tap(p,'#gift-envelope');await p.waitForTimeout(680);
  const after=await p.evaluate(()=>Array.from(__manor.gift.canvas.getContext('2d').getImageData(78,Math.round(__manor.gift.canvas.height*.51)-60,276,210).data));
  assert.ok(before.filter((value,i)=>value!==after[i]).length>5000,'flap and paper must change actual pixels');
  await p.waitForSelector('#accept');assert.ok(await p.locator('#gift-letter p').textContent().then(s=>s.includes('你的名字好美，所以我送给你一座庄园。')));await p.waitForTimeout(650);
  await p.screenshot({path:`verification/gift-letter-${engine.name()}.png`});await tap(p,'#accept');
  await p.waitForFunction(()=>__manor.gift.awakening?.elapsed>1.4);assert.ok(await p.evaluate(()=>__manor.scene.cameras.main.scrollY<-250));
  const early=await p.evaluate(()=>new Promise(resolve=>__manor.scene.sys.game.renderer.snapshot(image=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);resolve(Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data))})));
  await p.waitForFunction(()=>__manor.gift.awakening?.elapsed>6.8,{},{timeout:15000});
  assert.ok(await p.evaluate(()=>__manor.scene.gates[0].x<201));assert.ok(await p.evaluate(()=>__manor.scene.giftLight>.95));
  const late=await p.evaluate(()=>new Promise(resolve=>__manor.scene.sys.game.renderer.snapshot(image=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);resolve(Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data))})));
  assert.ok(early.filter((value,i)=>i%4!==3&&value!==late[i]).length>100000,'camera must reveal the rendered original manor, not just run a timer');
  await free(p);await clean(p);assert.equal(await p.evaluate(()=>__manor.data.accepted),true);assert.equal(await p.evaluate(()=>__manor.data.stage),0);
  await p.waitForFunction(()=>document.querySelector('#gift-welcome>span')?.textContent==='这里的每一寸风景，都为你准备好了。');
  const x=await p.evaluate(()=>__manor.scene.player.x);await p.keyboard.down('ArrowRight');await p.waitForTimeout(350);await p.keyboard.up('ArrowRight');await p.waitForTimeout(150);
  assert.ok(await p.evaluate(()=>__manor.scene.player.x)>x+8);assert.equal(await p.evaluate(()=>__manor.scene.player.anims.isPlaying),false);
  await p.screenshot({path:`verification/gift-welcome-${engine.name()}.png`});
  await p.evaluate(()=>{__manor.gift.nextHint=0;__manor.scene.player.setPosition(113,425)});await p.waitForSelector('#first-visit-tip.show');assert.ok(await p.locator('#first-visit-tip').textContent().then(s=>s.includes('糖果屋')));assert.equal(await p.evaluate(()=>__manor.scene.locked),false);
  // Every destination is accessible immediately, with the original zero-stage save.
  for(const place of ['cabin','garden']){await tap(p,'#world-wander');await tap(p,`#world-${place}`);await p.waitForFunction(place=>__manor.romantic.view?.place===place,place);await tap(p,'#leave-retreat')}
  await tap(p,'#world-wander');await tap(p,'#world-shop');await p.waitForFunction(()=>__manor.workshop.active);await tap(p,'#exit-shop');await p.waitForFunction(()=>!__manor.workshop.active);
  await tap(p,'#scenery');await tap(p,'#album-lookout');await p.waitForSelector('#leave-sky');await tap(p,'#leave-sky');
  await p.evaluate(()=>__manor.scene.api.save());const saved=await profile(p);await p.reload();await ready(p);await p.waitForSelector('#skip-return');assert.equal(await p.evaluate(()=>__manor.gift.active),false);await tap(p,'#skip-return');await p.waitForFunction(()=>!__manor.session.returning);assert.deepEqual(await profile(p),saved);
  // Replay, accept and skip must never teleport or rewrite existing collections.
  await tap(p,'#journal');await tap(p,'#replay-opening');const original=await profile(p);
  await tap(p,'#gift-envelope');await tap(p,'#skip-gift');await p.waitForSelector('#accept');await tap(p,'#accept');await p.waitForTimeout(600);await tap(p,'#skip-gift');await free(p);await clean(p);assert.deepEqual(await profile(p),original);
  await p.close();

  // Skip directly from the sealed envelope and refresh: accepted flag persists.
  const skip=await create();await skip.goto('http://localhost:5173');await ready(skip);await tap(skip,'#skip-gift');await free(skip);await clean(skip);assert.equal(await skip.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1')).accepted),true);await skip.reload();await skip.waitForSelector('#skip-return');await tap(skip,'#skip-return');await skip.close();

  // iPhone SE sized viewport, OS reduced motion, readable letter, quick transition.
  const reduced=await create({viewport:{width:375,height:667},reducedMotion:'reduce'});await reduced.goto('http://localhost:5173');await ready(reduced);await tap(reduced,'#gift-envelope');await reduced.waitForSelector('#accept');
  const accept=await reduced.locator('#accept').boundingBox();assert.ok(accept.y>0&&accept.y+accept.height<667);
  const stillA=await reduced.locator('#gift-opening canvas').screenshot();await reduced.waitForTimeout(350);const stillB=await reduced.locator('#gift-opening canvas').screenshot();assert.equal(Buffer.compare(stillA,stillB),0,'reduced opening sky must stay still');
  await tap(reduced,'#accept');await free(reduced);await clean(reduced);await reduced.close();

  // An old, personalized save keeps all progress; music awaits an actual touch.
  const old=await create();await old.addInitScript(()=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify({version:1,accepted:true,completed:true,stage:5,candies:88,favorite:'lavender',catName:'奶盖',catMet:true,music:true,magic:[0,1,2],position:{x:88,y:588},scenery:{stars:['xi','petal'],names:{petal:'晚风'},wish:'愿你开心'},romance:{theme:'lavender',personalStar:true,starWishes:{xi:'留给你的光'}}}))});await old.goto('http://localhost:5173');await ready(old);await old.waitForSelector('#skip-return');assert.equal(await old.evaluate(()=>__audioCount),0);await tap(old,'#skip-return');await old.waitForFunction(()=>!__manor.session.returning);assert.ok(await old.evaluate(()=>__audioCount)>0);
  const oldData=await profile(old);await tap(old,'#journal');await tap(old,'#replay-opening');await tap(old,'#gift-envelope');await old.waitForSelector('#accept');await tap(old,'#accept');await old.setViewportSize({width:430,height:932});await free(old);await clean(old);assert.deepEqual(await profile(old),oldData);await old.close();

  // Storage failures do not strand the player or silently claim a successful save.
  const fail=await create();await fail.goto('http://localhost:5173');await ready(fail);await fail.evaluate(()=>{window.__realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota')}});await tap(fail,'#skip-gift');await free(fail);assert.equal(await fail.evaluate(()=>__manor.session.progress.lastSaveOK),false);assert.equal(await fail.evaluate(()=>__manor.session.guarding),true);await fail.evaluate(()=>{Storage.prototype.setItem=window.__realSet;__manor.scene.api.save()});assert.equal(await fail.evaluate(()=>__manor.session.progress.lastSaveOK),true);await fail.close();
  assert.deepEqual(errors,[]);console.log(`${engine.name()} PASS: pixel envelope, full camera/light awakening, immediately free controls, proximity hints, all destinations, subsequent entry, replay/skip/resize cleanup, old saves, reduced motion at 375x667, gesture-only audio, storage failure recovery; no page errors.`);
} finally {await browser.close()}
