import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,sanitize} from '../src/save.js';
import {romanticDefaults,flowerStage,harvestFlower} from '../src/romantic-model.js';
import {SessionProgress} from '../src/session-model.js';
test('V4 migrates old saves without changing currency, outfits, orders or collections',()=>{
 const old={version:1,accepted:true,stage:5,completed:true,candies:51,catName:'奶盖',favorite:'lavender',wardrobe:{owned:['original','cocoa'],equipped:'cocoa'},shop:{orders:7,baked:21},scenery:{stars:['xi'],meteorSeen:true,starCandy:true}};
 const d=sanitize(old);assert.equal(d.candies,51);assert.equal(d.catName,'奶盖');assert.equal(d.shop.orders,7);assert.equal(d.shop.baked,21);assert.equal(d.wardrobe.equipped,'cocoa');assert.deepEqual(d.scenery.stars,['xi']);assert.deepEqual(d.romance,romanticDefaults());
});
test('Flower growth requires watering and survives offline time; harvesting is once only',()=>{
 const w=romanticDefaults(),now=Date.now();w.beds[0]={flower:'rose',wateredAt:0};assert.equal(flowerStage(w.beds[0],now+100000),1);w.beds[0].wateredAt=now;assert.equal(flowerStage(w.beds[0],now+19000),2);assert.equal(flowerStage(w.beds[0],now+21000),3);assert.equal(harvestFlower(w,0,now+59000),false);assert.equal(harvestFlower(w,0,now+61000),true);assert.equal(harvestFlower(w,0,now+62000),false);assert.deepEqual(w.flowers,['rose']);
});
test('Room, companion, star and private wishes persist; invalid ids are discarded',()=>{
 const d=fresh();d.romance={...romanticDefaults(),personalStar:true,starPlace:'sky',theme:'lavender',weather:'rain',catFollow:true,starWishes:{xi:'愿每天都有光',bad:'discard'},secrets:['hollow','hollow','bad'],flowers:['lily','bad'],beds:[{flower:'glow',wateredAt:Date.now()-65000}]};
 const copy=sanitize(JSON.parse(JSON.stringify(d)));assert.equal(copy.romance.personalStar,true);assert.equal(copy.romance.starPlace,'sky');assert.equal(copy.romance.theme,'lavender');assert.equal(copy.romance.catFollow,true);assert.equal(copy.romance.starWishes.xi,'愿每天都有光');assert.equal(copy.romance.starWishes.bad,undefined);assert.deepEqual(copy.romance.secrets,['hollow']);assert.deepEqual(copy.romance.flowers,['lily']);assert.equal(flowerStage(copy.romance.beds[0]),4);
});
test('Discard exit rolls back all romantic changes even after autosaving',()=>{
 const d=fresh();const storage={value:'',setItem(k,v){this.value=v},getItem(){return this.value}};const progress=new SessionProgress(d,storage);d.romance.personalStar=true;d.romance.catFollow=true;d.romance.starWishes.xi='local';d.romance.beds[0].flower='rose';progress.save(d);progress.exit(d,false);const restored=JSON.parse(storage.value);assert.equal(restored.romance.personalStar,false);assert.deepEqual(restored.romance.starWishes,{});assert.equal(restored.romance.beds[0].flower,null);
});
