import {setPlayerProfile} from './config.js';
import {load,persist} from './save.js';
import {createSoundscape} from './soundscape.js';
export const startup={data:load(),gift:null,audioUnlocked:false};
setPlayerProfile(startup.data);
startup.sound=createSoundscape(startup.data);
export const saveEarly=()=>persist(startup.data);
