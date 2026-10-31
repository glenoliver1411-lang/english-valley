import {ROMANCE} from './romantic-config.js';
export const romanticDefaults=()=>({treeAwakened:false,personalStar:false,starPlace:'room',theme:'rose',weather:'clear',rainStoppedAt:0,catFollow:false,reducedMotion:false,flowers:[],secrets:[],starWishes:{},beds:Array.from({length:6},()=>({flower:null,wateredAt:0}))});
export function sanitizeRomantic(raw){
 const d=romanticDefaults();if(!raw||typeof raw!=='object')return d;
 for(const k of ['treeAwakened','personalStar','catFollow','reducedMotion'])d[k]=!!raw[k];
 d.starPlace=raw.starPlace==='sky'?'sky':'room';
 if(ROMANCE.themes.some(x=>x.id===raw.theme))d.theme=raw.theme;
 if(['clear','rain','snow'].includes(raw.weather))d.weather=raw.weather;
 d.rainStoppedAt=Math.max(0,Math.min(Date.now(),Number(raw.rainStoppedAt)||0));
 d.flowers=[...new Set((Array.isArray(raw.flowers)?raw.flowers:[]).filter(x=>ROMANCE.flowers.some(f=>f.id===x)))];
 d.secrets=[...new Set((Array.isArray(raw.secrets)?raw.secrets:[]).filter(x=>Object.hasOwn(ROMANCE.secrets,x)))];
 for(const [id,wish]of Object.entries(raw.starWishes||{}))if(['xi','petal','moon','sugar','wish','wind','dawn'].includes(id)&&typeof wish==='string')d.starWishes[id]=wish.slice(0,100);
 if(Array.isArray(raw.beds))d.beds=d.beds.map((b,i)=>({flower:ROMANCE.flowers.some(f=>f.id===raw.beds[i]?.flower)?raw.beds[i].flower:null,wateredAt:Math.max(0,Math.min(Date.now(),Number(raw.beds[i]?.wateredAt)||0))}));
 return d;
}
export function flowerStage(bed,now=Date.now()){return !bed.flower?0:!bed.wateredAt?1:now-bed.wateredAt<20000?2:now-bed.wateredAt<60000?3:4}
export function harvestFlower(world,index,now=Date.now()){const bed=world.beds[index];if(!bed||flowerStage(bed,now)!==4)return false;if(!world.flowers.includes(bed.flower))world.flowers.push(bed.flower);world.beds[index]={flower:null,wateredAt:0};return true}
