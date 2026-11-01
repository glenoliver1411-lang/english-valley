// A continuous projected light sheet. Geometry, emission and filaments evolve
// in separate smooth noise fields; no tiled sine stripe or whole-sheet scroll.
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const lerp=(a,b,t)=>a+(b-a)*t;
const hash=(x,y)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295};
export function lightNoise(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=smooth(x-ix),v=smooth(y-iy);return lerp(lerp(hash(ix,iy),hash(ix+1,iy),u),lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v)}
// An open, asymmetric sweep based on the supplied reference: no closed ring.
const MAIN=[[-.18,.33],[-.015,.386],[.18,.401],[.265,.377],[.34,.305],[.48,.298],[.63,.276],[.78,.225],[.90,.135],[1.12,.09]];
const FAR=[[-.18,.28],[.08,.295],[.27,.242],[.43,.215],[.62,.206],[.83,.126],[1.12,.048]];
const WISP=[[-.10,.34],[.14,.354],[.33,.286],[.48,.255],[.67,.245],[.90,.140],[1.11,.05]];
function spline(points,u){const f=clamp(u)*(points.length-1),i=Math.min(points.length-2,Math.floor(f)),t=f-i,p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];return[0,1].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t*t*t))}
export function auroraEnvelope(time){const phase=((time%88)+88)%88;return smooth(phase/12)*(1-smooth((phase-56)/23))}
export function sheetPoint(u,time,layer='main'){
 const points=layer==='far'?FAR:layer==='wisp'?WISP:MAIN,base=spline(points,u),speed=layer==='far'?.009:layer==='wisp'?.021:.014;
 const drift=time*speed,fold=Math.exp(-(((u-.59)/.18)**2)),opening=lightNoise(2.7,drift+8)-.5;
 const bend=(lightNoise(u*4.1+7,drift)-.5)*.022+(lightNoise(u*11.6+19,drift*.79+3)-.5)*.009;
 const x=base[0]+(lightNoise(u*3.7,drift*.65+29)-.5)*.042+opening*fold*.055;
 const lower=base[1]+bend+opening*fold*.028;
 const edge=smooth(u/.065)*(1-smooth((u-.87)/.13));
 const width=layer==='far'?.055+lightNoise(u*3+27,drift)*.065:layer==='wisp'?.043+lightNoise(u*6,drift+17)*.074:.075+lightNoise(u*3.5+30,drift*.8)*.103;
 const h=width*(.60+.40*edge)*(1-fold*.18)*(.83+.29*lightNoise(u*29+3,drift*.73+1));
 const lean=(lightNoise(u*4.7+1,drift+44)-.5)*.045+(layer==='main'?.035+u*.095:layer==='wisp'?-.055-u*.035:.045);
 // Material-space filaments, compressed at folds and broken by slow ionization.
 const texture=lightNoise(u*243.7+3,drift*.43+71)*.58+lightNoise(u*611.3,drift*.38+5)*.42;
 const bands=lightNoise(u*16.3-time*.030,drift+11);
 const pools=.30+.70*lightNoise(u*6.1+7,drift*.67+3);
 const alpha=edge*(.56+.44*texture)*(.57+.43*bands)*pools;
 return{x,lower,height:h,lean,alpha,fold,edge};
}

const jade=[43,207,177],cyan=[65,183,213],mint=[170,234,197],pearl=[211,239,222],violet=[133,118,201],lilac=[164,142,209];
const blendColor=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],clamp(t)));
export function auroraColor(u,v,time,layer='main'){
 const hue=lightNoise(u*3.6+12,time*.008+11),body=smooth((v-.25)/.65),patch=lightNoise(u*7.3+4,time*.012+8);
 if(layer==='far')return blendColor(violet,cyan,smooth(hue*.65+v*.45)).map(Math.round);
 if(layer==='wisp')return blendColor(blendColor(lilac,cyan,patch),jade,body*.30).map(Math.round);
 let c=blendColor(cyan,jade,.45+patch*.45);
 c=blendColor(blendColor(violet,lilac,hue),c,body);
 const seam=smooth((v-.77)/.21)*(.20+.32*patch);c=blendColor(c,mint,seam);
 const glint=Math.max(0,lightNoise(u*19+29,time*.016)-.57)*smooth((v-.85)/.15)*.65;
 return blendColor(c,pearl,glint).map(Math.round);
}
