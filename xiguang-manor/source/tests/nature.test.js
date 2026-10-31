import test from 'node:test';import assert from 'node:assert/strict';
import {starTwinkle,NATURE} from '../src/nature-config.js';
import {WindMeadow} from '../src/wind-grass.js';
import {FlowerPickupEffects,flowerKind} from '../src/flower-effects.js';
test('Stars visibly brighten and dim at independent phases without flashing the entire field',()=>{
 for(const phase of [0,1.7,4.2]){const samples=Array.from({length:240},(_,i)=>starTwinkle(i*.05,phase,.5));assert.ok(Math.min(...samples)<.08);assert.ok(Math.max(...samples)>.85);assert.ok(samples.every(v=>v>=0&&v<=1))}assert.ok(Array.from({length:50},(_,i)=>Math.abs(starTwinkle(i*.1,0)-starTwinkle(i*.1,2.3))).some(v=>v>.5));
});
test('Grass clippings spawn from grass, stay bounded, and freeze with reduced motion',()=>{
 for(const reduced of [false,true]){const meadow=new WindMeadow(432,850,{mask:(x,y)=>x>100&&x<300&&y>400,minY:350,maxY:800});assert.ok(meadow.tufts.length>0);assert.ok(meadow.tufts.every(p=>p.x>100&&p.x<300&&p.y>400));let seen=false;for(let i=0;i<1600;i++){meadow.update(.05,{reduced});const count=meadow.pool.filter(p=>p.active).length;seen||=count>0;assert.ok(count<=(reduced?NATURE.grass.lowPool:NATURE.grass.pool))}assert.ok(seen);const t=meadow.time;meadow.update(.1,{still:true});assert.equal(meadow.time,t)}const empty=new WindMeadow(432,850,{mask:()=>false});empty.update(.1);assert.equal(empty.tufts.length,0);assert.ok(empty.pool.every(p=>!p.active));
});
test('All four picked flowers have distinct effects, repeat variation, finite life and bounded reuse',()=>{
 const fx=new FlowerPickupEffects();for(const kind of ['rose','lily','aster','glow']){const a=fx.emit(kind,80,400),seed=a.seed;assert.equal(a.kind,kind);const b=fx.emit(kind,80,400);assert.notEqual(seed,b.seed)}assert.equal(new Set(Object.values(NATURE.flowers).map(f=>f.name)).size,4);for(let i=0;i<80;i++)fx.emit(['rose','lily','aster','glow'][i%4],80,400);assert.equal(fx.pool.length,6);for(let i=0;i<40;i++)fx.update(.1,{reduced:true});assert.ok(fx.pool.every(p=>!p.active));assert.equal(fx.emit('invalid',10,10),null);assert.equal(flowerKind({color:'#e7a5bd'}),'rose');assert.equal(flowerKind({color:'#eee1d1'}),'lily');
});
