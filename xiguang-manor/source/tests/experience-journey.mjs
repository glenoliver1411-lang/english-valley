import{chromium,webkit,devices}from'@playwright/test';import assert from'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium,b=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
const errors=[];
try{
 const p=await b.newPage({...devices[engine===webkit?'iPhone 13':'Pixel 7'],viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(e.message));let release;const hold=new Promise(r=>release=r);
 await p.route('**/src/main.js',async r=>{await hold;await r.continue()});await p.goto('http://localhost:5173/',{waitUntil:'domcontentloaded'});await (await p.waitForSelector('#gift-envelope')).dispose();assert.equal(await p.evaluate(()=>typeof window.__manor),'undefined','gift must work before engine/business code downloads');await p.click('#gift-envelope');await (await p.waitForSelector('#accept')).dispose();assert.ok(await p.locator('#gift-letter p').textContent().then(t=>t.includes('你的名字好美，所以我送给你一座庄园。')));await p.click('#skip-gift');await (await p.waitForSelector('#gift-engine-wait')).dispose();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1')).accepted),true);release();await p.waitForFunction(()=>window.__manor?.scene?.ready&&!__manor.gift.active&&!__manor.scene.locked,{},{timeout:30000});assert.equal(await p.locator('#skip-return').count(),0,'early skip must not become a returning-player intro');
 await p.evaluate(()=>{__manor.scene.dataSave.favorite='lavender';__manor.scene.dataSave.romance.reducedMotion=true;__manor.scene.dataSave.catName='奶盖';__manor.scene.api.save()});
 const summary=[];
 for(const size of [{width:375,height:667},{width:390,height:844},{width:430,height:932},{width:360,height:800},{width:412,height:915}]){
  await p.setViewportSize(size);await p.waitForTimeout(120);
  for(const button of await p.locator('.topbar nav button').all()){const r=await button.boundingBox();assert.ok(r.width>=43&&r.height>=43);assert.ok(r.x>=0&&r.x+r.width<=size.width+1)}
  assert.equal(await p.locator('#game canvas').evaluate(c=>getComputedStyle(c).touchAction),'none');
  await p.evaluate(()=>__manor.scene.player.setPosition(216,728));const x=await p.evaluate(()=>__manor.scene.player.x),j=await p.locator('#joystick').boundingBox();
  await p.mouse.move(j.x+j.width*.8,j.y+j.height/2);await p.mouse.down();await p.waitForTimeout(180);await p.mouse.up();assert.ok(await p.evaluate(()=>__manor.scene.player.x)>x+3);summary.push(size);
 }
 await p.click('#world-wander');await p.click('#world-meadow');await p.waitForFunction(()=>__manor.romantic.view?.place==='meadow');await p.click('#leave-retreat');
 const resources=[];
 for(let cycle=0;cycle<4;cycle++){
  for(const place of ['cabin','meadow']){await p.click('#world-wander');await p.click('#world-'+place);await p.waitForFunction(place=>__manor.romantic.view?.place===place,place);if(place==='cabin'){await p.click('#retreat-decor');await p.locator('[data-home-add]').first().waitFor();assert.equal(await p.locator('[data-home-add]').count(),12);await p.click('#romantic-close')}await p.click('#leave-retreat')}
  await p.click('#world-wander');await p.click('#world-shop');await (await p.waitForSelector('#shop-make')).dispose();await p.click('#shop-make');await p.click('#begin-batch');await p.click('#workshop-close');await p.click('#leave-candy-house');
  await p.click('#scenery');await p.click('#album-lookout');await (await p.waitForSelector('#watch-meteor:enabled')).dispose();await p.click('#leave-sky');await p.waitForTimeout(50);
  resources.push(await p.evaluate(async()=>{const{paintCacheStats}=await import('/src/scene-paint-cache.js');const s=__manor.scene;return{textures:Object.keys(s.textures.list).length,cache:paintCacheStats(),retreatInput:s.sys.game.scene.getScene('retreat').input.listenerCount('pointerdown'),skyInput:s.sys.game.scene.getScene('sky').input.listenerCount('pointerdown'),raf:__manor.workshop.raf,observers:document.querySelectorAll('#romantic-ui,#candy-house-ui,#observatory-ui').length}}));
 }
 assert.ok(resources.every(v=>v.cache.count<=v.cache.limit&&v.raf===0&&v.observers===3));assert.equal(resources.at(-1).textures,resources.at(-2).textures,'scene-owned GPU textures must return to the same warmed baseline');assert.equal(resources.at(-1).retreatInput,0);assert.equal(resources.at(-1).skyInput,0);
 // Real independent page navigation, using the original saved return position.
 for(let i=0;i<2;i++){await p.click('#world-wander');await p.click('#world-meadow');await (await p.waitForSelector('#retreat-aurora')).dispose();await p.click('#retreat-aurora');await p.locator('#aurora-loading').waitFor({state:'hidden',timeout:30000});await p.click('#aurora-back');await (await p.waitForSelector('#leave-retreat',{timeout:30000})).dispose();await p.click('#leave-retreat');assert.equal(await p.locator('#game canvas').count(),1)}
 const save=await p.evaluate(()=>__manor.data);assert.equal(save.catName,'奶盖');assert.equal(save.favorite,'lavender');assert.deepEqual(errors,[]);console.log(JSON.stringify({engine:engine.name(),viewports:summary,resources,passed:'engine-independent usable letter, safe pending skip, touch targets and joystick, lazy scenes/editor, repeated cleanup, independent aurora round trips and old preferences',errors}));
}finally{await b.close()}
