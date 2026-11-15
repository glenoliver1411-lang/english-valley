import {saveProtection} from './save.js';
import './style.css';
import './gift.css';
import './mobile-experience.css';
import {renderShell} from './app-shell.js';
import {OwnerEditor} from './identity-ui.js';
import {startup} from './startup-session.js';
import {bootStatus} from './boot-status.js';
// The gift remains a journal memory. New life-game players create an owner,
// independently of Phaser, and can enter with the default look at any point.
export function earlyGift(){
 if(saveProtection().blocked||startup.data.identity.created)return;
 renderShell();startup.creation=new Promise(resolve=>{startup.creator=new OwnerEditor(startup.data,{first:true,done:saved=>{startup.creator=null;resolve(saved)}})});bootStatus('gift',.1);
}
