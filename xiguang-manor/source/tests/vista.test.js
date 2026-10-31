import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,sanitize} from '../src/save.js';
import {commitWish} from '../src/wish-model.js';
import {WishFlight,roofArrival} from '../src/vista-effects.js';
import {VISTA} from '../src/vista-config.js';
test('A private star wish and the general wish save independently and survive reload',()=>{
 const d=fresh();d.candies=29;d.catName='奶盖';d.romance.starWishes.petal='晚风';let saved;
 const save=()=>{saved=JSON.stringify(d);return true};assert.ok(commitWish(d,' 我爱你 ','xi',save).ok);assert.ok(commitWish(d,'愿每天都有花。',null,save).ok);
 const copy=sanitize(JSON.parse(saved));assert.equal(copy.romance.starWishes.xi,'我爱你');assert.equal(copy.scenery.wish,'愿每天都有花。');assert.equal(copy.romance.starWishes.petal,'晚风');assert.equal(copy.candies,29);assert.equal(copy.catName,'奶盖');
});
test('Failed or empty wishes never overwrite an existing wish or report a successful save',()=>{
 const d=fresh();d.romance.starWishes.xi='原来的愿望';assert.equal(commitWish(d,'新愿望','xi',()=>false).reason,'storage');assert.equal(d.romance.starWishes.xi,'原来的愿望');assert.equal(commitWish(d,'新愿望','petal',()=>{throw Error('quota')}).ok,false);assert.equal(Object.hasOwn(d.romance.starWishes,'petal'),false);let called=false;assert.equal(commitWish(d,'  ','xi',()=>{called=true}).reason,'empty');assert.equal(called,false);assert.equal(commitWish(d,'x','bad',()=>true).ok,false);
});
test('Roof ascent advances through real walk frames, arrives smoothly and can restart',()=>{
 const poses=Array.from({length:157},(_,i)=>roofArrival(i/60)),frames=new Set(poses.filter(p=>p.walking).map(p=>p.frame));assert.equal(frames.size,4);assert.equal(poses[0].topOffset,62);for(let i=1;i<poses.length;i++)assert.ok(poses[i].topOffset<=poses[i-1].topOffset);assert.equal(roofArrival(VISTA.roofSeconds).topOffset,0);assert.equal(roofArrival(VISTA.roofSeconds+10).walking,false);assert.equal(roofArrival(0).progress,0);
});
test('Wish envelope and star response stay bounded, fade out and replay without leftover effects',()=>{
 for(const reduced of [false,true]){const effect=new WishFlight();effect.start({x:112,y:124});let max=0;for(let f=0;f<5*60;f++){effect.update(1/60);let count=0;const c={globalAlpha:1,fillRect(x,y,w,h){count++;assert.ok([x,y,w,h].every(Number.isFinite));assert.ok(w<=6&&h<=6)}};effect.draw(c,216,400,{reduced});max=Math.max(max,count);assert.equal(c.globalAlpha,1)}assert.equal(effect.active,false);assert.ok(max<=(reduced?26:40));effect.start({x:50,y:72});assert.equal(effect.age,0);assert.equal(effect.active,true);assert.equal(effect.target.x,50)}
});
