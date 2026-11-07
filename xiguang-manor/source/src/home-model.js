import {FLOWERS} from './flower-catalog.js';
import {HOME} from './home-config.js';
export const furniture=type=>HOME.items.find(item=>item.type===type);
export const roomDefaults=()=>({wallpaper:'original',floor:'original',bouquet:'rose',items:HOME.defaults.map(item=>({flip:false,on:false,...item}))});
export function furnitureBox(item){const f=furniture(item.type);return{x:item.x-f.footW/2,y:item.y-f.footH,w:f.footW,h:f.footH}}
export function furnitureStandPoints(item){const b=furnitureBox(item);return[{x:item.x,y:item.y+8},{x:b.x-9,y:item.y},{x:b.x+b.w+9,y:item.y},{x:item.x,y:b.y-9}]}
const overlap=(a,b,pad=0)=>a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad;
export function cabinBlocked(x,y,items=[]){return x<40||x>398||y<290||y>811||HOME.fixed.some(r=>x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h)||items.some(item=>{const r=furnitureBox(item);return x>r.x-3&&x<r.x+r.w+3&&y>r.y-3&&y<r.y+r.h+3})}
export function canPlace(items,item){
 if(!furniture(item.type)||!Number.isFinite(item.x)||!Number.isFinite(item.y))return false;
 const r=furnitureBox(item);if(r.x<46||r.x+r.w>392||r.y<345||r.y+r.h>774)return false;
 // A permanent central aisle keeps the door, window and bedroom reachable.
 if(overlap(r,{x:191,y:290,w:48,h:525},8))return false;
 if(HOME.fixed.some(f=>overlap(r,f,10)))return false;
 if(HOME.access.some(p=>overlap(r,{x:p.x-6,y:p.y-6,w:12,h:12},3)))return false;
 return !items.some(other=>other.type!==item.type&&overlap(r,furnitureBox(other),10));
}
export function findRoomSpot(type,items){
 const def=HOME.defaults.find(item=>item.type===type);if(def&&canPlace(items,def))return{...def,flip:false,on:false};
 for(const y of [704,552,384,464,736,616,344])for(const x of [144,280,360,72]){const item={type,x,y,flip:false,on:false};if(canPlace(items,item))return item}return null;
}
export function putFurniture(room,item){if(!furniture(item.type)||!canPlace(room.items,item))return false;const index=room.items.findIndex(i=>i.type===item.type);if(index<0&&room.items.length>=HOME.maxItems)return false;const copy={type:item.type,x:Math.round(item.x/HOME.grid)*HOME.grid,y:Math.round(item.y/HOME.grid)*HOME.grid,flip:!!item.flip,on:!!item.on};if(!canPlace(room.items,copy))return false;if(index<0)room.items.push(copy);else room.items[index]=copy;return true}
export function sanitizeRoom(raw){
 const d=roomDefaults();if(!raw||typeof raw!=='object')return d;
 if(HOME.walls.some(v=>v.id===raw.wallpaper))d.wallpaper=raw.wallpaper;if(HOME.floors.some(v=>v.id===raw.floor))d.floor=raw.floor;
 if(FLOWERS.some(f=>f.id===raw.bouquet))d.bouquet=raw.bouquet;
 if(Array.isArray(raw.items)){d.items=[];for(const item of raw.items.slice(0,50)){if(!item||!furniture(item.type)||d.items.some(i=>i.type===item.type))continue;putFurniture(d,item);if(d.items.length===HOME.maxItems)break}}
 return d;
}
