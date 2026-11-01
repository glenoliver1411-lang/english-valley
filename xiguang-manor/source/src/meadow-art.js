import {paintV5Meadow} from './v5-landscape.js';
import {painter} from './art.js';
import {mix,skyPalette} from './sky-model.js';
import {MountainBackdrop} from './landscape-detail.js';
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export const meadowPath=y=>({x:214+Math.sin((y-310)*.009)*28,width:8+Math.max(0,y-310)*.095});
// Original soft-petal painting. Its restrained colors share the manor's palette;
// flowers are baked into three local textures rather than emitted as particles.
export function meadowPainting(hour){return paintV5Meadow(hour)}
