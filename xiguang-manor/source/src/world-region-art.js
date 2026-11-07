import {preloadFlowers,installFlowers,flowerSprite} from './flower-art.js';
import emptyPlanter from './assets/cottage/planterEmpty.webp';
import planter from './assets/cottage/planter.webp';
import architecture from './assets/world/architecture.png';
import botanical from './assets/world/botanical.png';
import terrain from './assets/world/terrain-source.png';
import light from './assets/world/architecture-light.png';
import seated from './assets/world/seated.png';
import metadata from './assets/world/atlas.json';
export function preloadWorldRegion(scene){preloadFlowers(scene);for(const[key,url]of[['planter-empty',emptyPlanter],['planter',planter],['architecture',architecture],['botanical',botanical],['terrain',terrain],['light',light],['seated',seated]])if(!scene.textures.exists('world-hd-'+key))scene.load.image('world-hd-'+key,url)}
export function installWorldRegion(scene){
 if(!installFlowers(scene))return false;
 if(!['architecture','botanical','terrain','light','seated'].every(k=>scene.textures.exists('world-hd-'+k)))return false;
 for(const[frame,f]of Object.entries(metadata.frames)){const t=scene.textures.get('world-hd-'+f.sheet);t.setFilter(1);if(!t.has(frame))t.add(frame,0,f.x,f.y,f.w,f.h)}
 const sitting=scene.textures.get('world-hd-seated');sitting.setFilter(1);for(const[id,f]of Object.entries(metadata.seatedFrames))if(!sitting.has(id))sitting.add(id,0,f.x,f.y,f.w,f.h);
 scene.textures.get('world-hd-terrain').setFilter(1);return true;
}
export function regionSprite(scene,o){if(o.flowerSpecies)return flowerSprite(scene,o.flowerSpecies,o.x,o.y,o.width,Math.min(105,o.width*.9)).setDepth(o.y);if(o.kind==='plot')return scene.add.image(o.x,o.y,'world-hd-planter').setOrigin(.5,1).setDisplaySize(o.width,o.width*scene.textures.get('world-hd-planter').getSourceImage().height/scene.textures.get('world-hd-planter').getSourceImage().width).setDepth(o.y);const f=metadata.frames[o.frame],s=scene.add.image(o.x,o.y,'world-hd-'+f.sheet,o.frame).setOrigin(.5,1).setScale(o.width/f.w).setDepth(o.y);return s}
export {metadata as WORLD_FRAMES};
export function regionWindow(scene,o){const f=metadata.frames[o.frame],t=scene.textures.get('world-hd-light');t.setFilter(1);if(!t.has(o.frame))t.add(o.frame,0,f.x,f.y,f.w,f.h);return scene.add.image(o.x,o.y,'world-hd-light',o.frame).setOrigin(.5,1).setScale(o.width/f.w).setDepth(o.y+.015)}
