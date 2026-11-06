import {load,persist} from './save.js';
import {createSoundscape} from './soundscape.js';
export const startup={data:load(),gift:null,audioUnlocked:false};
startup.sound=createSoundscape(startup.data);
export const saveEarly=()=>persist(startup.data);
