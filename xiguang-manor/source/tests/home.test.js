import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,sanitize} from '../src/save.js';
import {HOME} from '../src/home-config.js';
import {roomDefaults,sanitizeRoom,findRoomSpot,canPlace,putFurniture,cabinBlocked,furnitureStandPoints,layoutResult,RoomDraft,safeRoomPoint} from '../src/home-model.js';
import {SessionProgress} from '../src/session-model.js';
test('Legacy room coordinates and ownership survive migration; former fixtures become independent native items exactly once',()=>{
 const old={version:1,accepted:true,candies:31,catName:'奶盖',favorite:'lavender',play:{version:1,furnitureOwned:['berryLamp']},romance:{theme:'cream',flowers:['lily'],room:{bouquet:'lily',items:[{type:'chair',x:72,y:704,flip:true},{type:'berryLamp',x:280,y:752,on:true}]}}},d=sanitize(old),r=d.romance.room;
 assert.equal(d.candies,31);assert.equal(d.catName,'奶盖');assert.ok(d.play.furnitureOwned.includes('berryLamp'));assert.equal(r.items.find(i=>i.type==='chair').x,72);assert.equal(r.items.find(i=>i.type==='chair').flip,true);assert.equal(r.items.filter(i=>i.type==='bed').length,1);assert.deepEqual(r,sanitizeRoom(r));assert.equal(new Set(r.items.map(i=>i.id)).size,r.items.length);
});
test('Three chairs have independent IDs, coordinates and switches; a fractional move does not snap or replace its siblings',()=>{
 const r=roomDefaults();for(let n=0;n<2;n++)assert.ok(putFurniture(r,findRoomSpot('chair',r.items)));const chairs=r.items.filter(i=>i.type==='chair');assert.equal(chairs.length,3);const chosen=chairs[2],before=chairs.map(i=>({...i}));assert.ok(putFurniture(r,{...chosen,x:chosen.x+.3,flip:true,on:true}));assert.equal(r.items.length,15);assert.equal(r.items.find(i=>i.id===chosen.id).x,chosen.x+.3);assert.deepEqual(r.items.find(i=>i.id===chairs[0].id),before[0]);assert.deepEqual(sanitizeRoom(r),r);
});
test('Central floor is available; true overlaps and blocked exits are rejected; rugs can layer underneath furniture',()=>{
 const center={id:'center',type:'chair',x:216.4,y:500.7};assert.ok(canPlace([],center));assert.equal(canPlace([center],{type:'chair',x:center.x,y:center.y}),false);assert.equal(canPlace([],{type:'sofa',x:216,y:798}),false);
 const r=roomDefaults();assert.ok(layoutResult(r).ok);const rug={type:'rug',x:178,y:613};assert.ok(putFurniture(r,rug));assert.ok(putFurniture(r,rug));assert.equal(r.items.filter(i=>i.type==='rug').length,3);assert.equal(cabinBlocked(216,600,[{...rug,id:'one'}]),false);
});
test('Large furniture, paths, wall decor and safe entry relocation use the actual room geometry',()=>{
 const r=roomDefaults(),bed=r.items.find(i=>i.type==='bed');assert.ok(putFurniture(r,{...bed,x:310,y:540}));const books=r.items.find(i=>i.type==='bookcase');assert.ok(putFurniture(r,{...books,x:345,y:708}));assert.ok(layoutResult(r).ok);assert.ok(canPlace(r.items,{type:'floralWall',x:68,y:210}));assert.equal(canPlace(r.items,{type:'floralWall',x:200,y:600}),false);
 const point=safeRoomPoint(r.items,{x:310,y:500});assert.equal(cabinBlocked(point.x,point.y,r.items),false);assert.ok(furnitureStandPoints(bed).length>=4);
});
test('An empty V2 room stays empty, malformed imports are bounded, and duplicate IDs are repaired without deleting owned types',()=>{
 assert.deepEqual(sanitizeRoom({version:2,items:[]}).items,[]);const r=sanitizeRoom({version:2,items:[null,{type:'invalid',x:120,y:500},{id:'a',type:'chair',x:72,y:704},{id:'a',type:'chair',x:130,y:704},{type:'lamp',x:Infinity,y:500}]});assert.equal(r.items.length,2);assert.equal(new Set(r.items.map(i=>i.id)).size,2);assert.equal(r.wallpaper,'original');
});
test('Whole-room draft cancel never mutates the saved room; undo, redo and named plans preserve every instance',()=>{
 const saved=roomDefaults(),baseline=JSON.stringify(saved),draft=new RoomDraft(saved);draft.change(r=>{r.items[0].x=100;r.items.push({id:'test',type:'rug',x:216,y:600})});assert.equal(JSON.stringify(saved),baseline);assert.equal(draft.room.items[0].x,100);draft.undo();assert.deepEqual(draft.room,saved);draft.redo();assert.equal(draft.room.items.length,saved.items.length+1);draft.change(r=>r.layouts.push({id:'one',name:'午后',items:structuredClone(r.items),wallpaper:r.wallpaper,floor:r.floor}));assert.equal(sanitizeRoom(draft.room).layouts[0].items.length,draft.room.items.length);
});
test('Discarding a whole visit still rolls back rooms, schemes, surfaces and flower collections',()=>{
 const d=fresh(),storage={value:'',setItem(k,v){this.value=v}},session=new SessionProgress(d,storage),baseline=JSON.stringify(d.romance.room);d.romance.room.items=[];d.romance.room.bouquet='aster';d.romance.room.wallpaper='gingham';session.save(d);session.exit(d,false);assert.equal(JSON.stringify(JSON.parse(storage.value).romance.room),baseline);
});

test('Legacy paid curtains retain their original floor mounting and do not invalidate an existing purchased layout',()=>{const room=sanitizeRoom({items:[{type:'laceDrape',x:352,y:744,on:true}],bouquet:'rose'});assert.ok(room.items.some(i=>i.type==='laceDrape'));assert.ok(layoutResult(room).ok);});
