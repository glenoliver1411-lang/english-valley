import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,persist,saveProtection,SAVE_KEY,backupCurrent,replaceSave} from '../src/save.js';
import {exportBackup,inspectBackup} from '../src/backup-model.js';
const store=raw=>{const map=new Map(raw===undefined?[]:[[SAVE_KEY,raw]]);return{map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))}};
test('corrupt/foreign/unsupported records are never overwritten by autosave or exit',()=>{
 for(const raw of ['{broken','null','[]','{}','{"version":2,"candies":33}','{"version":1}']){const s=store(raw),d=load(s);assert.equal(saveProtection(s).blocked,true);assert.equal(persist(d,s),false);assert.equal(s.getItem(SAVE_KEY),raw)}
});
test('failed read remains protected until a successful read or confirmed replacement',()=>{
 const s=store(JSON.stringify({...fresh(),candies:42})),get=s.getItem;s.getItem=()=>{throw Error('denied')};load(s);s.getItem=get;assert.equal(persist(fresh(),s),false);assert.equal(load(s).candies,42);assert.equal(persist({...fresh(),candies:43},s),true);
});
test('failed write preserves previous record and does not reset current progress',()=>{
 const s=store(JSON.stringify({...fresh(),candies:21}));const d=load(s);d.candies=22;const set=s.setItem;s.setItem=()=>{throw Error('quota')};assert.equal(persist(d,s),false);assert.equal(JSON.parse(s.getItem(SAVE_KEY)).candies,21);assert.equal(d.candies,22);s.setItem=set;assert.equal(persist(d,s),true);
});
test('backup envelope validates versions and previews without changing storage',()=>{
 const d=fresh();d.accepted=true;d.catName='奶盖';d.candies=37;d.completed=true;d.stage=5;d.music=true;d.wardrobe.owned.push('cocoa');d.wardrobe.equipped='cocoa';d.romance.weather='rain';d.romance.flowers=['rose'];const text=exportBackup(d,new Date('2026-11-06T10:00:00Z')),preview=inspectBackup(text);assert.deepEqual(preview.data,d);assert.equal(preview.summary.outfits,2);assert.equal(preview.summary.catName,'奶盖');assert.deepEqual(inspectBackup(JSON.stringify(d)).data,d);
 for(const invalid of ['nope','null','[]',JSON.stringify({format:'xiguang-manor-backup',backupVersion:2,data:d}),JSON.stringify({...d,version:9}),JSON.stringify({...d,candies:-2}),JSON.stringify({...d,position:{x:Infinity}}),' '.repeat(1048577)])assert.throws(()=>inspectBackup(invalid));
});
test('confirmed import preserves original raw data, including an unreadable record',()=>{
 const s=store('{original-broken');load(s);const d={...fresh(),candies:19};assert.equal(replaceSave(d,s),true);assert.equal(saveProtection(s).blocked,false);assert.deepEqual(JSON.parse(s.getItem(SAVE_KEY)),d);assert.equal(JSON.parse(s.getItem(SAVE_KEY+':before-import')).raw,'{original-broken');
});
test('no import replacement when backup creation fails',()=>{
 const s=store('old');s.setItem=(k)=>{if(k.endsWith('before-import'))throw Error('quota');throw Error('must not write')};assert.equal(replaceSave(fresh(),s),false);assert.equal(s.getItem(SAVE_KEY),'old');
});
test('manual update backup is separate from the existing v1 schema',()=>{
 const s=store(JSON.stringify({...fresh(),candies:9}));assert.equal(backupCurrent('before-update',s),true);assert.equal(JSON.parse(s.getItem(SAVE_KEY)).candies,9);assert.equal(JSON.parse(s.getItem(SAVE_KEY+':before-update')).raw,s.getItem(SAVE_KEY));
});
