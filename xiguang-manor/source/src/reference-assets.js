import url from './assets/reference/atelier.png';
import meta from './assets/reference/atlas.json';
let source;const frames=new Map();
export function preloadReference(scene){if(!scene.textures.exists('reference-atelier'))scene.load.image('reference-atelier',url)}
export function installReference(scene){source=scene.textures.get('reference-atelier').getSourceImage()}
export function referenceFrame(name){if(!source||!meta.frames[name])return null;if(frames.has(name))return frames.get(name);const f=meta.frames[name],c=document.createElement('canvas');c.width=f.w;c.height=f.h;c.getContext('2d').drawImage(source,f.x,f.y,f.w,f.h,0,0,f.w,f.h);frames.set(name,c);return c}
