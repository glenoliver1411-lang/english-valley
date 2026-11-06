import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
try{
 const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify({version:1,accepted:true,completed:true,stage:5,candies:31,favorite:'lavender',catName:'奶盖',scenery:{clock:22,visited:true,names:{petal:'晚风'}},romance:{starWishes:{xi:'原来的愿望'}}}))});
 const ready=async()=>{await p.waitForSelector('#skip-return');await p.click('#skip-return');await p.waitForFunction(()=>!__manor.session.returning)};
 const album=async()=>{await p.click('#sky-album');await p.click('[data-tab="memories"]')};
 const hash=()=>p.evaluate(()=>{const v=__manor.scenery.view,d=v.ctx.getImageData(0,0,432,Math.floor(v.h*1.4)).data;let h=2166136261;for(let i=0;i<d.length;i+=16)h=Math.imul(h^d[i]^d[i+1]*17^d[i+2]*31,16777619);return h>>>0});
 await p.goto('http://localhost:5173');await ready();await p.evaluate(()=>__manor.scenery.enter(null,false,'lake'));await p.waitForSelector('#sky-photo');
 // The first automatic show uses real active viewing time, without clicking replay.
 await p.waitForFunction(()=>__manor.scenery.view?.mode==='meteor'&&__manor.scenery.view.automaticShow,{},{timeout:20000});
 assert.equal(await p.locator('#skip-sky').isVisible(),true);assert.equal(await p.evaluate(()=>__manor.scenery.view.director.count),1);
 // Advance the already-tested particle timeline, then let the real scene finish it.
 await p.evaluate(()=>{const v=__manor.scenery.view;for(let i=0;i<720;i++)v.meteors.update(.05,{mode:'show'});v.update(0,16)});
 await p.waitForFunction(()=>__manor.scenery.view.mode==='idle');assert.equal(await p.locator('#gift-close').count(),0,'automatic sky must not force a reward dialog');assert.equal(await p.evaluate(()=>__manor.data.scenery.meteorSeen),true);
 await p.evaluate(()=>{const v=__manor.scenery.view;v.director.calm=24;v.update(0,16)});await p.waitForFunction(()=>__manor.scenery.view.mode==='fireworks'&&__manor.scenery.view.automaticShow);
 assert.equal(await p.locator('#end-fireworks').isVisible(),true);await p.click('#end-fireworks');assert.equal(await p.evaluate(()=>__manor.scenery.view.director.stopped),true);
 await p.click('#watch-fireworks');assert.equal(await p.locator('[data-firework-style]').count(),7);
 for(const style of ['gold','willow','heart','star','layered','comet','cascade']){await p.click(`[data-firework-style="${style}"]`);assert.equal(await p.evaluate(()=>__manor.data.scenery.fireworkStyle),style)}await p.click('#end-fireworks');
 // Real settings change the active panorama, not only the saved map clock.
 await album();await p.check('#reduce-motion');const palettes=[];
 for(const [name,hour]of [['morning',6.8],['day',12],['dusk',18],['night',22]]){await p.click(`[data-hour="${name}"]`);const v=await p.evaluate(()=>{const v=__manor.scenery.view;v.skyReveal=1;v.frame();return v.baseHour});assert.ok(Math.abs(v-hour)<.04);palettes.push(await hash())}assert.equal(new Set(palettes).size,4);
 const duskJump=await p.evaluate(()=>{const v=__manor.scenery.view;v.baseHour=18;v.frame();const before=v.ctx.getImageData(0,0,432,v.h*2).data;v.baseHour=18.0001;v.frame();const after=v.ctx.getImageData(0,0,432,v.h*2).data;let delta=0;for(let i=0;i<before.length;i++)delta+=Math.abs(before[i]-after[i]);v.baseHour=22;v.frame();return delta/before.length});assert.ok(duskJump<.1,'fractional dusk clock must not suddenly switch to daylight materials');
assert.equal(await p.locator('#aurora-enabled').count(),0);assert.equal(await p.locator('#album-aurora').getAttribute('href'),'./aurora.html');assert.equal(await p.evaluate(()=>Boolean(__manor.scenery.view.aurora)),false);
 await p.uncheck('#auto-landscapes');await p.click('#scenery-close');
 const perf=await p.evaluate(()=>{const v=__manor.scenery.view,times=[];for(let i=0;i<20;i++){const t=performance.now();v.frame();times.push(performance.now()-t)}times.sort((a,b)=>a-b);return{medianFrameMs:times[10],cache:v.lakeArt.materials.cache.size}});assert.ok(perf.cache<60);
 await p.click('#sky-photo');await p.click('#save-landscape');await p.waitForFunction(()=>document.querySelector('#landscape-preview')?.naturalWidth===864);await p.click('#scenery-close');await p.click('#end-photo');await p.click('#leave-sky');
 // Roof and window share detailed distant scenery; small phones retain controls.
 for(const viewpoint of ['roof','window']){await p.evaluate(viewpoint=>__manor.scenery.enter(null,false,viewpoint),viewpoint);await p.waitForFunction(()=>__manor.scenery.view?.mountains?.cache.size>=1);assert.ok(await p.evaluate(()=>__manor.scenery.view.mountains.cache.size>=1));await p.setViewportSize({width:375,height:667});await p.waitForTimeout(150);assert.ok(await p.locator('#leave-sky').isVisible());await p.click('#leave-sky')}await p.setViewportSize({width:390,height:844});
 await p.reload();await ready();const data=await p.evaluate(()=>__manor.data),settings=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiguang-world-atmosphere-v1')));assert.equal(data.candies,31);assert.equal(data.catName,'奶盖');assert.equal(data.favorite,'lavender');assert.equal(data.scenery.names.petal,'晚风');assert.equal(data.romance.starWishes.xi,'原来的愿望');assert.equal(settings.autoShows,false);assert.equal(settings.aurora,true);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({engine:engine.name(),passed:'real automatic meteor start, non-modal finish, spaced fireworks, cancel, seven styles, four live time palettes, independent aurora destination, 864px photo, roof/window detail, small phone and old save',perf,errors}));
}finally{await browser.close()}
