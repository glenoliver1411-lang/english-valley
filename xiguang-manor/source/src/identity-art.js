import atlas from './assets/identity/atlas.json';
import catAtlas from './assets/identity/cats/atlas.json';
import bellURL from './assets/play/atelier.png';
import playAtlas from './assets/play/atlas.json';
import legacyCatURL from './assets/daylight/cat.webp';
import {IDENTITY as C} from './identity-config.js';
import {appearanceKey,catKey} from './identity-model.js';
const partURLs=import.meta.glob('./assets/identity/parts/*.webp',{eager:true,query:'?url',import:'default'});
const catURLs=import.meta.glob('./assets/identity/cats/*.webp',{eager:true,query:'?url',import:'default'});
let eyeMask=null,sourceEpoch=0;
const whiteCatURL=catURLs['./assets/identity/cats/white.webp'];
const sources=new Map(),painted=new Map(),avatars=new Map(),pets=new Map(),portraits=new Map();
export const AVATAR_ATLAS=atlas;
export const CAT_ATLAS=catAtlas;
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const remember=(map,key,value,max)=>{map.delete(key);map.set(key,value);if(map.size>max)map.delete(map.keys().next().value);return value};
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0).toString(36)};
export const avatarKey=p=>'owner-'+hash(appearanceKey(p));
export const petKey=p=>'pet-'+hash(p.identity?.cat?.custom===false?'legacy':catKey(p));
const partURL=id=>partURLs['./assets/identity/parts/'+id+'.webp'];
const petURL=p=>p.identity?.cat?.custom===false?legacyCatURL:catURLs['./assets/identity/cats/'+p.identity?.cat?.coat+'.webp'];
function loadURL(url){if(sources.has(url))return sources.get(url);const promise=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{sources.delete(url);reject(Error('角色素材暂未送达'))};im.src=url});return remember(sources,url,promise,24)}
const readySources=new Map();
async function image(url){if(readySources.has(url))return remember(readySources,url,readySources.get(url),24);const epoch=sourceEpoch,value=await loadURL(url);return epoch===sourceEpoch?remember(readySources,url,value,24):value}
export function avatarParts(profile){const a=profile.identity.appearance,ids=['body','head-'+a.eyeShape+'-'+a.expression,'brow-'+a.brows,a.hair,a.top,a.bottom,a.shoes,...a.accessories];if(atlas.parts[a.hair+'-rear'])ids.push(a.hair+'-rear');if(a.bangs==='fringe')ids.push('fringe');return [...new Set(ids)].sort((a,b)=>atlas.parts[a].layer-atlas.parts[b].layer)}
const garmentColors={shirt:'#e8e2d4',tshirt:'#9bb5ba',knit:'#ba9473',sweater:'#b5a285',jacket:'#7f927a',vest:'#b39b6f',jeans:'#7394ae',casual:'#898d85',wide:'#a39585',shorts:'#b09d78',cargo:'#899478',longskirt:'#9c9eaa',shortskirt:'#9a8d9c',sneakers:'#ddd9cc',leather:'#80715c',canvas:'#b9b7a7',boots:'#796f64',hat:'#8c9b7d',hairclip:'#c49f85',scarf:'#b9a37d',backpack:'#9a8866',glasses:'#797c76'};
function catEyesMask(){if(eyeMask)return eyeMask;const white=readySources.get(whiteCatURL);if(!white)return null;const c=canvas(256,320),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(white,0,0);const a=g.getImageData(0,0,256,320).data,m=new Uint8Array(256*320);for(let i=0;i<a.length;i+=4){const r=a[i],gr=a[i+1],b=a[i+2];if(a[i+3]>100&&b>r*1.25&&gr>r*1.1&&b-r>35)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const at=i/4+dy*256+dx;if(at>=0&&at<m.length)m[at]=1}}eyeMask=m;return m}
function tintPixels(im,color,kind='cloth'){
 const out=canvas(im.width,im.height),c=out.getContext('2d',{willReadFrequently:true});c.drawImage(im,0,0);const data=c.getImageData(0,0,out.width,out.height),a=data.data,target=color.match(/\w\w/g).map(v=>parseInt(v,16));
 for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const r=a[i],g=a[i+1],b=a[i+2];if(kind==='eyes'){if(!(b>r*1.18&&g>r*1.15&&r<185))continue}else if(kind==='catEyes'){const mask=catEyesMask(),hi=Math.max(r,g,b),lo=Math.min(r,g,b);if(!mask?.[i/4]||hi-lo<32||hi<45)continue}
 const l=(Math.max(r,g,b)*.65+(r+g+b)/3*.35)/255;for(let j=0;j<3;j++)a[i+j]=Math.min(255,target[j]*(.27+l*.91)+Math.max(0,l-.8)*70)
 }c.putImageData(data,0,0);return out;
}
function partPainting(id,p){const a=p.identity.appearance,kind=id.startsWith('head-')?'eyes':'cloth',color=id.startsWith('head-')?C.colors[a.eyeColor]:['short','medium','long','curly','ponytail','ponytail-rear','twintails','fringe'].includes(id)?C.colors[a.hairColor]:id.startsWith('brow-')?C.colors[a.hairColor]:garmentColors[id];const key=id+'/'+(color||'native'),url=partURL(id);if(painted.has(key))return painted.get(key);const source=readySources.get(url);if(!source)throw Error('角色部件未准备完整：'+id);const out=color?tintPixels(source,color,kind):source;return remember(painted,key,out,16)}
function composeAvatar(profile){const key=avatarKey(profile);if(avatars.has(key))return avatars.get(key);const ids=avatarParts(profile);if(!ids.every(id=>readySources.has(partURL(id))))return null;const out=canvas(576,480),c=out.getContext('2d');c.imageSmoothingEnabled=false;
 for(const id of ids){let im=partPainting(id,profile);if(profile.identity.appearance.accessories.includes('hat')&&['short','medium','long','curly','ponytail','twintails','fringe'].includes(id)){
  const cut=canvas(576,480),g=cut.getContext('2d');g.drawImage(im,0,0);const hat=readySources.get(partURL('hat')),t=canvas(576,480),tc=t.getContext('2d',{willReadFrequently:true});tc.drawImage(hat,0,0);const pix=tc.getImageData(0,0,576,480).data;
  for(let f=0;f<48;f++){const x=f%9*64,y=Math.floor(f/9)*80;let bottom=0;for(let yy=0;yy<48;yy++)for(let xx=10;xx<54;xx++)if(pix[((y+yy)*576+x+xx)*4+3]>128)bottom=Math.max(bottom,yy);if(bottom)g.clearRect(x,y,64,bottom-2)}im=cut;
 }c.drawImage(im,0,0)}return remember(avatars,key,out,6)}
