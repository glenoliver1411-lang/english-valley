// Reusable object-layer navigation. Image pixels never determine collision.
export function worldNavigation(map){
 const blocked=(x,y)=>x<22||y<22||x>map.width-22||y>map.height-22||map.colliders.some(c=>c.type==='ellipse'?((x-c.x)/(c.rx+10))**2+((y-c.y)/(c.ry+5))**2<1:x>c.x-10&&x<c.x+c.w+10&&y>c.y-5&&y<c.y+c.h+5);
 const clear=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/7));for(let i=0;i<=n;i++)if(blocked(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n))return false;return true};
 function route(start,goal){
  if(blocked(start.x,start.y)||blocked(goal.x,goal.y))return[];if(clear(start,goal))return[{...goal}];
  const step=24,cols=Math.ceil(map.width/step),rows=Math.ceil(map.height/step),point=i=>({x:i%cols*step,y:Math.floor(i/cols)*step});
  const nearest=p=>{let id=-1,dist=Infinity;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=Math.round(p.x/step)+dx,y=Math.round(p.y/step)+dy;if(x<1||y<1||x>=cols||y>=rows)continue;const i=y*cols+x,q=point(i),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<dist&&clear(p,q)){id=i;dist=d}}return id};
  const first=nearest(start),last=nearest(goal);if(first<0||last<0)return[];
  const parent=new Int32Array(cols*rows).fill(-1),queue=new Int32Array(cols*rows);let head=0,tail=1;queue[0]=first;parent[first]=first;
  while(head<tail&&parent[last]<0){const id=queue[head++],x=id%cols,y=Math.floor(id/cols);for(const[dx,dy]of[[0,-1],[1,0],[0,1],[-1,0]]){const xx=x+dx,yy=y+dy;if(xx<1||yy<1||xx>=cols||yy>=rows)continue;const next=yy*cols+xx;if(parent[next]>=0||!clear(point(id),point(next)))continue;parent[next]=id;queue[tail++]=next}}
  if(parent[last]<0)return[];const path=[];for(let id=last;;id=parent[id]){path.push(point(id));if(id===first)break}path.reverse();path.push({...goal});
  const out=[];let from=start,index=0;while(index<path.length){let end=path.length-1;while(end>index&&!clear(from,path[end]))end--;out.push(path[end]);from=path[end];index=end+1}return out;
 }
 return{blocked,clear,route};
}

export const WORLD_POSE_KEY='xiguang-world-layout-v1';
export function readWorldPose(storage){try{storage??=globalThis.localStorage;const d=JSON.parse(storage.getItem(WORLD_POSE_KEY));return d?.version===1&&d.region==='rose-court'&&Number.isFinite(d.x)&&Number.isFinite(d.y)?{x:d.x,y:d.y}:null}catch{return null}}
export function writeWorldPose(p,storage){if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;try{storage??=globalThis.localStorage;storage.setItem(WORLD_POSE_KEY,JSON.stringify({version:1,region:'rose-court',x:p.x,y:p.y}));return true}catch{return false}}
