// Rear view: the sitter is behind the backrest, supported by the far edge of
// the seat. Two actual layers avoid cutting a front-view bench across her lap.
export function auroraBench(){
 const make=()=>{const v=document.createElement('canvas');v.width=156;v.height=104;return v};
 const base=make(),front=make(),b=base.getContext('2d'),c=front.getContext('2d');
 const rect=(g,x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h)};
 for(const x of [12,139]){rect(b,x,66,6,33,'#302d42');rect(b,x+1,68,2,27,'#655569');rect(b,x-3,97,12,3,'#393447');rect(b,x-2,96,10,1,'#8c7280')}
 b.fillStyle='#796074';b.beginPath();b.moveTo(8,57);b.lineTo(146,57);b.lineTo(153,68);b.lineTo(2,68);b.closePath();b.fill();
 for(let y=58;y<68;y+=3){rect(b,7,y,141,1,'#9f7d8c');rect(b,8,y+1,139,1,'#67556c')}
 rect(b,2,68,151,6,'#5f4c62');rect(b,3,68,149,2,'#ab8693');rect(b,8,74,140,2,'#393348');
 for(const x of [6,145]){rect(c,x,23,5,53,'#483d53');rect(c,x+1,24,2,50,'#967786');rect(c,x-2,21,9,3,'#a28493');rect(c,x-1,20,7,1,'#c0a1ac')}
 for(let row=0;row<3;row++){
  const y=29+row*11;rect(c,11,y,134,7,'#6c566b');rect(c,12,y,132,1,'#b18f9e');rect(c,12,y+1,132,3,'#927484');rect(c,13,y+5,130,1,'#55465d');
  for(let j=0;j<5;j++){const x=18+j*25+(row%2)*6;rect(c,x,y+3,13+(j%3)*2,1,'#7b6074');rect(c,x+5,y+2,9,1,'#a28390')}
  rect(c,16,y+2,1,1,'#c5acb3');rect(c,138,y+2,1,1,'#c5acb3');
 }
 // Curled arm supports remain outside the body silhouette.
 for(const x of [0,147]){rect(c,x+1,48,9,3,'#a38696');rect(c,x,51,4,11,'#7c637a');rect(c,x+3,60,7,3,'#735c72');rect(c,x+2,49,5,1,'#cab2b9')}
 return{base,front,width:156,height:104,actor:{x:56,y:-1,w:45,h:64},seatY:58};
}
