import room from './assets/cottage/room.webp';
import manifest from './assets/cottage/atlas.json';
import seated from './assets/world/seated.png';
import world from './assets/world/atlas.json';
import {HOME} from './home-config.js';
// The actual PNG pixels are also used by the furniture catalog.
const files=import.meta.glob('./assets/cottage/*.webp',{eager:true,query:'?url',import:'default'});
export const cottageImage=type=>files['./assets/cottage/'+type+'.webp'];
export const COTTAGE={floorY:338,window:{x:123,y:81,w:187,h:182},fixed:[
 {type:'fireplace',id:'fire',x:77,y:330,w:103,h:142},
 {type:'desk',id:'mail',x:216,y:330,w:156,h:76},
 {type:'bed',id:'rest',x:332,y:527,w:119,h:190},
 {type:'sofa',id:'sofa',x:62,y:448,w:68,h:85},
 {type:'wardrobe',id:'wardrobe',x:65,y:667,w:74,h:119},
 {type:'bookcase',id:'books',x:365,y:684,w:84,h:116}
]};
export function preloadCottage(s){
 if(!s.textures.exists('cottage-shell'))s.load.image('cottage-shell',room);
 if(!s.textures.exists('cottage-seated'))s.load.image('cottage-seated',seated);
 for(const name of Object.keys(manifest.frames))if(!s.textures.exists('cottage-'+name))s.load.image('cottage-'+name,cottageImage(name));
}
export function installCottage(s){
 const t=s.textures.get('cottage-seated');t.setFilter(1);for(const[id,f]of Object.entries(world.seatedFrames))if(!t.has(id))t.add(id,0,f.x,f.y,f.w,f.h);
 for(const key of ['cottage-shell',...Object.keys(manifest.frames).map(n=>'cottage-'+n)])s.textures.get(key).setFilter(1);
}
export function fitCottage(image,type,fixed=null){const f=fixed||HOME.items.find(i=>i.type===type),a=image.texture.getSourceImage();return image.setScale(Math.min(f.w/a.width,f.h/a.height))}
export function cottageFlowers(s,image,item,bouquet,visible=true){
 if(item.type!=='vase')return;const flowers=bouquet?.flowers||[s.profile.romance.room.bouquet],signature=flowers.join('/');
 if(image.flowerSignature!==signature){image.sprays?.forEach(v=>v.destroy());image.flowerSignature=signature;image.sprays=flowers.map(kind=>s.add.image(0,0,'cottage-flower-'+kind).setOrigin(.5,1))}
 image.sprays.forEach((v,i)=>{const many=flowers.length>1,w=many?16:26;v.setScale(w/v.width).setPosition(item.x+(many?(i-1)*8:0),item.y-38+(i%2?0:2)).setDepth(image.depth+.001+i*.0001).setAlpha(image.alpha).setVisible(visible)});
}
export const cottageWindow=(x,y)=>x>123&&x<309&&y>136&&y<258||y>82&&y<=136&&((x-216)/88)**2+((y-138)/58)**2<1;
export function cottageLighting(s,day){
 const w=s.profile.romance,theme=w.theme,tint=day>.5?0xffffff:day>.1?0xdfc9be:0x888da8;
 s.background.setTint(tint);s.cottageFloor.setTint(day>.5?(w.room.floor==='pale'?0xd9d3de:w.room.floor==='herringbone'?0xe9c696:0xffffff):0x9b899b);
 s.cottageWall.setTint(tint);
 s.cottageGlass.setTint(day>.3?0xffffff:0x667b9d);
 const floor=w.room.floor,wall=w.room.wallpaper;
 s.cottageSurface.setVisible(floor!=='original').setTexture('cottage-'+(floor==='pale'?'pale':'herringbone')).setTint(day>.3?0xffffff:0x8b8a9d);
 for(const panel of s.cottagePaper)panel.setVisible(wall!=='original').setTexture('cottage-'+(wall==='gingham'?'gingham':'floral')).setTint(tint);
 s.cottageRug.setTint(day>.3?theme==='cream'?0xffefd3:theme==='rose'?0xffe6ea:0xffffff:0xb2a2bc);
 s.cottageGift.setTexture('cottage-'+(w.personalStar?'giftOpen':'giftClosed'));
 for(const p of s.fixedSprites){p.setTint(day>.3?theme==='lavender'?0xeee4ff:theme==='cream'?0xfff3da:0xffffff:0xbaa5b4)}
}
