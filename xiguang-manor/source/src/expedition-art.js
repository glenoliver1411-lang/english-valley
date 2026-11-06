import {playFrame} from './play-assets.js';
import {EXPLORE as C} from './play-config.js';
export function paintExpedition(layout,room){const canvas=document.createElement('canvas');canvas.width=432;canvas.height=C.height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#263748';c.fillRect(0,0,432,C.height);for(let y=140;y<C.height-40;y+=32)for(let x=32;x<400;x+=32)c.drawImage(playFrame('ruins-floor-'+((x/32+y/32+room)%3|0)),x,y);const wall=playFrame('ruins-wall'),pillar=playFrame('ruins-pillar');
 for(const w of layout.walls){for(const [a,b]of [[28,w.gap-32],[w.gap+32,404]]){c.save();c.beginPath();c.rect(a,w.y-35,b-a,61);c.clip();for(let x=a;x<b;x+=88)c.drawImage(wall,x,w.y-35);c.restore()}c.drawImage(pillar,w.gap-58,w.y-66,30,83);c.drawImage(pillar,w.gap+28,w.y-66,30,83)}
 for(let y=170;y<C.height-80;y+=190){c.drawImage(pillar,14,y,29,79);c.drawImage(pillar,390,y+40,29,79)}
 for(let i=0;i<24;i++){const x=i%2?366:49,y=210+i*67;const f=playFrame('flower-'+['glow','aster','lily'][i%3]);c.globalAlpha=.65;c.drawImage(f,x,y,16,25)}c.globalAlpha=1;
 for(const p of layout.pillars)c.drawImage(pillar,p.x-16,p.y-70);c.drawImage(playFrame('ruins-stairs'),layout.exit.x-45,layout.exit.y-20);c.drawImage(playFrame('ruins-mechanism'),layout.puzzle.x-38,layout.puzzle.y-68);c.drawImage(playFrame('ruins-portal'),layout.portal.x-42,layout.portal.y-100);return canvas}
