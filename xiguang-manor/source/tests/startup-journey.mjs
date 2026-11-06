import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const b=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
const errors=[];
async function page(){const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{localStorage.setItem('xiguang-manor-v1',JSON.stringify({version:1,accepted:true,completed:true,stage:5,candies:49,catName:'奶盖',favorite:'lavender',romance:{reducedMotion:true},scenery:{clock:22,names:{petal:'晚风'}}}));localStorage.setItem('xiguang-world-atmosphere-v1',JSON.stringify({autoShows:false,aurora:false}))});return p}
try{
 const p=await page(),requests=[];p.on('request',r=>{if(['image','xhr','fetch'].includes(r.resourceType()))requests.push(r.url())});let release;const held=new Promise(resolve=>release=resolve);
 await p.route('**/atelier.webp',async route=>{await held;await route.abort()});
 await p.goto('http://localhost:5173/',{waitUntil:'domcontentloaded'});await p.waitForSelector('#boot-progress');assert.equal(await p.locator('#manor-loading').isVisible(),true);release();
 await p.waitForSelector('#skip-return');await p.click('#skip-return');await p.waitForFunction(()=>!__manor.session.returning);assert.equal(await p.locator('#manor-loading').isVisible(),false);
 assert.ok(requests.some(u=>u.includes('atelier.png')),'unsupported/interrupted WebP falls back to original lossless PNG');
 assert.equal(requests.filter(u=>u.includes('/assets/lakeside/')).length,0,'obsolete scenery images must not block startup');
 assert.equal(await p.evaluate(()=>__manor.scene.textures.exists('map-morning')),false,'unused map palettes should not be painted before first interaction');
 await p.click('#scenery');await p.click('[data-tab="memories"]');await p.click('[data-hour="morning"]');await p.click('#scenery-close');assert.equal(await p.evaluate(()=>__manor.scene.textures.exists('map-morning')),true);
 await p.click('#world-wander');await p.click('#world-shop');await p.waitForSelector('#shop-make');await p.click('#leave-candy-house');
 await p.click('#scenery');await p.click('#album-lookout');await p.waitForSelector('#watch-meteor:enabled');await p.click('#sky-photo');await p.click('#save-landscape');await p.waitForFunction(()=>document.querySelector('#landscape-preview')?.naturalWidth===864);await p.click('#scenery-close');await p.click('#end-photo');await p.click('#leave-sky');
 assert.equal(requests.filter(u=>u.includes('/assets/lakeside/')).length,0,'V5 sky uses its original V5 atlas, without reloading superseded art');
 const save=await p.evaluate(()=>__manor.data);assert.equal(save.candies,49);assert.equal(save.catName,'奶盖');assert.equal(save.scenery.names.petal,'晚风');await p.close();
 const failed=await page();await failed.route('**/assets/v5/*',r=>['image','xhr','fetch'].includes(r.request().resourceType())?r.abort():r.continue());await failed.goto('http://localhost:5173/');await failed.waitForSelector('#boot-retry:visible');assert.ok(await failed.locator('#boot-message').textContent().then(t=>t.includes('没有加载完成')));assert.equal(await failed.locator('#boot-canvas').isVisible(),true);assert.equal(await failed.evaluate(()=>__manor.scene?.ready??false),false);assert.equal(await failed.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-manor-v1')).candies),49);await failed.close();
 const canvas=await page();await canvas.goto('http://localhost:5173/?renderer=canvas');await canvas.waitForSelector('#skip-return');await canvas.click('#skip-return');await canvas.waitForFunction(()=>!__manor.session.returning);assert.equal(await canvas.evaluate(()=>__manor.scene.sys.game.config.renderType),1);await canvas.click('#world-wander');assert.equal(await canvas.locator('#world-cabin').isVisible(),true);await canvas.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({engine:engine.name(),passed:'immediate loading UI, real failed WebP to PNG retry, lazy map palettes, zero legacy art downloads, live candy/sky/photo, bounded failure recovery, Canvas compatibility and original progress',errors}));
}finally{await b.close()}