export async function prepareAvatar(profile){if(profile.identity?.mode!=='modular')return null;await Promise.all(avatarParts(profile).map(id=>image(partURL(id))));return composeAvatar(profile)}
export function currentAvatar(profile){return composeAvatar(profile)}
const petParts=p=>p.identity?.cat?.custom===false?[]:[...(p.identity?.cat?.collar!=='none'?['scarf']:[]),...(p.identity?.cat?.accessory==='bow'?['hairclip']:[])];
export function preloadIdentity(scene,profile){const parts=[...(profile.identity?.mode==='modular'&&!avatars.has(avatarKey(profile))?avatarParts(profile):[]),...petParts(profile)];for(const id of new Set(parts)){const key='identity-source-'+id;if(!scene.textures.exists(key))scene.load.image(key,partURL(id))}if(profile.identity?.cat?.accessory==='bell'&&!scene.textures.exists('identity-bell-source'))scene.load.image('identity-bell-source',bellURL);if(profile.identity?.cat?.custom!==false&&!readySources.has(whiteCatURL)&&!scene.textures.exists('identity-white-pet-source'))scene.load.image('identity-white-pet-source',whiteCatURL);const key='identity-pet-source-'+(profile.identity?.cat?.custom===false?'legacy':profile.identity?.cat?.coat||'orange');if(!pets.has(petKey(profile))&&!scene.textures.exists(key))scene.load.image(key,petURL(profile))}
export function installIdentitySources(scene,profile){const parts=[...(profile.identity?.mode==='modular'?avatarParts(profile):[]),...petParts(profile)];for(const id of new Set(parts)){const key='identity-source-'+id;if(scene.textures.exists(key)){remember(readySources,partURL(id),scene.textures.get(key).getSourceImage(),24);scene.textures.remove(key)}}if(profile.identity?.mode==='modular'&&!composeAvatar(profile))throw Error('自定义人物素材没有加载完整');if(scene.textures.exists('identity-white-pet-source')){remember(readySources,whiteCatURL,scene.textures.get('identity-white-pet-source').getSourceImage(),24);scene.textures.remove('identity-white-pet-source')}if(scene.textures.exists('identity-bell-source')){remember(readySources,bellURL,scene.textures.get('identity-bell-source').getSourceImage(),24);scene.textures.remove('identity-bell-source')}const key='identity-pet-source-'+(profile.identity?.cat?.custom===false?'legacy':profile.identity?.cat?.coat||'orange');if(scene.textures.exists(key)){remember(readySources,petURL(profile),scene.textures.get(key).getSourceImage(),24);scene.textures.remove(key)}composePet(profile)
}
function composePet(profile){const key=petKey(profile);if(pets.has(key))return pets.get(key);const source=readySources.get(petURL(profile));if(!source)return null;const out=canvas(256,320),c=out.getContext('2d');c.imageSmoothingEnabled=false;const cat=profile.identity?.cat;
 if(cat?.custom===false){for(let i=0;i<20;i++){const dir=i<16?Math.floor(i/4):i===17?1:0,step=i%4,frame=i<16?(step===1?4:step===3?8:0)+dir:dir;c.drawImage(source,frame%4*48,Math.floor(frame/4)*48,48,48,i%4*64+3,Math.floor(i/4)*64+1,58,58)}}else{
  c.drawImage(tintPixels(source,C.colors[cat.eyes],'catEyes'),0,0);if(cat.pattern==='light'){c.globalCompositeOperation='source-atop';c.globalAlpha=.09;c.fillStyle='#eee5d6';c.fillRect(0,0,256,320);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
  // Tiny accessories sit on the actual neck anchors, retaining the native fur art.
  const collarColor=C.colors[cat.collar]||'#b9b09b';const band=readySources.get(partURL('scarf')),ribbon=readySources.get(partURL('hairclip')),bandImage=band?tintPixels(band,collarColor):null,ribbonImage=ribbon?tintPixels(ribbon,collarColor):null;
  for(let i=0;i<20;i++){const d=i<16?Math.floor(i/4):i===17?1:0,x=i%4*64,y=Math.floor(i/4)*64,neck=i===18?[25,47]:i===19?[25,42]:d===1?[21,36]:d===2?[43,36]:[32,d===3?34:37];
   if(cat.collar!=='none'&&band){c.drawImage(bandImage,15,28,36,20,x+neck[0]-6,y+neck[1]-2,12,6)}
   if(cat.accessory==='bell'&&readySources.has(bellURL)){const f=playAtlas.frames['equip-catbell'];c.drawImage(readySources.get(bellURL),f.x,f.y,f.w,f.h,x+neck[0]-3,y+neck[1],6,8)}
   if(cat.accessory==='bow'&&ribbon){c.drawImage(ribbonImage,14,8,36,30,x+neck[0]-5,y+neck[1]-3,10,7)}
   if(cat.ears==='soft'){const pix=c.getImageData(x,y,64,64).data;for(const[left,right]of [[12,31],[33,53]]){let ey=40,ex=0;for(let yy=8;yy<29;yy++)for(let xx=left;xx<right;xx++){const k=(yy*64+xx)*4,r=pix[k],g=pix[k+1],b=pix[k+2];if(pix[k+3]>180&&r>g*1.12&&b>g*.93&&r>b*1.04&&yy<ey){ey=yy;ex=xx}}if(ex&&ey<27)c.clearRect(x+ex-1,y+ey-2,3,2)}}
   if(cat.tail==='small'&&i<16){const region=d===1?[35,0,29,24]:d===2?[0,0,29,24]:d===3?[13,0,23,24]:[22,0,28,14],tail=canvas(region[2],region[3]);tail.getContext('2d').drawImage(out,x+region[0],y+region[1],region[2],region[3],0,0,region[2],region[3]);c.clearRect(x+region[0],y+region[1],region[2],region[3]);c.drawImage(tail,x+region[0],y+region[1]+Math.round(region[3]*.28),region[2],Math.round(region[3]*.72))}
  }
 }return remember(pets,key,out,8)}
export async function preparePet(profile){await Promise.all([image(petURL(profile)),image(whiteCatURL),image(partURL('scarf')),image(partURL('hairclip')),...(profile.identity?.cat?.accessory==='bell'?[image(bellURL)]:[])]);return composePet(profile)}
export const currentPet=composePet;
export async function prepareIdentity(profile){const[avatar,pet]=await Promise.all([prepareAvatar(profile),preparePet(profile)]);return{avatar,pet}}
export function retainPrepared(profile,{avatar,pet}={}){if(avatar)remember(avatars,avatarKey(profile),avatar,6);if(pet)remember(pets,petKey(profile),pet,8)}
export function releaseEditingImages(){sourceEpoch++;sources.clear();readySources.clear();painted.clear()}

export function avatarPortrait(profile,{facing=0,seated=false,gather=false,frame=0}={}){const sheet=composeAvatar(profile);if(!sheet)return null;const f=seated?36+facing:gather?40+facing:facing*9+frame;const key=avatarKey(profile)+'/'+f;if(portraits.has(key))return portraits.get(key);const out=canvas(64,80);out.getContext('2d').drawImage(sheet,f%9*64,Math.floor(f/9)*80,64,80,0,0,64,80);return remember(portraits,key,out,60)}
export function catPortrait(profile,{facing=0,moving=false,sleep=false,stretch=false,frame=0}={}){const sheet=composePet(profile);if(!sheet)return null;const f=sleep?18:stretch?19:moving?facing*4+frame%4:facing===1?17:facing===3?12:16,key=petKey(profile)+'/'+f;if(portraits.has(key))return portraits.get(key);const out=canvas(64,64);out.getContext('2d').drawImage(sheet,f%4*64,Math.floor(f/4)*64,64,64,0,0,64,64);return remember(portraits,key,out,60)}
