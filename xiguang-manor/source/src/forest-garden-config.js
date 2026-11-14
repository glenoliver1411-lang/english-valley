// Illustration-native coordinates in the existing 432×850 retreat world.
// Bed indexes, secret IDs and exits keep their save meanings; only scene geometry changes.
export const FOREST_GARDEN={
 width:432,height:850,source:[887,1774],
 tree:{x:213,y:319,stand:{x:215,y:355},polygon:[[118,323],[155,301],[207,287],[241,298],[254,319],[234,337],[177,339],[140,333]]},
 pond:{x:368,y:329,stand:{x:302,y:369},polygon:[[285,290],[318,279],[379,280],[431,300],[431,350],[395,373],[334,371],[288,350],[269,320]]},
 beds:[{x:75,y:409},{x:160,y:420},{x:64,y:461},{x:154,y:472},{x:67,y:516},{x:160,y:530}],
 swing:{x:370,y:480,stand:{x:358,y:520},anchor:{x:370.15,y:404.24}},
 secrets:[{id:'hollow',x:230,y:252,stand:{x:263,y:339}},{id:'grass',x:333,y:718,stand:{x:311,y:720}},{id:'candy',x:40,y:648,stand:{x:84,y:665}}],
 meadow:{x:374,y:659,stand:{x:358,y:689}},exit:{x:216,y:799},
 text:{title:'林间秘密花园',menu:'花园小记',light:'林间的光',back:'离开花园',timeNote:'阳光、树影和池塘，会一起随着时光变化。'}
};
export function insidePolygon(x,y,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++)if((polygon[i][1]>y)!==(polygon[j][1]>y)&&x<(polygon[j][0]-polygon[i][0])*(y-polygon[i][1])/(polygon[j][1]-polygon[i][1])+polygon[i][0])inside=!inside;return inside}
export function gardenBlocked(x,y){const g=FOREST_GARDEN;if(x<40||x>398||y<290||y>811)return true;if(insidePolygon(x,y,g.tree.polygon)||insidePolygon(x,y,g.pond.polygon))return true;
 if(g.beds.some(b=>x>b.x-35&&x<b.x+35&&y>b.y-15&&y<b.y+25))return true;
 if(((x-58)/26)**2+((y-727)/15)**2<1||((x-360)/32)**2+((y-735)/20)**2<1)return true;
 // Swing posts are solid, its quiet nook and the forest gate remain walkable.
 if(x>320&&x<334&&y>405&&y<510||x>411&&y>395&&y<518)return true;
 return false;
}
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
export function forestPeriod(hour){const h=((hour%24)+24)%24;if(h<4.8||h>=20)return['night','night',0];if(h<6.2)return['night','morning',smooth((h-4.8)/1.4)];if(h<9.5)return['morning','morning',0];if(h<11)return['morning','day',smooth((h-9.5)/1.5)];if(h<16)return['day','day',0];if(h<18)return['day','dusk',smooth((h-16)/2)];return['dusk','night',smooth((h-18)/2)]}
