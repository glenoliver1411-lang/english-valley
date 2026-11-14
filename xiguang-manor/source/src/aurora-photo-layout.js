// The full supplied painting always stays inside the viewport. Never stretch
// the X/Y axes separately or crop the girl, bench, mountains or aurora tips.
export function auroraPhotoLayout(width,height,artWidth=720,artHeight=1280,complete=false){
 const scale=(complete?Math.min:Math.max)(width/artWidth,height/artHeight),scaledWidth=artWidth*scale,scaledHeight=artHeight*scale;
 // The portrait's girl/bench/moon/right summit are all in the safe central
 // window. Only peripheral flowers/empty sky can be cropped in immersive mode.
 const clamp=(x,lo,hi)=>Math.min(hi,Math.max(lo,x));
 return {scale,x:complete?(width-scaledWidth)/2:clamp(width/2-380*scale,width-scaledWidth,0),y:complete?height-scaledHeight:(height-scaledHeight)/2,width:scaledWidth,height:scaledHeight,complete};
}
export function flowingLight(time,index){
 const x=time*.055-index*.34,n=Math.floor(x),f=x-n,u=f*f*f*(f*(f*6-15)+10),hash=k=>{const a=Math.sin(k*127.1+93.7)*43758.5453;return a-Math.floor(a)};
 return (.012+.045*(hash(n)+(hash(n+1)-hash(n))*u))*Math.min(1,time/3);
}
