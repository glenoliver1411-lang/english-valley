// A reusable density lease: local artwork can be crisp without moving legacy
// world coordinates or leaving an enlarged renderer behind on scene exit.
export function portraitViewport(scene){
 const game=scene.sys.game,previous=game.manorPixelScale||1,h=scene.scale.gameSize.height/previous;
 game.manorPixelScale=Math.min(2,Math.max(1,globalThis.devicePixelRatio||1));
 scene.scale.setGameSize(Math.round(432*game.manorPixelScale),Math.round(h*game.manorPixelScale));
 let released=false;return()=>{if(released)return;released=true;const height=scene.scale.gameSize.height/(game.manorPixelScale||1);game.manorPixelScale=previous;scene.scale.setGameSize(Math.round(432*previous),Math.round(height*previous))};
}
