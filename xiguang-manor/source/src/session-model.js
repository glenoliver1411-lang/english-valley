import {persist} from './save.js';
export const ENTRY_KEY='xiguang-manor-entrances-v1';
const clone=value=>JSON.parse(JSON.stringify(value));
// Kept separate from game progress: discarding a visit never repeats the same welcome.
export function nextEntrance(storage){let count=0;try{storage??=globalThis.localStorage;const raw=Number(storage.getItem(ENTRY_KEY));count=Number.isSafeInteger(raw)&&raw>=0?raw:0;storage.setItem(ENTRY_KEY,String((count+1)%3000000))}catch{}return count%3}
export class SessionProgress{
 constructor(profile,storage){this.baseline=clone(profile);this.storage=storage;this.exited=false;this.lastSaveOK=true}
 save(profile){if(this.exited)return true;this.lastSaveOK=persist(profile,this.storage);return this.lastSaveOK}
 exit(profile,saveCurrent){if(this.exited)return true;this.lastSaveOK=persist(saveCurrent?profile:this.baseline,this.storage);if(this.lastSaveOK)this.exited=true;return this.lastSaveOK}
}
