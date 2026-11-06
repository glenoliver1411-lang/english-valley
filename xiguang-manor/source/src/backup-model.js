import {sanitize} from './save.js';
export const BACKUP_FORMAT='xiguang-manor-backup';
export function exportBackup(data,now=new Date()){return JSON.stringify({format:BACKUP_FORMAT,backupVersion:1,exportedAt:now.toISOString(),data},null,2)}
export function inspectBackup(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>1024*1024)throw Error('size');
 let root;try{root=JSON.parse(text)}catch{throw Error('json')}
 if(!root||typeof root!=='object'||Array.isArray(root))throw Error('format');
 if(root.format!==undefined&&(root.format!==BACKUP_FORMAT||root.backupVersion!==1))throw Error('version');
 const raw=root.format?root.data:root;
 if(!raw||raw.version!==1)throw Error('version');
 if(typeof raw.accepted!=='boolean'||!Number.isSafeInteger(raw.candies)||raw.candies<0||!Array.isArray(raw.magic)||!Array.isArray(raw.plots)||!Number.isFinite(raw.position?.x)||!Number.isFinite(raw.position?.y))throw Error('format');
 for(const k of ['romance','wardrobe','adventure','scenery','shop'])if(raw[k]!==undefined&&(!raw[k]||typeof raw[k]!=='object'||Array.isArray(raw[k])))throw Error('format');
 const data=sanitize(raw);return{data,exportedAt:typeof root.exportedAt==='string'?root.exportedAt:null,summary:{candies:data.candies,catName:data.catName,outfits:data.wardrobe.owned.length,treasures:Object.values(data.adventure.inventory).reduce((a,b)=>a+b,0),furniture:data.romance.room.items.length,flowers:data.romance.flowers.length,completed:data.completed,music:data.music,weather:data.romance.weather}};
}
