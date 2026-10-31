import {WORLD} from './world-config.js';
const defaults=()=>({autoShows:true,aurora:true,seen:{},visits:{}});
export class WorldPreferences{
 constructor(storage){this.storage=storage;this.data=defaults();try{const raw=JSON.parse((storage??globalThis.localStorage).getItem(WORLD.key));if(raw&&typeof raw==='object'){for(const k of ['autoShows','aurora'])if(typeof raw[k]==='boolean')this.data[k]=raw[k];for(const key of ['lake','roof','window']){this.data.visits[key]=Math.max(0,Math.min(100000,Number(raw.visits?.[key])||0));for(const mode of ['meteor','fireworks']){const id=key+'-'+mode;if(Number.isFinite(raw.seen?.[id]))this.data.seen[id]=Math.max(0,raw.seen[id])}}}}catch{}}
 save(){try{(this.storage??globalThis.localStorage).setItem(WORLD.key,JSON.stringify(this.data));return true}catch{return false}}
 set(key,value){if(!['autoShows','aurora'].includes(key))return false;this.data[key]=!!value;return this.save()}
}
export const worldPreferences=new WorldPreferences();

// Active viewing time, not a real-world date or daily login. The first show is
// available at once; later visits use sparse repetition and a shared cooldown.
export class GentleShowDirector{
 constructor(viewpoint='lake',preferences=worldPreferences,now=()=>Date.now()){
  this.viewpoint=viewpoint;this.preferences=preferences;this.now=now;this.calm=0;this.count=0;this.stopped=false;this.running=false;
  const data=preferences.data;data.visits[viewpoint]=(data.visits[viewpoint]||0)+1;preferences.save();
  this.queue=viewpoint==='lake'?['meteor','fireworks']:['fireworks','meteor'];
 }
 manual(){this.stopped=true}
 update(dt,{mode='idle',night=1,blocked=false,still=false,quiet=false}={}){
  const config=WORLD.shows,d=this.preferences.data;
  if(this.stopped||!d.autoShows||still||quiet||blocked||night<.55||this.count>=config.maxPerVisit)return null;
  if(mode!=='idle'){this.running=true;this.calm=0;return null}
  if(this.running){this.running=false;this.calm=0}
  this.calm+=Math.max(0,Math.min(.25,dt));const delay=this.count?config.between:this.viewpoint==='lake'?config.lakeDelay:config.otherDelay;if(this.calm<delay)return null;
  for(const mode of this.queue){const id=this.viewpoint+'-'+mode,last=d.seen[id]||0;if(last&&((d.visits[this.viewpoint]||1)%config.repeatEvery!==0||(this.now()-last)/1000<config.cooldown))continue;
   d.seen[id]=this.now();this.preferences.save();this.count++;this.calm=0;this.running=true;return mode;
  }
  return null;
 }
}
