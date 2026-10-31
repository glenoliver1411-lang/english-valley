import {SCENERY} from './scenery-config.js';
export function commitWish(profile,value,starId,save){
 const text=String(value??'').trim().slice(0,100);if(!text)return{ok:false,reason:'empty'};
 if(starId&&!SCENERY.stars.some(s=>s.id===starId))return{ok:false,reason:'invalid'};
 const values=starId?profile.romance.starWishes:profile.scenery,key=starId||'wish',had=Object.hasOwn(values,key),old=values[key];values[key]=text;
 let ok=false;try{ok=save()!==false}catch{}
 if(!ok){if(had)values[key]=old;else delete values[key];return{ok:false,reason:'storage'}}
 return{ok:true,text};
}
