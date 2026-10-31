// First visit regression: the V4 manor is free from NPCs and quest gates.
import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
try{
 const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173');await p.waitForSelector('#accept');assert.ok((await p.locator('.letter>p').textContent()).startsWith('你的名字好美，所以我送给你一座庄园。'));await p.click('#accept');await p.waitForFunction(()=>window.__manor?.scene?.ready&&!window.__manor.scene.locked);
 const at=async(x,y)=>{await p.evaluate(([x,y])=>{const s=__manor.scene;s.target=null;s.player.setPosition(x,y)},[x,y]);await p.waitForTimeout(170)};
 await at(113,425);await p.click('#interact');await p.click('[data-candy="lavender"]');await p.click('#exit-shop');await at(347,483);await p.click('#interact');await p.fill('#companion-name','奶盖');await p.click('#save-companion');await p.click('#romantic-close');
 for(const [x,y]of [[169,235],[368,317],[44,646]]){await at(x,y);await p.click('#interact')}assert.equal(await p.evaluate(()=>__manor.data.magic.length),3);
 await at(57,564);await p.click('#interact');await p.click('#interact');assert.equal(await p.evaluate(()=>__manor.data.plots[0].state),2);await p.evaluate(()=>__manor.scene.dataSave.plots[0].wateredAt-=19000);await p.waitForTimeout(1100);assert.equal(await p.evaluate(()=>__manor.data.plots[0].state),3);
 await at(78,465);const before=await p.evaluate(()=>__manor.data.candies);await p.click('#interact');await p.evaluate(()=>__manor.scene.sweets[0].at=Date.now()-1);await p.waitForTimeout(180);await p.click('#interact');assert.equal(await p.evaluate(()=>__manor.data.candies),before+2);
 await at(216,700);await p.keyboard.down('ArrowUp');await p.waitForTimeout(650);await p.keyboard.up('ArrowUp');assert.ok(await p.evaluate(()=>__manor.scene.player.y)<670);
 await at(235,250);await p.click('#interact');await p.click('#tree-dawn');await p.waitForSelector('#skip-sky');await p.click('#skip-sky');await p.waitForFunction(()=>!window.__manor.scene.observing);
 await p.click('#journal');await p.click('#replay-letter');await p.click('#accept');await p.reload();await p.waitForSelector('#skip-return');await p.click('#skip-return');const d=await p.evaluate(()=>__manor.data);assert.equal(d.completed,true);assert.equal(d.favorite,'lavender');assert.equal(d.catName,'奶盖');assert.equal(d.plots[0].state,3);assert.deepEqual(errors,[]);
 console.log('PASS: personal opening, direct shop/cat access without NPC gates, original candies and garden, movement, layered dawn, letter replay and old save fields');
}finally{await browser.close()}
