// Native image coordinates, not replacement art. Feet collide with the floor
// and furniture contact polygons; the upper floor and staircase remain scenery.
export const FLORIST={text:{overview:'看全花铺',follow:'回到身边',loading:'正在走进晚风花铺……',hint:'轻点柜台、花桌或玻璃花罩，也可以用摇杆慢慢逛。',failed:'花铺原画暂未加载完成，请联网后重试。',retry:'重新打开花铺',meadow:'去花海采花'},actorScale:3,width:1169,height:1280,speed:200,spawn:{x:509,y:1123},
 floor:[[293,1080],[162,1002],[570,858],[568,763],[620,746],[718,772],[805,798],[920,768],[1087,815],[1145,855],[1150,1002],[948,1245],[546,1194],[418,1266],[279,1183],[302,1112]],
 obstacles:[
  {id:'counter',points:[[148,824],[508,711],[576,752],[576,873],[230,985],[149,930]]},
  {id:'island',points:[[632,964],[812,905],[902,939],[903,984],[758,1061],[645,1018]]},
  {id:'rose-table',points:[[940,1018],[971,965],[1066,956],[1111,1002],[1090,1084],[1033,1120],[973,1079]]},
  {id:'front-plants',points:[[809,1170],[861,1108],[922,1064],[968,1112],[1113,1024],[1168,1005],[1168,1135],[953,1272]]},
  {id:'left-plants',points:[[156,942],[277,967],[328,1048],[326,1122],[274,1166],[210,1143],[160,1177],[115,1143],[92,1053]]},
  {id:'board',points:[[984,800],[1003,760],[1093,788],[1094,843],[1053,862],[985,840]]},
  {id:'window-vases',points:[[1071,800],[1122,775],[1168,789],[1168,888],[1095,866]]},
  {id:'stairs',points:[[555,350],[662,540],[760,651],[856,725],[853,778],[787,801],[710,764],[625,630]]}
 ],
 stations:[
  {id:'stock',title:'售花柜台',x:417,y:836,hit:145,approaches:[{x:440,y:956}]},
  {id:'wrap',title:'花束包装台',x:529,y:758,hit:100,approaches:[{x:604,y:860}]},
  {id:'bouquets',title:'花束展示桌',x:759,y:929,hit:125,approaches:[{x:803,y:1091},{x:585,y:984},{x:818,y:858}]},
  {id:'decor',title:'家具与装饰',x:1034,y:984,hit:105,approaches:[{x:930,y:1031},{x:974,y:924}]},
  {id:'exit',title:'回到庄园',x:416,y:1210,hit:75,approaches:[{x:416,y:1210}]}
 ]};
export function inPolygon(x,y,points){let yes=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes}return yes}
export function floristBlocked(x,y){return [[0,0],[-12,0],[12,0],[0,-6],[0,6]].some(([dx,dy])=>!inPolygon(x+dx,y+dy,FLORIST.floor)||FLORIST.obstacles.some(o=>inPolygon(x+dx,y+dy,o.points)))}
export function frontAt(foot,x){if(x<=foot[0][0])return foot[0][1];for(let i=1;i<foot.length;i++){const a=foot[i-1],b=foot[i];if(x<=b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}return foot.at(-1)[1]}
export function floristRoute(start,goal){
 const step=18,cols=Math.ceil(FLORIST.width/step),rows=Math.ceil(FLORIST.height/step),size=cols*rows;
 const point=id=>({x:(id%cols)*step,y:Math.floor(id/cols)*step});
 const clear=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/6));for(let i=0;i<=n;i++)if(floristBlocked(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n))return false;return true};
 if(floristBlocked(start.x,start.y)||floristBlocked(goal.x,goal.y))return[];if(clear(start,goal))return[{...goal}];
 const closest=p=>{let best=-1,distance=Infinity;for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const x=Math.round(p.x/step)+xx,y=Math.round(p.y/step)+yy;if(x<0||y<0||x>=cols||y>=rows)continue;const id=y*cols+x,q=point(id),d=Math.hypot(p.x-q.x,p.y-q.y);if(d<distance&&clear(p,q)){best=id;distance=d}}return best};
 const first=closest(start),last=closest(goal);if(first<0||last<0)return[];
 const parent=new Int32Array(size).fill(-1),queue=new Int32Array(size);let head=0,tail=1;queue[0]=first;parent[first]=first;
 while(head<tail&&parent[last]<0){const id=queue[head++],x=id%cols,y=Math.floor(id/cols);for(const[dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=cols||yy>=rows)continue;const next=yy*cols+xx;if(parent[next]>=0||!clear(point(id),point(next)))continue;parent[next]=id;queue[tail++]=next}}
 if(parent[last]<0)return[];const path=[];for(let id=last;;id=parent[id]){path.push(point(id));if(id===first)break}path.reverse();path.push({...goal});
 const route=[];let from=start,index=0;while(index<path.length){let end=path.length-1;while(end>index&&!clear(from,path[end]))end--;route.push(path[end]);from=path[end];index=end+1}return route;
}
