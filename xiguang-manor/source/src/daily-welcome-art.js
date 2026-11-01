const palettes={
  morning:['#c7986c','#edc789','#fff0c0'],afternoon:['#82958b','#c0c5a3','#f4dfaf'],
  evening:['#9a7e9d','#d6a7b2','#f4d5b0'],night:['#8f82ad','#bdadd1','#f6e1b7']
};
// Original, integer-grid icons. No emoji, external font or image request.
export function welcomeIcon(phase){
  const [dark,mid,light]=palettes[phase],pixels=[];
  const rect=(x,y,w,h,color)=>pixels.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`);
  if(phase==='night'){
    for(let y=-6;y<=6;y++)for(let x=-6;x<=6;x++)if(x*x+y*y<=36&&(x-3)**2+(y+2)**2>29)rect(9+x,10+y,1,1,light);
    rect(16,3,1,5,mid);rect(14,5,5,1,mid);rect(3,2,1,1,dark);
  }else{
    const cy=phase==='evening'?11:8;
    for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++)if(x*x+y*y<=16)rect(10+x,cy+y,1,1,light);
    for(const[x,y,w,h]of [[9,1,2,2],[9,14,2,2],[2,7,2,2],[16,7,2,2],[4,3,2,1],[15,3,1,2]])if(phase==='morning')rect(x,y,w,h,mid);
    if(phase==='evening'){rect(2,14,16,2,mid);rect(4,17,12,1,dark);rect(7,10,5,1,'#fff0ce')}
    if(phase==='afternoon'){rect(3,12,1,6,dark);rect(1,10,5,3,mid);rect(2,9,3,5,mid);rect(3,11,1,1,light);rect(13,11,6,2,'#e5dce1');rect(15,10,3,1,'#e5dce1')}
  }
  return `<svg viewBox="0 0 20 20" shape-rendering="crispEdges" aria-hidden="true">${pixels.join('')}</svg>`;
}
