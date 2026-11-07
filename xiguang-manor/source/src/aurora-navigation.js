import {AURORA_PAGE as A} from './aurora-config.js';

export function rememberMeadow(point,storage){
 try{(storage??globalThis.sessionStorage).setItem(A.returnKey,JSON.stringify({x:point.x,y:point.y}));return true}catch{return false}
}
export function consumeMeadowReturn(){
 const url=new URL(location.href);if(url.searchParams.get('return')!=='meadow')return null;
 url.searchParams.delete('return');history.replaceState(null,'',url);
 let point;try{point=JSON.parse(sessionStorage.getItem(A.returnKey));sessionStorage.removeItem(A.returnKey)}catch{}
 return{x:Number.isFinite(point?.x)?Math.max(40,Math.min(398,point.x)):216,y:Number.isFinite(point?.y)?Math.max(330,Math.min(795,point.y)):730};
}

export const WORLD_AURORA_RETURN='xiguang-aurora-world-return';
export function rememberWorldAurora(){try{sessionStorage.setItem(WORLD_AURORA_RETURN,'1')}catch{}location.assign('./aurora.html?from=world')}
export function consumeWorldAuroraReturn(){const url=new URL(location.href);if(url.searchParams.get('return')!=='world-aurora')return false;url.searchParams.delete('return');history.replaceState(null,'',url);try{sessionStorage.removeItem(WORLD_AURORA_RETURN)}catch{}return true}
