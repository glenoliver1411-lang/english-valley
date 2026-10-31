import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const type=process.argv.includes('--webkit')?webkit:chromium;
const browser=await type.launch({headless:true,...(type===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify({version:1,accepted:true,catName:'奶盖',candies:23,favorite:'lavender',scenery:{visited:true,stars:['petal'],names:{petal:'晚风'},wish:'愿每个清晨都很温柔。'}}))});
 const ready=async()=>{await page.waitForSelector('#skip-return');await page.click('#skip-return');await page.waitForFunction(()=>!__manor.session.returning)};
 await page.goto('http://localhost:5173');await ready();
 await page.click('#scenery');await page.click('#album-lookout');await page.waitForSelector('#watch-meteor');await page.waitForTimeout(1500);
 const cached=await page.evaluate(()=>{const v=__manor.scenery.view,before=v.mountains.renders;for(let i=0;i<5;i++)v.frame();return{before,after:v.mountains.renders,grass:v.meadow.tufts.length,nativeWidth:v.layers.night.width}});
 assert.equal(cached.before,cached.after);assert.equal(cached.nativeWidth,432);assert.ok(cached.grass>=20);
 const photos=[];
 async function photo(label,button='#sky-photo'){
  await page.click(button);assert.equal(await page.locator('.device').evaluate(el=>el.classList.contains('photographing')),true);
  assert.equal(await page.locator('#observatory-ui').evaluate(el=>getComputedStyle(el).visibility),'hidden');
  await page.click('#save-landscape');await page.waitForFunction(()=>document.querySelector('#landscape-preview')?.naturalWidth===864);
  const result=await page.locator('#landscape-preview').evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');x.drawImage(img,0,0);const samples=[[4,4],[c.width-4,4],[c.width/2,c.height*.8],[c.width/2,c.height-4]].map(([xx,yy])=>x.getImageData(xx,yy,1,1).data[3]);return{width:c.width,height:c.height,samples,png:c.toDataURL()}});
  assert.ok(result.height>result.width);assert.ok(result.samples.every(a=>a===255));
  if(type===chromium)await writeFile(`verification/postcard-${label}.png`,Buffer.from(result.png.split(',')[1],'base64'));
  photos.push({label,width:result.width,height:result.height});console.log('photo',label,result.width,result.height);if(label==='night')await page.waitForTimeout(4700);await page.click('#scenery-close');await page.click('#end-photo');
 }
 await photo('night');
 await page.click('#watch-meteor');await page.waitForFunction(()=>__manor.scenery.view.timeline>18,{},{timeout:45000});await photo('star-shower');assert.equal(await page.evaluate(()=>__manor.scenery.view.mode),'meteor');await page.click('#skip-sky');await page.click('#gift-close');
 await page.click('#wait-dawn');await page.waitForFunction(()=>__manor.scenery.view.timeline>25,{},{timeout:45000});await photo('sunrise');await page.waitForFunction(()=>!__manor.scene.observing,{},{timeout:25000});
 await page.evaluate(()=>__manor.scenery.enter('quiet'));await page.waitForSelector('#quiet-sky-photo');await photo('dusk','#quiet-sky-photo');await page.click('#end-quiet-sky');
 // Shared foreground textures must also remain correctly scaled in the two other viewpoints.
 for(const viewpoint of ['roof','window']){await page.evaluate(viewpoint=>__manor.scenery.enter(null,false,viewpoint),viewpoint);await page.waitForSelector('#sky-photo');await photo(viewpoint);await page.click('#leave-sky')}
 await page.click('#scenery');await page.click('[data-tab="memories"]');await page.check('#reduce-effects');await page.click('#scenery-close');await page.click('#scenery');await page.click('#album-lookout');
 for(const viewport of [{width:375,height:667},{width:430,height:932}]){await page.setViewportSize(viewport);await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>__manor.scenery.view.reduced));await photo(`phone-${viewport.width}`)}
 await page.click('#leave-sky');await page.reload();await ready();const saved=await page.evaluate(()=>__manor.data);
 assert.equal(saved.catName,'奶盖');assert.equal(saved.candies,23);assert.equal(saved.favorite,'lavender');assert.equal(saved.scenery.names.petal,'晚风');assert.equal(saved.scenery.wish,'愿每个清晨都很温柔。');assert.equal(saved.scenery.photos,photos.length);assert.equal(saved.scenery.lowEffects,true);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({engine:type===webkit?'WebKit':'Chromium',cached,photos,passed:'native detail, cached mountains, grass mask, no-UI PNG, live shower and full sunrise, dusk, roof/window, two phone sizes, low effects, reload and retained save',errors}));
}finally{await browser.close()}
