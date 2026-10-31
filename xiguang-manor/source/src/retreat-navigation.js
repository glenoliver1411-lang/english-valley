// A small, bounded walk grid for the cabin/garden only. No world or save changes.
export function retreatRoute(start,goal,blocked){
 const step=8,minX=40,minY=290,cols=45,rows=66,size=cols*rows;
 const point=id=>({x:minX+(id%cols)*step,y:minY+Math.floor(id/cols)*step});
 const clear=(a,b)=>{const count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3));for(let i=0;i<=count;i++)if(blocked(a.x+(b.x-a.x)*i/count,a.y+(b.y-a.y)*i/count))return false;return true};
 if(blocked(start.x,start.y)||blocked(goal.x,goal.y))return [];
 if(clear(start,goal))return [{...goal}];
 const closest=p=>{let found=-1,distance=Infinity;const cx=Math.round((p.x-minX)/step),cy=Math.round((p.y-minY)/step);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=cx+dx,y=cy+dy;if(x<0||x>=cols||y<0||y>=rows)continue;const id=y*cols+x,q=point(id),d=Math.hypot(p.x-q.x,p.y-q.y);if(d<distance&&clear(p,q)){found=id;distance=d}}return found};
 const first=closest(start),last=closest(goal);if(first<0||last<0)return [];
 const parent=new Int32Array(size).fill(-1),queue=new Int32Array(size);let head=0,tail=1;queue[0]=first;parent[first]=first;
 while(head<tail&&parent[last]<0){const id=queue[head++],x=id%cols,y=Math.floor(id/cols),a=point(id);for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const nx=x+dx,ny=y+dy;if(nx<0||nx>=cols||ny<0||ny>=rows)continue;const next=ny*cols+nx;if(parent[next]>=0||!clear(a,point(next)))continue;parent[next]=id;queue[tail++]=next}}
 if(parent[last]<0)return [];
 const path=[];for(let id=last;;id=parent[id]){path.push(point(id));if(id===first)break}path.reverse();path.push({...goal});
 // Use the farthest visible waypoint, so furniture detours do not look like grid walking.
 const route=[];let from=start,index=0;while(index<path.length){let end=path.length-1;while(end>index&&!clear(from,path[end]))end--;route.push(path[end]);from=path[end];index=end+1}return route;
}
