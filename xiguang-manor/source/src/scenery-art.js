import {paintMilkyWay} from './starlight.js';
import {painter} from './art.js';
export function rng(seed=217){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
export function pixelEllipse(p,x,y,rx,ry,color){for(let dy=-ry;dy<=ry;dy++)p.r(x-Math.floor(rx*Math.sqrt(1-dy*dy/(ry*ry))),y+dy,Math.floor(rx*Math.sqrt(1-dy*dy/(ry*ry)))*2+1,1,color)}
function foliage(p,x,y,s,col,light){const rand=rng(x*99+y);for(let i=0;i<19;i++){const a=i*2.4,r=3+rand()*s;p.r(x+Math.cos(a)*r,y+Math.sin(a)*r*.7,5+rand()*7,4+rand()*5,i%3?col:light)}}
// Layered, horizon-facing painting for the lookout. All geometry is original.
export function landscape(w,h,period='night',viewpoint='lake'){
 const palettes={night:{grass:'#344951',grass2:'#476064',leaf:'#3b535c',lit:'#5c6d70',trunk:'#55495b',roof:'#78617f',tile:'#997d98',wall:'#a68b96',wall2:'#8f7789',window:'#f3cb8c',flower:'#bc93ad',shadow:'#273c49'},dawn:{grass:'#71877a',grass2:'#93a283',leaf:'#637f73',lit:'#a1ac89',trunk:'#8c7275',roof:'#be91a2',tile:'#e2b5ba',wall:'#e7c6ac',wall2:'#c8a99b',window:'#d7b698',flower:'#e5b0c0',shadow:'#536d6b'},day:{grass:'#809c83',grass2:'#a7b58a',leaf:'#6a8c78',lit:'#b0bd91',trunk:'#8f7978',roof:'#b58da4',tile:'#dcadc0',wall:'#e8d1b4',wall2:'#c5afaa',window:'#9db5bc',flower:'#edbacb',shadow:'#607f75'}};
 palettes.dusk={grass:'#596b66',grass2:'#8d9180',leaf:'#575c69',lit:'#a38e91',trunk:'#785f72',roof:'#ae7e94',tile:'#d8a8ae',wall:'#d3ab9e',wall2:'#ac8790',window:'#efc18c',flower:'#d0a5bb',shadow:'#424b60'};
 const a=palettes[period],p=painter(w,h),r=p.r,g=h*.88;const rand=rng(71);
 // Distant manor roof: a familiar cream-and-pink candy house, seen from the hill.
 p.r(16,g-39,67,37,a.wall2);p.r(21,g-39,57,35,a.wall);p.poly([[9,g-39],[25,g-62],[72,g-62],[91,g-39]],a.roof);for(let j=0;j<5;j++)p.r(24-j*3,g-59+j*4,49+j*6,1,a.tile);p.r(62,g-73,6,17,a.wall2);p.r(60,g-74,10,3,a.tile);
 for(let x of [27,46,65]){p.r(x,g-30,8,13,a.roof);p.r(x+1,g-29,6,10,a.window);p.r(x+3,g-29,1,10,a.wall2);p.r(x,g-24,8,1,a.wall2)}p.r(40,g-6,20,7,a.wall2);
 // A second tiny roof nestles behind the trees.
 p.r(w-58,g-25,42,27,a.wall2);p.poly([[w-65,g-25],[w-43,g-45],[w-9,g-25]],a.roof);p.r(w-39,g-16,7,10,a.window);
 p.poly([[0,g-3],[24,g-6],[55,g+3],[87,g-5],[130,g-2],[163,g-10],[w,g-3],[w,h],[0,h]],a.grass);
 // Shadows fall away from the eastern sun.
 for(let x of [20,w-17])p.poly([[x,g+5],[x-45,g+28],[x-16,g+32],[x+7,g+8]],a.shadow);
 p.poly([[79,h],[91,g+5],[121,g+5],[139,h]],period==='night'?'#746976':period==='dawn'?'#d3b7a3':'#c8b3a2');
 for(let i=0;i<90;i++){let x=rand()*w,y=g+rand()*(h-g);p.r(x,y,rand()>.5?2:1,1,i%2?a.grass2:a.lit)}
 // Side trees frame the sky without hiding the constellation.
 for(let [x,y] of [[7,g-6],[w-10,g-8]]){p.r(x,y-49,5,55,a.trunk);p.r(x-9,y-35,14,3,a.trunk);p.r(x+4,y-43,14,3,a.trunk);foliage(p,x-3,y-51,19,a.leaf,a.lit);foliage(p,x+5,y-66,14,a.leaf,a.lit)}
 // Front bench and telescope; seat leaves room for the original girl sprite.
 const by=h-41;if(viewpoint==='lake'){p.r(79,by+12,4,13,a.trunk);p.r(137,by+12,4,13,a.trunk);p.r(75,by+8,70,5,period==='night'?'#a18a96':'#d9b5aa');for(let i=0;i<3;i++)p.r(78,by-9+i*5,64,3,period==='night'?'#927c91':'#c8a4a1');p.r(82,by-12,3,24,a.trunk);p.r(136,by-12,3,24,a.trunk);
 p.r(164,by-11,3,29,a.trunk);p.poly([[165,by+3],[154,by+24],[157,by+24],[167,by+7],[177,by+24],[180,by+24],[168,by+2]],a.trunk);p.poly([[151,by-10],[171,by-24],[178,by-15],[157,by-2]],'#aaa0c8');p.poly([[149,by-12],[153,by-14],[161,by-3],[157,by]],'#d8c1c7');p.r(171,by-25,6,3,'#e4c8ae');
 }
 // Tiny garden lantern.
 p.r(53,by+3,2,22,a.trunk);p.r(49,by-6,10,11,'#69566d');p.r(51,by-4,6,7,a.window);p.r(48,by-8,12,2,'#a68b9d');
 for(let i=0;i<34;i++){const x=rand()*w,y=g+14+rand()*(h-g-14);if(x>73&&x<148)continue;p.r(x,y,1,5,a.lit);p.r(x-1,y-2,3,3,i%3?a.flower:'#ddc79f');p.r(x,y-1,1,1,'#f9dbb5')}
 // Near blades and pastel flowers, deliberately asymmetric.
 for(let i=0;i<28;i++){let x=i*9-8,y=h-3-rand()*8;p.poly([[x,y+7],[x+2,y-7-rand()*7],[x+4,y+7]],a.grass2);if(i%4===0){p.r(x+2,y-9,1,8,a.lit);p.r(x,y-12,5,4,a.flower);p.r(x+2,y-11,1,1,'#f7d8af')}}
 // Ferns, blossom clusters and trailing vines frame the shore in the original palette.
 for(const [x,dir]of [[5,1],[w-5,-1]]){
  for(let i=0;i<17;i++){const xx=x+dir*i*1.6,yy=g-53+i*1.22;r(xx,yy,2,2,a.leaf);r(xx+dir*2,yy-2,4,1,a.lit);if(i%3===1){r(xx,yy+2,1,6+i%5,a.leaf);r(xx-1,yy+7+i%5,3,3,period==='night'?'#b8a2c1':'#d9b9d0');r(xx,yy+8+i%5,1,1,'#f2d7c9')}}
  for(let i=0;i<12;i++){const xx=x+dir*(i*7%38),yy=h-4-(i*13%24);r(xx,yy,1,6,a.lit);r(xx-2,yy-3,5,3,a.flower);r(xx-1,yy-4,3,5,a.flower);r(xx,yy-2,1,1,'#f2d5b1')}
 }
 if(viewpoint==='lake'){for(const [x,y]of [[118,g-13],[143,g-24]]){r(x-4,y,10,1,a.leaf);r(x-3,y-1,7,1,a.lit);r(x,y-4,2,4,a.flower);r(x-1,y-3,4,2,a.flower);r(x,y-3,1,1,'#f6dfbd')}}
 // Each viewing position has its own physical foreground, below the same horizon.
 if(viewpoint==='roof'){r(0,h-47,w,47,a.roof);for(let y=h-44;y<h;y+=5){r(0,y,w,1,a.tile);for(let x=0;x<w;x+=15)r(x+(y%10?7:0),y,1,5,a.trunk)}r(0,h-49,w,3,a.tile);r(12,h-78,13,33,a.wall2);r(10,h-80,17,4,a.tile);r(14,h-75,2,26,a.wall)}
 if(viewpoint==='window'){r(0,h-52,w,52,a.wall2);r(0,h-55,w,5,a.wall);r(0,h-50,w,2,a.tile);for(let y=h-40;y<h;y+=12)r(0,y,w,1,a.trunk)}
 return p.canvas;
}
export function makeNebula(w,h){return paintMilkyWay(w,h)}
export function makeLookoutTexture(scene){const p=painter(82,55);p.r(2,24,77,28,'#7d7283');for(let y=26;y<53;y+=6)p.r(3,y,75,1,'#b4a0a8');p.r(7,20,2,12,'#cab0b7');p.r(72,20,2,12,'#cab0b7');p.r(5,20,70,2,'#c5a9b0');p.r(12,32,34,5,'#c5a0a4');p.r(14,28,30,3,'#9d829b');p.r(16,36,3,9,'#816d83');p.r(40,36,3,9,'#816d83');p.poly([[56,31],[49,45],[52,45],[57,35],[64,45],[67,45],[59,31]],'#b3a0af');p.poly([[49,22],[64,12],[69,19],[53,28]],'#aba0ca');p.r(61,11,6,3,'#e8c5b5');p.r(5,47,72,3,'#a38d9d');scene.textures.addCanvas('lookout-deck',p.canvas)}
