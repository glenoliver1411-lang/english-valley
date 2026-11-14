import terrain from './assets/daylight/terrain.webp';
import cat from './assets/daylight/cat.webp';
import oakCanopy from './assets/daylight/oak-canopy.webp';
import oakTrunk from './assets/daylight/oak-trunk.webp';
import birchCanopy from './assets/daylight/birch-canopy.webp';
import birchTrunk from './assets/daylight/birch-trunk.webp';
import fern from './assets/daylight/fern.webp';
import roseBorder from './assets/daylight/rose-border.webp';
import {poseCharacter,CHARACTER} from './character-art.js';

export const daylightTerrain=terrain;
const images={'oak-canopy':oakCanopy,'oak-trunk':oakTrunk,'birch-canopy':birchCanopy,'birch-trunk':birchTrunk,fern,'rose-border':roseBorder};
export function preloadDaylight(s){for(const [id,url]of Object.entries(images))if(!s.textures.exists('daylight-'+id))s.load.image('daylight-'+id,url);if(!s.textures.exists('daylight-cat'))s.load.spritesheet('daylight-cat',cat,{frameWidth:48,frameHeight:48})}
export function installDaylight(s){if(![...Object.keys(images).map(id=>'daylight-'+id),'daylight-cat'].every(id=>s.textures.exists(id)))return false;for(const id of Object.keys(images))s.textures.get('daylight-'+id).setFilter(1);s.textures.get('daylight-cat').setFilter(1);return true}
export function worldActor(s,facing=0,moving=false){poseCharacter(s,{facing,moving,scale:CHARACTER.worldScale})}

// Original trunks remain immobile. Only their independently illustrated crowns move.
export function daylightTree(s,o){if(o.kind!=='tree'||!['oak','birch'].includes(o.frame))return null;const oak=o.frame==='oak',trunk=s.add.image(o.x,o.y,'daylight-'+o.frame+'-trunk').setOrigin(.5,1),canopy=s.add.image(o.x-6,o.y-o.width*(oak?.12:.16),'daylight-'+o.frame+'-canopy').setOrigin(.5,1);trunk.setScale(o.width*(oak?.77:.69)/trunk.width).setDepth(o.y);canopy.setScale(o.width*(oak?1.19:1.13)/canopy.width).setDepth(o.y+.002);trunk.canopy=canopy;return trunk}

// A few authored low borders, not a random field of decorative repeats.
const borders=[['fern',110,860,145],['fern',1135,550,95],['fern',165,1605,135],['fern',1120,1735,115],['rose-border',450,720,150],['rose-border',1125,985,135],['rose-border',805,1768,130],['rose-border',465,1905,130]];
export function daylightBorders(s){return borders.map(([id,x,y,w],i)=>{const image=s.add.image(x,y,'daylight-'+id).setOrigin(.5,1).setDepth(y+.004);image.setScale(w/image.width);return{image,x,y,phase:i*2.31}})}
export function updateBorders(nodes,t,still,light){for(const n of nodes){n.image.rotation=still?0:Math.sin(t*.48+n.phase)*.003;n.image.setTint(light)}}
export function updateDaylightCat(s){const p=s.cat,last=s.lastCat||{x:p.x,y:p.y,facing:0},dx=p.x-last.x,dy=p.y-last.y,moving=!s.profile.romance.reducedMotion&&Math.hypot(dx,dy)>.025,facing=moving?Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0:last.facing;p.setFrame((moving?4+(Math.floor(s.elapsed*4)%2)*4:0)+facing).setTint(s.currentLight.plants);s.catContact.setPosition(p.x,p.y+2).setDepth(p.depth-.04);s.lastCat={x:p.x,y:p.y,facing}}
