// Input-only pixel checks: no texture readback in the drawing/update loop.
export function pickWorldInteraction(nodes,interactions,point,alphaAt){
 const parts=n=>[n.growth,n.emission,n.sprite].filter(s=>s&&s.visible!==false&&(s.alpha??1)>0);
 const ordered=nodes.slice().sort((a,b)=>Math.max(...parts(b).map(s=>s.depth))-Math.max(...parts(a).map(s=>s.depth)));
 for(const n of ordered){if(!parts(n).some(s=>s.getBounds().contains(point.x,point.y)&&alphaAt(s,point)>64))continue;const hit=interactions.find(i=>i.object===n.o.id);if(hit)return hit}
 return null;
}
