import original from './assets/scenes/florist/florist_original_concept.png';
import counter from './assets/scenes/florist/counter.png';
import island from './assets/scenes/florist/island.png';
import rose from './assets/scenes/florist/rose-table.png';
import front from './assets/scenes/florist/front-flowers.png';
import left from './assets/scenes/florist/left-flowers.png';
import board from './assets/scenes/florist/board.png';
import meta from './assets/scenes/florist/layers.json';
const urls={counter,island,'rose-table':rose,'front-flowers':front,'left-flowers':left,board};
export function preloadFlorist(scene){if(!scene.textures.exists('florist-original'))scene.load.image('florist-original',original);for(const f of meta.frames)if(!scene.textures.exists('florist-cut-'+f.id))scene.load.image('florist-cut-'+f.id,urls[f.id])}
export function originalFloristArt(scene){
 const key='florist-original';scene.textures.get(key).setFilter(1);
 const base=scene.add.image(0,0,key).setOrigin(0).setScale(meta.worldScale).setDepth(-10);
 const layers=meta.frames.map(f=>{const key='florist-cut-'+f.id;scene.textures.get(key).setFilter(1);return{...f,image:scene.add.image(f.x,f.y,key).setOrigin(0).setScale(meta.worldScale).setDepth(10)}});
 return{base,layers};
}

export function floristArtReady(scene){return scene.textures.exists('florist-original')&&meta.frames.every(f=>scene.textures.exists('florist-cut-'+f.id))}
