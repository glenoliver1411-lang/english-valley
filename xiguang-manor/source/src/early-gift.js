import {saveProtection} from './save.js';
import './style.css';
import './gift.css';
import './mobile-experience.css';
import {renderShell} from './app-shell.js';
import {GiftOpening} from './gift-opening.js';
import {startup,saveEarly} from './startup-session.js';
import {bootStatus} from './boot-status.js';
export function earlyGift(){
  if(saveProtection().blocked||startup.data.accepted||new URL(location.href).searchParams.get('return')==='meadow')return;
  renderShell();
  const gesture=()=>{startup.audioUnlocked=true;startup.sound.resume()};
  startup.gift=new GiftOpening({ready:false},startup.data,{
    save:saveEarly,close:()=>{},block:()=>{},isModal:()=>false,gesture,
    music:()=>{gesture();startup.sound.enabled();saveEarly()}
  });
  startup.gift.start();bootStatus('gift',.1);
}
