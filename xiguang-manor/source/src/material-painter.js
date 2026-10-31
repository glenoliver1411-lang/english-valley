import {mix} from './sky-model.js';
// Shared native-pixel materials. Every prop has a top, front, side and contact
// edge; tiny texture marks describe its material rather than filling with noise.
export function oval(p,x,y,rx,ry,color){for(let row=-Math.ceil(ry);row<=Math.ceil(ry);row++){if(Math.abs(row)>ry)continue;const dx=Math.floor(rx*Math.sqrt(1-row*row/(ry*ry)));p.r(x-dx,y+row,dx*2+1,1,color)}}
export function line(p,x1,y1,x2,y2,color,width=1){const n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)));for(let i=0;i<=n;i++)p.r(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n,width,width,color)}
export function volume(p,x,y,w,h,{color='#b58e9e',depth=3,grain=false,edge='#604b63'}={}){
 const r=p.r,d=Math.min(depth,w/4,h/3),lit=mix(color,'#fff0d1',.35),dark=mix(color,'#40394f',.33);
 p.poly([[x,y+d],[x+d,y],[x+w,y],[x+w-d,y+d]],lit);
 p.poly([[x+w-d,y+d],[x+w,y],[x+w,y+h-d],[x+w-d,y+h]],dark);
 r(x,y+d,w-d,h-d,color);r(x,y+h-2,w-d,2,edge);r(x,y+d,1,h-d,lit);r(x+1,y+d,w-d-2,1,mix(lit,'#fff4db',.15));
 if(grain)for(let row=y+d+5;row<y+h-3;row+=7){r(x+3,row,w-d-6,1,mix(color,edge,.2));for(let k=0;k<2;k++)r(x+5+k*(w-d-10)*.48,row+2,Math.max(2,w*.13),1,mix(color,lit,.25))}
}
export function framed(p,x,y,w,h,fill='#a5839b',trim='#cbaaac'){
 volume(p,x,y,w,h,{color:trim,depth:2});p.r(x+3,y+4,w-7,h-9,mix(trim,'#493c55',.4));p.r(x+5,y+6,w-11,h-13,fill);p.r(x+5,y+6,w-11,1,mix(fill,'#ffffff',.22));
}
export function cushion(p,x,y,w,h,color){
 const edge=mix(color,'#5d4966',.35);p.poly([[x+4,y],[x+w-5,y],[x+w-1,y+3],[x+w,y+h-4],[x+w-4,y+h],[x+4,y+h],[x,y+h-4],[x+1,y+3]],edge);
 p.poly([[x+4,y+1],[x+w-5,y+1],[x+w-2,y+4],[x+w-2,y+h-4],[x+w-5,y+h-2],[x+4,y+h-2],[x+2,y+h-5],[x+2,y+4]],color);
 p.r(x+5,y+2,w-11,1,mix(color,'#fff1d5',.4));p.r(x+4,y+3,1,h-8,mix(color,'#fff1d5',.22));p.r(x+w/2,y+h/2,1,1,edge);
 for(const [dx,dy]of [[4,4],[w-5,4],[4,h-5],[w-5,h-5]])line(p,x+dx,y+dy,x+(dx<w/2?dx+2:dx-2),y+(dy<h/2?dy+1:dy-1),mix(color,edge,.35));
}
export function jar(p,x,y,w,h,color='#d9a9bf',glass='#b6c9d2'){
 const r=p.r;oval(p,x+w/2,y+h-2,w/2,2,'#65576d');r(x+1,y+5,w-2,h-8,mix(glass,'#564b66',.3));oval(p,x+w/2,y+h-5,w/2-2,3,mix(color,'#72526d',.25));r(x+3,y+h*.4,w-6,h*.52,color);
 for(let i=0;i<5;i++)r(x+4+(i*7)%Math.max(1,w-8),y+h*.48+(i*5)%Math.max(1,h*.37),3,2,mix(color,i%2?'#fbe8ce':'#9b748f',.33));
 r(x+3,y+7,2,h-13,'#f8e7d1');r(x+w-5,y+8,1,h-15,mix(glass,'#fff4e1',.6));oval(p,x+w/2,y+5,w/2-1,3,mix(glass,'#fff0db',.36));volume(p,x+1,y,w-2,6,{color:'#be99ab',depth:2});r(x+4,y+8,w-8,2,mix(color,'#fff1d7',.3));
}
export function book(p,x,y,w,h,color='#ba94b0'){
 volume(p,x,y,w,h,{color,depth:3});p.r(x+3,y+5,w-8,h-9,'#ecdac4');for(let yy=y+8;yy<y+h-5;yy+=3)p.r(x+5,yy,w-13,1,'#c8aaac');p.r(x+2,y+4,2,h-8,mix(color,'#72566d',.3));p.r(x+w-7,y+3,2,h*.55,'#e6bd91');
}
export function blossom(p,x,y,color,size=3){
 oval(p,x,y,size,size-1,mix(color,'#8b668c',.25));oval(p,x-1,y-1,Math.max(1,size-1),Math.max(1,size-2),color);p.r(x,y-1,1,1,'#f8deb1');p.r(x+1,y-size+1,1,1,mix(color,'#fff1d9',.55));
}
