// A reusable density lease: local artwork can be crisp without moving legacy
// world coordinates or leaving an enlarged renderer behind on scene exit.
export function viewportLease(scene,density){
 const game=scene.sys.game,state=game.manorViewportLeases??={base:game.manorPixelScale||1,entries:[]},token={density};
 const apply=()=>{const h=scene.scale.gameSize.height/(game.manorPixelScale||1),next=state.entries.at(-1)?.density||state.base;game.manorPixelScale=next;scene.scale.setGameSize(Math.round(432*next),Math.round(h*next))};
 state.entries.push(token);apply();let released=false;
 return()=>{if(released)return;released=true;state.entries=state.entries.filter(v=>v!==token);apply()};
}
export const portraitViewport=scene=>viewportLease(scene,Math.min(2,Math.max(1,globalThis.devicePixelRatio||1)));
export const landscapeViewport=scene=>viewportLease(scene,1);
