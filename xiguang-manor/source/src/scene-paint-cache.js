// Bounded CPU-side paintings. Phaser scene textures still belong to the scene
// and are removed on shutdown; keeping a few canvases avoids repainting visits.
const cache=new Map(),limit=6;
export function cachedPainting(key,paint){let value=cache.get(key);if(value){cache.delete(key);cache.set(key,value);return value}value=paint();cache.set(key,value);while(cache.size>limit)cache.delete(cache.keys().next().value);return value}
export function paintCacheStats(){return{count:cache.size,limit,bytes:[...cache.values()].reduce((n,c)=>n+c.width*c.height*4,0)}}
export function retreatPair(hour,day){if(hour>=17&&hour<20)return['dusk','dusk',0];if(day>.65)return[hour<9?'morning':'day','day',hour<9?Math.max(0,(day-.8)/.2):0];return['night',day>0?'morning':'night',Math.min(1,day*1.5)]}
export function candyPair(hour,day){return hour>=17&&hour<20?['dusk','dusk',0]:['night',day>0?hour<9?'morning':'day':'night',day]}
export const periodHour={night:22,morning:7,day:12,dusk:18};
