import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch({headless:true,args:engine===chromium?['--no-sandbox']:[]});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5173');await page.waitForSelector('#accept');await page.click('#accept');await page.waitForFunction(()=>window.__manor?.scene&&!window.__manor.scene.locked);
async function at(x,y){await page.evaluate(([x,y])=>{const s=window.__manor.scene;s.target=null;s.player.setPosition(x,y)},[x,y]);await page.waitForTimeout(180)}
async function doneTalk(){for(let i=0;i<12;i++){if(await page.locator('#dialogue').evaluate(el=>el.classList.contains('hidden')))return;await page.locator('#dialogue-next').click();await page.waitForTimeout(50)}throw Error('dialogue stuck')}
await at(216,674);await page.click('#interact');await doneTalk();assert.equal(await page.evaluate(()=>window.__manor.data.stage),1);
await at(113,425);await page.click('#interact');await page.click('[data-candy="lavender"]');await page.click('#exit-shop');assert.equal(await page.evaluate(()=>window.__manor.data.stage),2);
await at(347,483);await page.click('#interact');await doneTalk();await page.fill('#cat-name','奶盖');await page.click('#save-cat');await doneTalk();assert.equal(await page.evaluate(()=>window.__manor.data.stage),3);
for(const pos of [[169,235],[368,317],[44,646]]){await at(...pos);await page.click('#interact')}
assert.equal(await page.evaluate(()=>window.__manor.data.magic.length),3);
await at(235,250);await page.click('#interact');await page.waitForSelector('#continue',{timeout:15000});await page.screenshot({path:'/workspace/xiguang-manor/ending-mobile.png'});await page.click('#continue');assert.equal(await page.evaluate(()=>window.__manor.data.completed),true);
// First plot: planting, watering, growing, and replanting.
await at(57,564);await page.click('#interact');assert.equal(await page.evaluate(()=>window.__manor.data.plots[0].state),1);await page.click('#interact');assert.equal(await page.evaluate(()=>window.__manor.data.plots[0].state),2);
await page.evaluate(()=>{window.__manor.scene.dataSave.plots[0].wateredAt-=19000});await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>window.__manor.data.plots[0].state),3);
await at(78,465);let before=await page.evaluate(()=>window.__manor.data.candies);await page.click('#interact');assert.equal(await page.evaluate(()=>window.__manor.data.candies),before+1);
await page.evaluate(()=>{window.__manor.scene.sweets[0].at=Date.now()-1});await page.waitForTimeout(180);await page.click('#interact');assert.equal(await page.evaluate(()=>window.__manor.data.candies),before+2);
await page.reload();await page.waitForFunction(()=>window.__manor?.scene?.ready&&!window.__manor?.session?.returning);let saved=await page.evaluate(()=>window.__manor.data);assert.equal(saved.completed,true);assert.equal(saved.catName,'奶盖');assert.equal(saved.favorite,'lavender');assert.equal(saved.plots[0].state,3);
// Real keyboard motion and collision.
await at(216,700);await page.keyboard.down('ArrowUp');await page.waitForTimeout(650);await page.keyboard.up('ArrowUp');assert.ok(await page.evaluate(()=>window.__manor.scene.player.y)<670);
await page.click('#journal');await page.click('#replay-letter');await page.click('#accept');await page.click('#journal');await page.click('#replay-ending');await page.waitForSelector('#continue',{timeout:15000});await page.click('#continue');
await page.screenshot({path:'/workspace/xiguang-manor/game-mobile.png'});
await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(250);await page.screenshot({path:'/workspace/xiguang-manor/game-desktop.png'});
assert.deepEqual(errors,[]);console.log(`${engine===webkit?'WebKit':'Chromium'}: complete chapter, preferences, repeat candy, planting, watering, growth, reload, movement, letter and ending replay passed; zero page errors`);await browser.close();
