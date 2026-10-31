import {LAKESIDE} from './lakeside-config.js';
import {mix} from './sky-model.js';

const urls=import.meta.glob('./assets/lakeside/*.png',{eager:true,query:'?url',import:'default'});
export function preloadLakeside(scene){for(const name of LAKESIDE.sources){const key='lake-source-'+name;if(!scene.textures.exists(key))scene.load.image(key,urls[`./assets/lakeside/${name}.png`])}}
const hex=color=>[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16)];
export function ramp(colors,t){const u=Math.max(0,Math.min(.9999,t))*(colors.length-1),i=Math.floor(u);return mix(colors[i],colors[Math.min(i+1,colors.length-1)],u-i)}
export class LakeMaterials {
 constructor(scene){this.scene=scene;this.cache=new Map();this.renders=0}
 image(name,period='night'){
  const key=name+'/'+period;if(this.cache.has(key))return this.cache.get(key);
  const source=this.scene.textures.get('lake-source-'+name).getSourceImage(),canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=name.startsWith('mountains')?Math.min(256,source.height):source.height;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(source,0,0);const image=c.getImageData(0,0,canvas.width,canvas.height),d=image.data,a=LAKESIDE.periods[period],mapping=new Map();
  for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const R=d[i],G=d[i+1],B=d[i+2],rgb=R*65536+G*256+B;
   let value=mapping.get(rgb);if(!value){const lum=(R*.299+G*.587+B*.114)/255;let color;
    if(name.startsWith('mountains')){
      const palette=period==='night'?['#303b59','#485472','#626e8b','#7e86a0']:period==='dusk'?['#525375','#7c718d','#a28a9f','#c8a5ad']:period==='dawn'?['#66768a','#8e92a3','#b6a9b7','#d7bfba']:['#5d8394','#7b9ba8','#a7bac1','#d3d6cb'];
      color=ramp(palette,Math.max(0,(lum-.19)/.43));
    }else if(name==='oak'||name==='rowan'){
      color=G>R*.96&&G>B*1.25?ramp(a.leaf,(lum-.15)/.65):ramp(a.bark,(lum-.08)/.52);
    }else if(name==='cottage'){
      if(G>R*1.12&&B>R*1.12&&G>90)color=ramp(a.glass,(lum-.28)/.47);
      else if(Math.abs(R-G)<30&&Math.abs(G-B)<30&&G>110)color=ramp(a.stone,(lum-.30)/.48);
      else if(R-G<48&&B>G*.7)color=ramp(a.roof,(lum-.12)/.57);
      else color=ramp(a.wood,(lum-.07)/.68);
    }else if(name==='shore-rock')color=ramp(a.stone,(lum-.10)/.70);
    else if(!name.startsWith('grass')&&R>G*1.05&&G>B*1.7)color=mix(a.warm,'#f9e3bd',Math.max(0,lum-.3));
    else if(G>R*.83&&G>B*1.2)color=ramp(a.leaf,(lum-.12)/.62);
    else if(R>G*1.3&&B>G*1.15){const shift=name==='daisy'?.22:name==='bellflower'?-.10:0;color=ramp(a.petal,(lum-.20)/.55+shift)}
    else color=ramp([a.bark[1],a.moss,a.warm,'#f9e3bd'],(lum-.08)/.77);
    value=hex(color);mapping.set(rgb,value);
   }d[i]=value[0];d[i+1]=value[1];d[i+2]=value[2];
  }
  c.putImageData(image,0,0);this.cache.set(key,canvas);this.renders++;return canvas;
 }
 clear(){this.cache.clear()}
}

// Native image pixels remain native canvas pixels. All mirroring is around a
// snapped origin, so the package's top-left key light becomes our top-right light.
export function stamp(p,image,x,y,{flip=false,scale=1}={}){
 const c=p.c;c.save();c.translate(Math.round(x*2)/2,Math.round(y*2)/2);if(flip){c.translate(image.width/2*scale,0);c.scale(-1,1)}
 c.drawImage(image,0,0,image.width/2*scale,image.height/2*scale);c.restore();
}
