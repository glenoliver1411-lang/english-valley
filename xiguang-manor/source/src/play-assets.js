import {v6Frame} from './v6-assets.js';
import url from './assets/play/atelier.png';
import atlas from './assets/play/atlas.json';
let source;const frames=new Map(),images=new Map(),bouquets=new Map();
export function preloadPlay(scene){if(!scene.textures.exists('play-atelier'))scene.load.image('play-atelier',url)}
export function installPlay(scene){source=scene.textures.get('play-atelier').getSourceImage()}
export function playFrame(name){const refined=v6Frame(name);if(refined)return refined;if(frames.has(name))return frames.get(name);const f=atlas.frames[name];if(!f||!source)throw Error('Play artwork unavailable: '+name);const c=document.createElement('canvas');c.width=f.w;c.height=f.h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(source,f.x,f.y,f.w,f.h,0,0,f.w,f.h);frames.set(name,c);return c}
export function playImage(name){if(!images.has(name))images.set(name,playFrame(name).toDataURL());return images.get(name)}
export function bouquetCanvas(flowers,wrap){const key=flowers.join('/')+'/'+wrap;if(bouquets.has(key))return bouquets.get(key);const c=document.createElement('canvas');c.width=70;c.height=90;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(playFrame('wrap-back-'+wrap),0,0);for(const [i,id]of flowers.entries()){g.save();g.translate(35,55);g.rotate([-0.36,0,0.34][i]);g.drawImage(playFrame('flower-'+id),-13,-48,26,50);g.restore()}g.drawImage(playFrame('wrap-front-'+wrap),0,0);bouquets.set(key,c);if(bouquets.size>40)bouquets.delete(bouquets.keys().next().value);return c}
export const bouquetImage=b=>bouquetCanvas(b.flowers,b.wrap).toDataURL();
