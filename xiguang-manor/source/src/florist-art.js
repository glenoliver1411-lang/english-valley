import original from './assets/florist-original/original.jpg';
import counter from './assets/florist-original/counter.png';
import island from './assets/florist-original/island.png';
import rose from './assets/florist-original/rose-table.png';
import front from './assets/florist-original/front-flowers.png';
import left from './assets/florist-original/left-flowers.png';
import board from './assets/florist-original/board.png';
import meta from './assets/florist-original/layers.json';
const urls={counter,island,'rose-table':rose,'front-flowers':front,'left-flowers':left,board};
export function preloadFlorist(scene){if(!scene.textures.exists('florist-original'))scene.load.image('florist-original',original);for(const f of meta.frames)if(!scene.textures.exists('florist-cut-'+f.id))scene.load.image('florist-cut-'+f.id,urls[f.id])}
export function originalFloristArt(scene){
 const key='florist-original';scene.textures.get(key).setFilter(1);
 const base=scene.add.image(0,0,key).setOrigin(0).setDepth(-10);
 const layers=meta.frames.map(f=>{const key='florist-cut-'+f.id;scene.textures.get(key).setFilter(1);return{...f,image:scene.add.image(f.x,f.y,key).setOrigin(0).setDepth(10)}});
 return{base,layers};
}

export function floristArtReady(scene){return scene.textures.exists('florist-original')&&meta.frames.every(f=>scene.textures.exists('florist-cut-'+f.id))}
