import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,sanitize} from '../src/save.js';
import {HOME} from '../src/home-config.js';
import {roomDefaults,sanitizeRoom,findRoomSpot,canPlace,putFurniture,cabinBlocked,furnitureStandPoints} from '../src/home-model.js';
import {retreatRoute} from '../src/retreat-navigation.js';
import {SessionProgress} from '../src/session-model.js';
test('Old saves receive a complete starter room; existing currency and favorites survive',()=>{
 const d=sanitize({version:1,accepted:true,candies:31,catName:'奶盖',favorite:'lavender',romance:{theme:'cream',flowers:['lily']}});
 assert.equal(d.candies,31);assert.equal(d.catName,'奶盖');assert.equal(d.romance.theme,'cream');assert.deepEqual(d.romance.flowers,['lily']);assert.equal(d.romance.room.items.length,6);assert.deepEqual(d.romance.room,sanitizeRoom(d.romance.room));
});
test('Furniture edits replace one piece and preserve facing, switches and flower bouquets on reload',()=>{
 const d=fresh(),room=d.romance.room,item=findRoomSpot('piano',room.items);assert.ok(item);assert.ok(putFurniture(room,{...item,flip:true}));const n=room.items.length;assert.ok(putFurniture(room,{type:'piano',x:152,y:456,flip:false,on:true}));assert.equal(room.items.length,n);
 room.wallpaper='floral';room.floor='herringbone';room.bouquet='lily';const copy=sanitize(JSON.parse(JSON.stringify(d))).romance.room;assert.deepEqual(copy,room);assert.equal(copy.items.filter(i=>i.type==='piano').length,1);
});
test('Door aisle, existing furniture access and occupied spots cannot be covered',()=>{
 const room=roomDefaults();for(const item of room.items)assert.ok(canPlace(room.items,item));
 for(const [x,y]of [[216,500],[216,768],[336,456],[302,696],[-100,200],[144,544]])assert.equal(canPlace(room.items,{type:'piano',x,y}),false);
 assert.equal(putFurniture(room,{type:'piano',x:216,y:768}),false);assert.equal(room.items.length,6);
});
test('A fully furnished room still routes from the front door to the window, bed, sofa and shelves',()=>{
 const room=roomDefaults();for(const f of HOME.items){if(room.items.some(i=>i.type===f.type))continue;const item=findRoomSpot(f.type,room.items);if(item)putFurniture(room,item)}
 assert.equal(room.items.length,HOME.maxItems);
 for(const target of HOME.access)assert.ok(retreatRoute({x:216,y:785},target,(x,y)=>cabinBlocked(x,y,room.items)).length>0,JSON.stringify(target));
 for(const item of room.items)assert.ok(furnitureStandPoints(item).some(point=>retreatRoute({x:216,y:785},point,(x,y)=>cabinBlocked(x,y,room.items)).length>0),item.type+' remains reachable');
 for(let y=300;y<805;y+=8)assert.equal(cabinBlocked(216,y,room.items),false);
});
test('Malformed layouts are sanitized, duplicate pieces are discarded, and an intentionally empty room stays empty',()=>{
 const valid=findRoomSpot('piano',[]),r=sanitizeRoom({wallpaper:'bad',floor:'bad',bouquet:'bad',items:[null,{type:'invalid',x:120,y:500},valid,valid,{type:'chair',x:Infinity,y:500},{type:'lamp',x:216,y:780}]});
 assert.equal(r.items.length,1);assert.equal(r.items[0].type,'piano');assert.equal(r.bouquet,'rose');assert.equal(r.wallpaper,'original');assert.deepEqual(sanitizeRoom({items:[]}).items,[]);
});
test('Discarding the visit rolls back furniture, surfaces and the flower brought home',()=>{
 const d=fresh(),storage={value:'',setItem(k,v){this.value=v}},session=new SessionProgress(d,storage);const baseline=JSON.stringify(d.romance.room);d.romance.room.items=[];d.romance.room.bouquet='aster';d.romance.room.wallpaper='gingham';session.save(d);session.exit(d,false);assert.equal(JSON.stringify(JSON.parse(storage.value).romance.room),baseline);
});
