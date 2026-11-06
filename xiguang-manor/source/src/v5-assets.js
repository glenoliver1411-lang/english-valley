import atlasURL from './assets/v5/atelier.webp';
import atlasFallbackURL from './assets/v5/atelier.png';
import meta from './assets/v5/atlas.json';
import rockURL from './assets/v5/mountain-rock.png';
import forest1URL from './assets/v5/mountain-forest-1.png';
import forest2URL from './assets/v5/mountain-forest-2.png';
import forest3URL from './assets/v5/mountain-forest-3.png';
import {mix,rgb} from './sky-model.js';
import {ROMANCE} from './romantic-config.js';
let source=null;const cache=new Map(),icons=new Map(),extras={};
export const v5FallbackURL=key=>key==='v5-atelier'?atlasFallbackURL:null;
export function preloadV5(scene){for(const[key,url]of [['atelier',atlasURL],['rock',rockURL],['forest1',forest1URL],['forest2',forest2URL],['forest3',forest3URL]])if(!scene.textures.exists('v5-'+key))scene.load.image('v5-'+key,url)}
export function installV5(scene){source=scene.textures.get('v5-atelier').getSourceImage();for(const key of ['rock','forest1','forest2','forest3'])extras[key]=scene.textures.get('v5-'+key).getSourceImage();document.documentElement.style.setProperty('--v5-mirror',`url("${v5Icon('wardrobe-mirror')}")`)}
export function hasV5(){return !!source}
export const V5_META=meta;
const fabric=new Map(meta.fabric.map((color,i)=>[rgb(color).join(','),i]));
const emission=new Set();for(const color of ['#ffd59a','#f3d79f','#edc999'])for(const value of [mix(color,'#443f59',.53),mix(color,'#443f59',.32),color,mix(color,'#f6dec1',.23),mix(color,'#f6dec1',.49)])emission.add(rgb(value).join(','));
export function v5Frame(name,{period='day',theme=null,on=false,bouquet='rose'}={}){
 const key=[name,period,theme,on,bouquet].join('/');if(cache.has(key))return cache.get(key);
 const f=meta.frames[name];if(!f||!source)throw Error('V5 artwork unavailable: '+name);
 const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const c=canvas.getContext('2d',{willReadFrequently:true});c.imageSmoothingEnabled=false;c.drawImage(source,f.x,f.y,f.w,f.h,0,0,f.w,f.h);
 const cloth=ROMANCE.themes.find(t=>t.id===theme)?.bed,clothRamp=cloth?[mix(cloth,'#3f354d',.56),mix(cloth,'#533750',.27),cloth,mix(cloth,'#ffe0cf',.26),mix(cloth,'#ffeed4',.52)].map(rgb):null;
 if(f.kind!=='ui'&&(period!=='day'||clothRamp)){
  const data=c.getImageData(0,0,f.w,f.h),p=data.data;
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const color=[p[i],p[i+1],p[i+2]],id=color.join(',');let col=clothRamp&&fabric.has(id)?clothRamp[fabric.get(id)]:color;
   if(period!=='day'){
    const indoor=f.kind==='interior',n=period==='night',dusk=period==='dusk',factor=n?(indoor?.88:.55):dusk?.80:.95;
    col=col.map((v,j)=>Math.max(0,Math.min(255,Math.round(v*factor+(n?[2,5,15]:dusk?[22,3,14]:[12,7,-1])[j]))));
   }
   if(f.kind==='exterior'&&emission.has(id))col=rgb(period==='night'||period==='dusk'?mix('#e2a365','#ffe6a7',color[0]/255):mix('#8daab4','#d3d4bf',color[0]/255));
   p[i]=col[0];p[i+1]=col[1];p[i+2]=col[2];
  }c.putImageData(data,0,0);
 }
 if(name==='furniture-vase'&&bouquet!=='rose'){
  const flower=v5Frame('flower-'+({lily:'lily',lavender:'lupin',sunflower:'aster'}[bouquet]||'cosmos'),{period});c.clearRect(0,0,canvas.width,12);c.drawImage(flower,4,0,29,29);
 }
 if(on&&name==='furniture-candles'){for(const[x,y]of [[6,5],[15,-1],[24,5]]){c.fillStyle='#f6cc8c';c.fillRect(x-1,y,3,4);c.fillStyle='#fff1c5';c.fillRect(x,y,1,3)}}
 cache.set(key,canvas);if(cache.size>220)cache.delete(cache.keys().next().value);return canvas;
}
export function v5Icon(name,options={}){const key=[name,JSON.stringify(options)].join('/');if(!icons.has(key))icons.set(key,v5Frame(name,options).toDataURL());return icons.get(key)}
export function v5Blit(c,name,x,y,{width,height,flip=false,...options}={}){const image=v5Frame(name,options);c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));if(flip){c.translate(width||image.width,0);c.scale(-1,1)}c.drawImage(image,0,0,width||image.width,height||image.height);c.restore()}
export function v5MountainSource(name,period,far=false){
 const key='panorama/'+name+'/'+period+'/'+far;if(cache.has(key))return cache.get(key);const image=extras[name],out=document.createElement('canvas');out.width=image.width;out.height=Math.min(256,image.height);const c=out.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);const data=c.getImageData(0,0,out.width,out.height),d=data.data;
 const ramps={night:['#25334c','#384965','#4c6080','#6f819f','#9aa7b8'],dawn:['#68788c','#8c94a5','#adb3bb','#d6bec0','#f0d2c6'],day:['#567d8d','#6d96a1','#94aeb5','#bdd0ca','#e3e1ce'],dusk:['#50516f','#716682','#97809c','#c9a1b1','#e8bdba']},ramp=name.startsWith('forest')?({night:['#1c3544','#2d4d55','#456b68','#64847b','#8da394'],dawn:['#506f72','#6d8d83','#8ea799','#b4bcaa','#d5cbb2'],day:['#315c54','#578273','#85a38a','#b1c49c','#d6dbad'],dusk:['#3b4d5c','#5b7070','#819084','#adb09b','#d2c0ab']}[period]):ramps[period];
 // Pixel art repeats a small authored palette. Transform each source color
 // once, rather than parsing/mixing hex colors for millions of identical pixels.
 const mapping=new Map(),haze=rgb(ramp[3]);
 for(let i=0;i<d.length;i+=4){
  if(!d[i+3])continue;const key=(d[i]<<16)|(d[i+1]<<8)|d[i+2];let col=mapping.get(key);
  if(!col){const lum=(d[i]*.30+d[i+1]*.58+d[i+2]*.12)/255,level=Math.max(0,Math.min(3.999,(lum-.12)/.5*4));col=rgb(mix(ramp[Math.floor(level)],ramp[Math.ceil(level)],level%1)).map((v,j)=>Math.round(far?v*.74+haze[j]*.26:v));mapping.set(key,col)}
  for(let j=0;j<3;j++)d[i+j]=col[j];
 }c.putImageData(data,0,0);cache.set(key,out);return out;
}
