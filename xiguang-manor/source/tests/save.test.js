import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,sanitize,load,persist,quest,grow} from '../src/save.js';
test('完成进度、个性化选择、花田与坐标在刷新后保留',()=>{const store=new Map();const storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};let d=fresh();Object.assign(d,{accepted:true,completed:true,stage:5,favorite:'strawberry',catName:'奶盖',catMet:true,magic:[0,1,2],candies:12,position:{x:88,y:588}});d.plots[0]={state:2,wateredAt:100};assert.equal(persist(d,storage),true);assert.deepEqual(load(storage),d)});
test('损坏与旧版本存档可恢复；无效字段不会破坏任务',()=>{assert.deepEqual(load({getItem:()=>'{bad'}),fresh());assert.deepEqual(sanitize({version:4}),fresh());let d=sanitize({version:1,stage:999,magic:[0,0,7,2],favorite:'unknown',position:{x:-400,y:9999},plots:[null]});assert.equal(d.stage,4);assert.deepEqual(d.magic,[0,2]);assert.equal(d.favorite,null);assert.deepEqual(d.position,{x:24,y:790})});
test('收集三颗不同魔法糖才出现献糖任务',()=>{let d=fresh();d.stage=3;d.magic=[0,1];assert.equal(quest(d),3);d.magic.push(2);assert.equal(quest(d),4);d.completed=true;assert.equal(quest(d),5)});
test('花田离线后继续生长，未浇水不生长',()=>{assert.equal(grow({state:1,wateredAt:0},90000).state,1);assert.equal(grow({state:2,wateredAt:1000},18999).state,2);assert.equal(grow({state:2,wateredAt:1000},19000).state,3)});
test('浏览器禁用本地存储时不崩溃',()=>{const s={getItem(){throw Error()},setItem(){throw Error()}};assert.deepEqual(load(s),fresh());assert.equal(persist(fresh(),s),false)});
