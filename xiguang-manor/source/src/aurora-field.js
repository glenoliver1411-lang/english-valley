// A continuous projected light sheet. Geometry, emission and filaments evolve
// in separate smooth noise fields; no tiled sine stripe or whole-sheet scroll.
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const lerp=(a,b,t)=>a+(b-a)*t;
const hash=(x,y)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295};
export function lightNoise(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=smooth(x-ix),v=smooth(y-iy);return lerp(lerp(hash(ix,iy),hash(ix+1,iy),u),lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v)}
const MAIN=[[-.17,.105],[-.015,.235],[.18,.355],[.36,.375],[.565,.303],[.63,.245],[.535,.221],[.437,.269],[.558,.285],[.78,.181],[1.11,.108]];
const FAR=[[-.20,.37],[.04,.40],[.28,.294],[.49,.152],[.70,.105],[1.16,.18]];
const WISP=[[.31,.39],[.40,.385],[.48,.33],[.46,.293],[.53,.27],[.69,.253],[.80,.22]];
function spline(points,u){const f=clamp(u)*(points.length-1),i=Math.min(points.length-2,Math.floor(f)),t=f-i,p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];return[0,1].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t*t*t))}
export function auroraEnvelope(time){const phase=((time%88)+88)%88;return smooth(phase/12)*(1-smooth((phase-56)/23))}
export function sheetPoint(u,time,layer='main'){
 const points=layer==='far'?FAR:layer==='wisp'?WISP:MAIN,base=spline(points,u),speed=layer==='far'?.009:layer==='wisp'?.021:.014;
 const drift=time*speed,fold=Math.exp(-(((u-.59)/.18)**2)),opening=lightNoise(2.7,drift+8)-.5;
 const bend=(lightNoise(u*4.1+7,drift)-.5)*.022+(lightNoise(u*11.6+19,drift*.79+3)-.5)*.009;
 const x=base[0]+(lightNoise(u*3.7,drift*.65+29)-.5)*.042+opening*fold*.055;
 const lower=base[1]+bend+opening*fold*.028;
 const edge=smooth(u/.065)*(1-smooth((u-.87)/.13));
 const width=layer==='far'?.075+lightNoise(u*3+27,drift)*.070:layer==='wisp'?.025+lightNoise(u*6,drift+17)*.038:.065+lightNoise(u*3.5+30,drift*.8)*.104;
 const h=width*(.60+.40*edge)*(1-fold*.25);
 const lean=(lightNoise(u*4.7+1,drift+44)-.5)*.072+(layer==='main'?(u-.5)*.024:-.03);
 // Material-space filaments, compressed at folds and broken by slow ionization.
 const texture=lightNoise(u*243.7+3,drift*.43+71)*.58+lightNoise(u*611.3,drift*.38+5)*.42;
 const bands=lightNoise(u*16.3-time*.030,drift+11);
 const pools=.30+.70*lightNoise(u*6.1+7,drift*.67+3);
 const alpha=edge*(.22+.78*texture**1.8)*(.48+.52*bands)*pools;
 return{x,lower,height:h,lean,alpha,fold,edge};
}

const colors=[[83,163,179],[87,200,166],[145,222,185],[208,236,212],[150,156,199]];
export function auroraColor(u,v,time){
 const hue=lightNoise(u*3.6+12,time*.008+11),low=v>.83?clamp((v-.83)/.17):0;
 const blend=smooth((hue-.20)/.65),green=colors[0].map((x,i)=>lerp(x,colors[1][i],blend)),mint=colors[2],pearl=colors[3],violet=colors[4];
 let c=green.map((x,i)=>lerp(x,mint[i],low*.8));
 const upper=(1-smooth(v/.56))*(.25+.40*lightNoise(u*8+29,time*.013));c=c.map((x,i)=>lerp(x,violet[i],upper));
 const spark=low**8*Math.max(0,lightNoise(u*27+1,time*.022)-.55)*1.8;return c.map((x,i)=>Math.round(lerp(x,pearl[i],spark)));
}
