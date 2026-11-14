import {FLOWERS} from './flower-catalog.js';
import {HOME} from './home-config.js';
export const furniture=type=>HOME.items.find(item=>item.type===type);
export const cloneRoom=room=>JSON.parse(JSON.stringify(room));
export const roomDefaults=()=>({version:2,nextId:1,wallpaper:'original',floor:'original',bouquet:'rose',layouts:[],items:[...HOME.largeDefaults,...HOME.defaults].map((item,i)=>({id:'starter-'+i,flip:false,on:false,...item}))});
export function furnitureBox(item){const f=furniture(item.type);return{x:item.x-f.footW/2,y:item.y-f.footH,w:f.footW,h:f.footH}}
export function furnitureStandPoints(item){const b=furnitureBox(item),gap=10;return[{x:item.x,y:item.y+gap},{x:b.x-gap,y:item.y-3},{x:b.x+b.w+gap,y:item.y-3},{x:item.x,y:b.y-gap}]}
const overlap=(a,b,pad=0)=>a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad;
export const solid=item=>!['rug','wall'].includes(furniture(item.type)?.layer);
export function cabinBlocked(x,y,items=[]){return x<30||x>402||y<338||y>811||items.some(item=>{if(!solid(item))return false;const r=furnitureBox(item);return x>r.x-5&&x<r.x+r.w+5&&y>r.y-5&&y<r.y+r.h+5})}
// Navigation samples do not snap furniture coordinates. Flood only the door-connected floor.
export function roomReachability(items){
 const step=8,minX=30,minY=338,cols=47,rows=60,seen=new Uint8Array(cols*rows),queue=new Int32Array(cols*rows),point=id=>({x:minX+id%cols*step,y:minY+Math.floor(id/cols)*step});
 const clear=(a,b)=>{const n=Math.ceil(Math.hypot(a.x-b.x,a.y-b.y)/3);for(let i=0;i<=n;i++)if(cabinBlocked(a.x+(b.x-a.x)*i/Math.max(1,n),a.y+(b.y-a.y)*i/Math.max(1,n),items))return false;return true};
 const nearby=p=>{const cx=Math.round((p.x-minX)/step),cy=Math.round((p.y-minY)/step),out=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=cx+dx,y=cy+dy;if(x>=0&&x<cols&&y>=0&&y<rows){const id=y*cols+x;if(clear(p,point(id)))out.push(id)}}return out};
 let head=0,tail=0;for(const id of nearby(HOME.door)){if(!seen[id]){seen[id]=1;queue[tail++]=id}}
 while(head<tail){const id=queue[head++],x=id%cols,y=Math.floor(id/cols),a=point(id);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,next=ny*cols+nx;if(nx<0||nx>=cols||ny<0||ny>=rows||seen[next]||!clear(a,point(next)))continue;seen[next]=1;queue[tail++]=next}}
 return{has:p=>!cabinBlocked(p.x,p.y,items)&&nearby(p).some(id=>seen[id]),points:()=>Array.from(queue.slice(0,tail),point)};
}
export function placementResult(items,item,{paths=true}={}){
 const f=furniture(item?.type);if(!f||!Number.isFinite(item.x)||!Number.isFinite(item.y))return{ok:false,reason:'未知家具或坐标无效'};
 const b=furnitureBox(item);
 if(f.layer==='wall'){
  const box={x:item.x-f.w/2,y:item.y-f.h,w:f.w,h:f.h};if(!HOME.wallZones.some(z=>box.x>=z.x&&box.x+box.w<=z.x+z.w&&box.y>=z.y&&box.y+box.h<=z.y+z.h))return{ok:false,reason:'墙饰请放在窗户两旁的墙面'};
  if(items.some(other=>other.id!==item.id&&furniture(other.type).layer==='wall'&&overlap(box,{x:other.x-furniture(other.type).w/2,y:other.y-furniture(other.type).h,w:furniture(other.type).w,h:furniture(other.type).h},1)))return{ok:false,reason:'两件墙饰重叠了'};return{ok:true};
 }
 if(b.x<29||b.x+b.w>403||b.y<295||item.y<330||item.y>780||item.x-f.w/2<20||item.x+f.w/2>412)return{ok:false,reason:'请放在房间地面范围内'};
 const rest=items.filter(other=>!item.id||other.id!==item.id);
 if(solid(item)&&rest.some(other=>solid(other)&&overlap(b,furnitureBox(other),2)))return{ok:false,reason:'家具底座重叠了，挪开一点试试'};
 if(!paths||!solid(item))return{ok:true};
 const candidate=[...rest,item],route=roomReachability(candidate);
 if(!route.has(HOME.door)||!HOME.access.every(p=>route.has(p)))return{ok:false,reason:'请给房门和窗边留一条能走过的路'};
 for(const other of candidate)if(solid(other)&&furniture(other.type).action&&!furnitureStandPoints(other).some(p=>route.has(p)))return{ok:false,reason:'这里会挡住一件家具的互动位置'};
 return{ok:true};
}
export const canPlace=(items,item)=>placementResult(items,item).ok;
export function layoutResult(room){
 for(const item of room.items){const result=placementResult(room.items,item,{paths:false});if(!result.ok)return result}
 const route=roomReachability(room.items);if(!HOME.access.every(p=>route.has(p)))return{ok:false,reason:'房门到窗边需要保持通行'};
 for(const item of room.items)if(solid(item)&&furniture(item.type).action&&!furnitureStandPoints(item).some(p=>route.has(p)))return{ok:false,reason:furniture(item.type).name+'旁边需要留出互动位置'};
 return{ok:true};
}
export function nextFurnitureId(room){let id;do{id='f-'+room.nextId++;}while(room.items.some(i=>i.id===id));return id}
export function findRoomSpot(type,items){
 const f=furniture(type);if(!f)return null;
 const spots=f.layer==='wall'?[{x:65,y:160},{x:364,y:160}]:[...HOME.defaults.filter(i=>i.type===type),...HOME.largeDefaults.filter(i=>i.type===type)];
 for(const at of spots){const item={type,...at,flip:false,on:false};if(canPlace(items,item))return item}
 for(let y=f.layer==='wall'?100:756;y>=(f.layer==='wall'?80:340);y-=16)for(let x=56;x<=376;x+=16){const item={type,x,y,flip:false,on:false};if(canPlace(items,item))return item}return null;
}
export function putFurniture(room,item){if(!canPlace(room.items,item))return false;const index=item.id?room.items.findIndex(i=>i.id===item.id):-1,copy={id:index>=0?item.id:nextFurnitureId(room),type:item.type,x:Math.round(item.x*10)/10,y:Math.round(item.y*10)/10,flip:!!item.flip,on:!!item.on};if(index<0)room.items.push(copy);else room.items[index]=copy;return true}
const cleanItems=(raw,prefix)=>{const ids=new Set();return raw.slice(0,1000).flatMap((v,i)=>{if(!v||!furniture(v.type)||!Number.isFinite(v.x)||!Number.isFinite(v.y))return[];const f=furniture(v.type);if(v.x<20||v.x>412||v.y<(f.layer==='wall'?45:312)||v.y>811)return[];let id=typeof v.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v.id)?v.id:prefix+i;while(ids.has(id))id=prefix+i+'-'+ids.size;ids.add(id);return[{id,type:v.type,x:v.x,y:v.y,flip:!!v.flip,on:!!v.on}]})};
export function sanitizeRoom(raw){
 const d=roomDefaults();if(!raw||typeof raw!=='object')return d;
 if(HOME.walls.some(v=>v.id===raw.wallpaper))d.wallpaper=raw.wallpaper;if(HOME.floors.some(v=>v.id===raw.floor))d.floor=raw.floor;if(FLOWERS.some(f=>f.id===raw.bouquet))d.bouquet=raw.bouquet;
 if(Array.isArray(raw.items)){d.items=cleanItems(raw.items,'legacy-');if(raw.version!==2)d.items.unshift(...HOME.largeDefaults.map((v,i)=>({id:'built-in-'+i,flip:false,on:false,...v})))}
 d.nextId=Math.max(1,Number.isSafeInteger(raw.nextId)?raw.nextId:1);
 if(raw.version===2&&Array.isArray(raw.layouts))d.layouts=raw.layouts.slice(0,12).filter(v=>v&&typeof v.name==='string'&&Array.isArray(v.items)).map((v,i)=>({id:'layout-'+i,name:v.name.slice(0,32),wallpaper:HOME.walls.some(w=>w.id===v.wallpaper)?v.wallpaper:'original',floor:HOME.floors.some(w=>w.id===v.floor)?v.floor:'original',items:cleanItems(v.items,'plan-'+i+'-')}));
 return d;
}
export function safeRoomPoint(items,near=HOME.door){const route=roomReachability(items);if(route.has(near))return{x:near.x,y:near.y};return route.points().sort((a,b)=>Math.hypot(a.x-near.x,a.y-near.y)-Math.hypot(b.x-near.x,b.y-near.y))[0]||{...HOME.door}}
// Whole-room draft. Only Save commits to the game's single save.
export class RoomDraft{
 constructor(room){this.room=cloneRoom(room);this.past=[];this.future=[]}
 change(mutator){const before=cloneRoom(this.room);mutator(this.room);if(JSON.stringify(before)===JSON.stringify(this.room))return;this.past.push(before);if(this.past.length>60)this.past.shift();this.future=[]}
 undo(){if(!this.past.length)return;this.future.push(cloneRoom(this.room));this.room=this.past.pop()}
 redo(){if(!this.future.length)return;this.past.push(cloneRoom(this.room));this.room=this.future.pop()}
}
