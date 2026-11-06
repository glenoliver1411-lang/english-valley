import url from './assets/v6/atelier.png';
import meta from './assets/v6/atlas.json';
import anchors from './assets/v6/anchors.json';
import {preloadReference,installReference,referenceFrame} from './reference-assets.js';
let source;const cache=new Map();
export function preloadV6(scene){preloadReference(scene);if(!scene.textures.exists('v6-atelier'))scene.load.image('v6-atelier',url)}
export function installV6(scene){installReference(scene);source=scene.textures.get('v6-atelier').getSourceImage()}
export function v6Frame(name){const refined=referenceFrame(name);if(refined)return refined;if(!source||!meta.frames[name])return null;if(cache.has(name))return cache.get(name);const f=meta.frames[name],c=document.createElement('canvas');c.width=f.w;c.height=f.h;c.getContext('2d').drawImage(source,f.x,f.y,f.w,f.h,0,0,f.w,f.h);cache.set(name,c);return c}
export function actorAnchors(outfit,frame){return anchors[outfit]?.[frame]||anchors.original[frame]}
