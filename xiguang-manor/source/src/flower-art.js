import {FLOWERS} from './flower-catalog.js';
const newer=import.meta.glob('./assets/flowers/*.webp',{eager:true,query:'?url',import:'default'}),original=import.meta.glob('./assets/cottage/flower-*.webp',{eager:true,query:'?url',import:'default'}),sources=new Map(),frames=new Map();
export const flowerImage=id=>newer['./assets/flowers/'+id+'.webp']||original['./assets/cottage/flower-'+id+'.webp'];
export const flowerTexture=id=>'botany-'+id;
export function preloadFlowers(s){for(const f of FLOWERS)if(!s.textures.exists(flowerTexture(f.id)))s.load.image(flowerTexture(f.id),flowerImage(f.id))}
export function installFlowers(s){if(!FLOWERS.every(f=>s.textures.exists(flowerTexture(f.id))))return false;for(const f of FLOWERS){const t=s.textures.get(flowerTexture(f.id));t.setFilter(1);sources.set(f.id,t.getSourceImage())}return true}
export function flowerFrame(id){if(frames.has(id))return frames.get(id);const source=sources.get(id);if(!source)throw Error('Flower artwork has not finished loading: '+id);const c=document.createElement('canvas');c.width=104;c.height=200;const g=c.getContext('2d'),scale=Math.min(104/source.width,200/source.height);g.imageSmoothingEnabled=false;g.drawImage(source,(104-source.width*scale)/2,200-source.height*scale,source.width*scale,source.height*scale);frames.set(id,c);return c}
export function flowerSprite(s,id,x,y,width,height){const im=s.add.image(x,y,flowerTexture(id)).setOrigin(.5,1);im.setScale(Math.min(width/im.width,height/im.height));return im}
