import {mix} from './sky-model.js';
import {detailedTree,leafEllipse,treeBranch} from './tree-art.js';
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const ellipse=(p,x,y,rx,ry,color)=>leafEllipse(p,x,y,rx,ry,color);
function bloom(p,x,y,color,size=2){const r=p.r;r(x,y,1,6,'#87a08b');r(x-3,y+3,3,1,'#a5b79a');ellipse(p,x,y-2,size,size,color);r(x,y-3,1,1,'#f2dfb7')}
function bush(p,x,y,width,color,a,seed){const rand=seeded(seed);for(let i=0;i<24;i++){const xx=x+(rand()-.5)*width,yy=y+(rand()-.5)*22;ellipse(p,xx,yy,4+rand()*4,3+rand()*2,a.leaf);p.r(xx+1,yy-2,3,1,a.lit);if(i%4)bloom(p,xx,yy-3,color,1+i%2)}}
function wishTree(p,a){
 const r=p.r,wood=mix('#66515e','#8a6c71',a.day),bark=mix('#927583','#b2958b',a.day),groove=mix('#574855','#786268',a.day);
 ellipse(p,215,283,44,7,mix(a.shadow,a.grass,.55));
 p.poly([[200,284],[195,270],[199,249],[193,228],[198,203],[201,171],[215,164],[222,191],[220,215],[226,241],[222,264],[229,284]],wood);
 p.poly([[210,280],[207,260],[211,243],[205,225],[210,203],[209,177],[215,174],[219,201],[214,223],[220,242],[217,261],[221,280]],bark);
 const branches=[[[205,241],[182,224],[167,204],[147,195]],[[214,220],[237,204],[253,179],[277,171]],[[208,205],[187,183],[178,159]],[[216,192],[228,160],[250,140]]];
 for(const points of branches){treeBranch(p,points,7,wood);treeBranch(p,points.map(([x,y])=>[x+2,y-1]),2,bark)}
 for(const points of [[[204,260],[188,280],[157,286]],[[215,266],[241,282],[267,288]],[[210,273],[207,287],[189,293]]]){treeBranch(p,points,5,wood);treeBranch(p,points,1,bark)}
 for(let i=0;i<9;i++){const y=200+i*8;r(201+i%3*3,y,1,5,groove);r(217-i%2*2,y+2,1,3,bark)}
 const dark=mix('#866780','#b08ba5',a.day),mid=mix('#ad88a8','#d3a2bd',a.day),lit=mix('#c8a4bf','#ebc3d0',a.day),tip=mix('#dac0cc','#f3d9d9',a.day),rand=seeded(73);
 // Unequal blossom islands and branch gaps replace the old flat rectangular crown.
 const crowns=[[149,159,28,23],[173,179,30,24],[208,185,32,23],[243,178,32,25],[278,155,28,24],[138,133,20,18],[174,133,37,30],[220,132,39,31],[262,126,31,26],[292,135,20,21],[160,105,25,19],[198,91,32,25],[236,94,29,22],[270,108,24,19],[218,69,19,15]];
 for(let i=0;i<crowns.length;i++){const [x,y,rx,ry]=crowns[i];ellipse(p,x,y,rx,ry,i<5?mix(dark,mid,.66):mid)}
 // Texture crosses the lobe boundaries, so this reads as one flowering canopy.
 for(let i=0;i<crowns.length;i++){
  const [x,y,rx,ry]=crowns[i];
  for(let j=0;j<75;j++){const angle=rand()*Math.PI*2,rad=Math.sqrt(rand()),xx=x+Math.cos(angle)*rx*rad*.94,yy=y+Math.sin(angle)*ry*rad*.87,bright=yy<y+3&&xx>x-rx*.35,color=bright?(j%4?lit:tip):(j%3?mid:mix(dark,mid,.45));
   if(j%4===0){ellipse(p,xx,yy,2+rand()*2,1+rand(),color);r(xx+1,yy-1,1,1,bright?tip:lit)}else{r(xx,yy,2+j%3,1,color);r(xx+1,yy+1,1,1,j%5?mid:lit)}
  }
 }
 // A few hanging flower tips tuck into the shaded lower crown.
 for(const [x,y,length]of [[135,174,20],[168,191,16],[270,185,22],[291,168,18]])for(let i=0;i<length/3;i++){r(x+Math.sin(i)*2,y+i*3,1,3,mid);r(x-1+Math.sin(i)*2,y+i*3+1,3,2,i%3?lit:tip)}
}
export function paintGarden(p,sky){
 const d=sky.day,r=p.r,random=seeded(311),a={day:d,grass:mix('#3d5557','#7e987d',d),leaf:mix('#526d68','#79977b',d),lit:mix('#809186','#a7b895',d),shadow:mix('#30464c','#536f64',d),pink:mix('#b596b3','#e4b6c9',d),wood:mix('#857183','#b39a91',d)};
 r(0,0,432,850,a.grass);
 for(let i=0;i<760;i++){const x=random()*432,y=random()*850;r(x,y,1+random()*2,1,mix(i%2?'#49645e':'#617970',i%2?'#8da583':'#a6b18d',d));if(i%5===0)r(x+1,y-2,1,2,a.lit)}
 // The original path, entrances, plots and pond retain their physical positions.
 p.poly([[180,850],[242,850],[242,724],[282,656],[262,577],[216,527],[231,451],[294,401],[296,359],[260,355],[252,387],[189,431],[175,533],[217,590],[236,649],[194,709]],mix('#827b7a','#d1b6a3',d));
 p.poly([[192,850],[229,850],[229,718],[268,652],[250,584],[203,530],[217,444],[281,394],[280,367],[268,365],[262,394],[204,436],[189,531],[231,588],[251,653],[207,713]],mix('#ad9991','#e0c9ae',d));
 const path=[[213,835],[215,735],[251,653],[237,589],[197,533],[211,445],[277,389],[279,368]];
 for(let i=1;i<path.length;i++){const A=path[i-1],B=path[i],length=Math.hypot(B[0]-A[0],B[1]-A[1]);for(let k=0;k<length;k+=17){const u=k/length,x=A[0]+(B[0]-A[0])*u,y=A[1]+(B[1]-A[1])*u;r(x-6,y,12,1,mix('#99898b','#baa590',d));r(x-5,y+1,7,1,mix('#c0aca1','#edd6ba',d));if(k%34===0)r(x+3,y-3,1,3,a.shadow)}}
 for(const [x,y,s]of [[20,128,1.6],[407,135,1.8],[12,338,1.7],[425,390,1.6],[17,605,1.6],[420,670,1.5],[28,810,1.2],[406,824,1.3]])detailedTree(p,x,y,s,{dark:mix('#344e55','#587568',d),leaf:a.leaf,lit:a.lit,tip:mix('#98a591','#cad1ab',d)});
 wishTree(p,a);
 // Individually lit stones define the pool rim; lilies nestle into the water.
 ellipse(p,324,284,56,38,mix('#746b7b','#a2979a',d));ellipse(p,324,280,53,34,mix('#a699aa','#d9c9be',d));ellipse(p,324,280,45,27,mix('#405b70','#97b8b5',d));ellipse(p,324,280,40,23,mix('#586e83','#b4d0c4',d));
 for(let i=0;i<16;i++){const angle=i*Math.PI/8,x=324+Math.cos(angle)*50,y=280+Math.sin(angle)*31;r(x-2,y-2,4,3,i%3?mix('#ad9fad','#dfcfc2',d):mix('#8c8294','#b9ada8',d));r(x-1,y-2,3,1,mix('#c9b9c5','#f0e0ce',d))}
 for(let i=0;i<11;i++){const yy=267+i*3,xx=303+Math.sin(i*1.5)*9;r(xx,yy,9+i%3*3,1,mix('#9bafba','#dce0ce',d))}
 for(const [x,y]of [[305,283],[341,269]]){ellipse(p,x,y,9,3,'#85a58e');p.poly([[x,y],[x+8,y-2],[x+7,y+2]],'#a6bb95');bloom(p,x+2,y-3,a.pink,3)}
 // Raised wooden plots: bevels, joints, corner pins and distinct tilled soil.
 for(let i=0;i<6;i++){const x=87+i%2*67,y=401+Math.floor(i/2)*61;r(x-25,y-17,50,34,'#7b656d');r(x-23,y-18,46,33,'#b99891');r(x-20,y-14,40,25,mix('#5b4e59','#78615e',d));for(let j=0;j<3;j++){r(x-17,y-9+j*7,33,1,mix('#7d656b','#a28376',d));r(x-16,y-8+j*7,27,1,mix('#66545e','#876c64',d))}r(x-25,y+12,50,3,'#d0ada0');r(x-23,y-18,46,1,'#ead0b4');for(const xx of [-22,21])for(const yy of [-15,11])r(x+xx,y+yy,1,1,'#f0d4ae')}
 r(50,368,28,5,a.wood);r(54,372,2,8,'#806c7b');r(73,372,2,8,'#806c7b');r(60,356,9,10,'#a8bcc0');r(57,359,3,4,'#ccd5cc');p.poly([[68,359],[75,355],[73,361]],'#c5ccbf');
 // Carved swing frame. Ropes and seat are drawn dynamically by the scene.
 for(const x of [319,391]){r(x,425,6,139,'#746170');r(x+4,429,1,132,'#b99b96');r(x+1,435,1,41,'#8f7783');r(x-3,560,12,4,'#746170')}r(315,419,87,8,'#a1848b');r(316,419,85,2,'#d3b4a3');for(const x of [324,391]){r(x,423,2,2,'#e5c7a5')}
 for(let i=0;i<12;i++){const x=320+Math.sin(i*.8)*3,y=438+i*9;r(x,y,1,8,a.leaf);r(x-3,y+2,4,2,a.lit);if(i%3===0)bloom(p,x+2,y,a.pink,2)}
 // Ferns, small rose islands and pale flowers make the ground feel tended.
 for(const [x,y,w,col,seed]of [[62,315,62,a.pink,9],[370,347,52,'#baa9d1',4],[65,576,78,a.pink,18],[73,645,105,'#cdb8d9',12],[63,698,76,'#dcc8ca',27],[322,655,66,a.pink,61],[355,766,58,'#c3b3d8',16],[102,818,87,a.pink,39],[168,294,45,'#d5b0c5',82]])bush(p,x,y,w,col,a,seed);
 for(let i=0;i<20;i++){const x=49+i%2*136+Math.sin(i*2)*5,y=395+Math.floor(i/2)*17;if(y>554)continue;r(x,y-8,1,12,a.leaf);r(x-1,y-13,3,6,i%3?'#bea9d1':'#dfc3d5');r(x,y-12,1,1,'#eee0cc')}
 for(let i=0;i<100;i++){const x=40+random()*352,y=337+random()*430;if(x>174&&x<282||x>53&&x<186&&y>375&&y<550||x>315&&y>420&&y<565)continue;bloom(p,x,y,i%4?a.pink:'#e6d7c1',1+i%2)}
 // A worn tree hollow and letter preserve the original optional discovery.
 p.poly([[25,309],[42,304],[49,325],[44,346],[26,349],[23,331]],'#746170');r(29,313,2,24,'#aa8b8c');ellipse(p,38,323,7,10,'#364852');r(35,324,6,3,'#d1b4ae');
 const arch=(cx,y,width)=>{r(cx-width/2,y,5,72,a.wood);r(cx+width/2,y,5,72,a.wood);for(let i=0;i<20;i++){const angle=Math.PI+i/19*Math.PI,x=cx+Math.cos(angle)*width*.51,yy=y+9+Math.sin(angle)*38;ellipse(p,x,yy,5,4,i%2?a.leaf:a.lit);if(i%2)bloom(p,x,yy-2,i%3?a.pink:'#c7b5db',2)}};
 arch(216,730,99);arch(355,711,55);
 for(let i=0;i<6;i++){const x=282+i*17;r(x,607,3,28,a.wood);r(x-1,606,5,3,'#d9b5ac');r(x,617,19,2,'#baa294')}r(285,638,2,30,'#806775');r(280,628,12,10,'#816b7d');r(282,629,8,7,'#efcfa0');r(279,626,14,2,'#b8999e');
 r(300,676,2,8,'#f1ddb4');r(297,679,8,2,'#d3b9dc');r(47,618,8,4,'#e5a3b7');r(45,617,2,6,'#e5c2bb');r(55,617,2,6,'#e5c2bb');
}
