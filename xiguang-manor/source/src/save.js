import {romanticDefaults,sanitizeRomantic} from './romantic-model.js';
import {candyDefaults,sanitizeCandy} from './candy-model.js';
import {adventureDefaults,wardrobeDefaults,sanitizeAdventure,sanitizeWardrobe} from './adventure-model.js';
import {sceneryDefaults,sanitizeScenery} from './sky-model.js';
import {SCENERY} from './scenery-config.js';
export const SAVE_KEY='xiguang-manor-v1';
export const fresh=()=>({version:1,romance:romanticDefaults(),shop:candyDefaults(),adventure:adventureDefaults(),wardrobe:wardrobeDefaults(),scenery:sceneryDefaults(),accepted:false,stage:0,favorite:null,catName:'',catMet:false,magic:[],candies:0,plots:Array.from({length:4},()=>({state:0,wateredAt:0})),completed:false,music:false,position:{x:216,y:728}});
export function sanitize(raw){
 const d=fresh(); if(!raw||raw.version!==1)return d;
 d.scenery=sanitizeScenery(raw.scenery,SCENERY.stars.map(s=>s.id));
 d.adventure=sanitizeAdventure(raw.adventure);d.wardrobe=sanitizeWardrobe(raw.wardrobe);
 d.shop=sanitizeCandy(raw.shop);
 d.romance=sanitizeRomantic(raw.romance);
 d.accepted=!!raw.accepted;d.completed=!!raw.completed;d.stage=d.completed?5:Math.max(0,Math.min(4,Number(raw.stage)||0));
 d.favorite=['strawberry','pumpkin','lavender'].includes(raw.favorite)?raw.favorite:null;
 d.catName=typeof raw.catName==='string'?raw.catName.slice(0,20):'';d.catMet=!!raw.catMet;
 d.magic=Array.isArray(raw.magic)?[...new Set(raw.magic.filter(v=>[0,1,2].includes(v)))]:[];
 d.candies=Math.max(0,Math.floor(Number(raw.candies)||0));d.music=!!raw.music;
 if(Array.isArray(raw.plots))d.plots=d.plots.map((p,i)=>({state:[0,1,2,3].includes(raw.plots[i]?.state)?raw.plots[i].state:0,wateredAt:Math.max(0,Number(raw.plots[i]?.wateredAt)||0)}));
 if(Number.isFinite(raw.position?.x)&&Number.isFinite(raw.position?.y))d.position={x:Math.max(24,Math.min(408,raw.position.x)),y:Math.max(180,Math.min(790,raw.position.y))};
 return d;
}
export function load(storage){try{storage??=globalThis.localStorage;return sanitize(JSON.parse(storage.getItem(SAVE_KEY)))}catch{return fresh()}}
export function persist(data,storage){try{storage??=globalThis.localStorage;storage.setItem(SAVE_KEY,JSON.stringify(data));return true}catch{return false}}
export function quest(data){return data.completed?5:data.stage>=3?(data.magic.length===3?4:3):data.stage}
export function grow(plot,now=Date.now()){if(plot.state===2&&now-plot.wateredAt>=18000)plot.state=3;return plot}
