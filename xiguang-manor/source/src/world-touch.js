import {AT} from './adventure-config.js';
export function mapHit(scene,x,y){const near=(a,b,r)=>Math.hypot(x-a,y-b)<r;
 if(y<166)return{kind:near(340,50,24)?'moon':y>115?'mountain':'star',x,y};for(const bird of scene.environment?.birdPositions||[])if(near(bird.x,bird.y,11))return{kind:'bird',...bird};if(near(scene.cat.x,scene.cat.y,22))return{kind:'core',id:'cat'};
 for(let i=0;i<scene.magicPositions.length;i++){const[a,b]=scene.magicPositions[i];if(scene.magic[i].visible&&near(a,b,15))return{kind:'core',id:'magic',index:i,x:a,y:b}}
 for(const s of scene.sweets)if(!s.at&&near(s.x,s.y,12))return{kind:'core',id:'sweet',sweet:s,x:s.x,y:s.y};
 for(let i=0;i<4;i++){const a=57+i%2*49,b=564+Math.floor(i/2)*43;if(Math.abs(x-a)<19&&Math.abs(y-b)<15)return{kind:'core',id:'plot',index:i,x:a,y:b}}
 if(x>291&&x<390&&y>621&&y<710)return{kind:'core',id:'cabin'};if(x>47&&x<114&&y>663&&y<731)return{kind:'core',id:'garden'};
 if(x>314&&x<397&&y>317&&y<372)return{kind:'core',id:'lookout'};
 if(x>306&&x<402&&y>231&&y<300){const f=scene.environment?.fishPositions?.find(f=>near(f.x,f.y,12));return f?{kind:'fish',...f}:{kind:'pond',x:354,y:265}}
 if(y>745&&y<785)return{kind:'gate',x,y};
 return(scene.worldObjects||[]).filter(o=>x>=o.bounds.x&&x<=o.bounds.x+o.bounds.w&&y>=o.bounds.y&&y<=o.bounds.y+o.bounds.h).sort((a,b)=>a.bounds.w*a.bounds.h-b.bounds.w*b.bounds.h)[0]||null;
}
export function closeDecoration(scene){const p=scene.player;const obj=(scene.worldObjects||[]).map(o=>({...o,d:Math.hypot(p.x-o.x,p.y-o.y)})).filter(o=>o.d<28).sort((a,b)=>a.d-b.d)[0];return obj?{id:'decor',object:obj,title:AT.tap}:null}
