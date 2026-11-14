import {painter} from './art.js';
import {ADVENTURE} from './adventure-config.js';
export {characterKey as outfitKey,preloadCharacters as preloadWardrobe,installCharacters as registerWardrobe} from './character-art.js';
import {characterPainting} from './character-art.js';
export function fashionPortrait(outfit,back=false){return characterPainting({wardrobe:{equipped:outfit.id}},{back})}
export function relicPortrait(relic){const p=painter(80,80),r=p.r;const q=ADVENTURE.qualities.find(q=>q.id===relic.quality),gold=q.color;p.circle(40,42,30,'#4d425d');for(let i=0;i<12;i++)r(8+(i*19)%65,6+(i*17)%65,1,1,'#bd9cbf');const poly=p.poly;if(relic.shape==='crown'){poly([[16,48],[14,27],[28,38],[40,18],[52,38],[66,27],[63,48]],gold);r(17,48,46,8,'#e7b86d');for(let x of[25,39,53]){r(x,44,4,5,'#e9a9bc');r(x+1,44,1,2,'#fff0c9')}r(20,55,40,2,'#fff0c9')}
 else if(['watch','clock'].includes(relic.shape)){p.circle(40,43,21,gold);p.circle(40,43,16,'#eaddc8');r(36,16,8,7,gold);r(39,31,2,14,'#806778');r(40,42,10,2,'#806778');for(let x of[28,50])r(x,42,2,2,gold);r(39,28,2,3,gold);r(39,55,2,3,gold);if(relic.shape==='clock')for(let i=0;i<7;i++)r(15+(i*17)%51,16+(i*13)%47,2,2,'#fff1bb')}
 else if(relic.shape==='bottle'){r(32,16,16,8,'#bd9b77');r(29,24,22,8,'#adc5ce');r(24,32,32,29,'#8facbc');r(28,35,23,21,'#c0c9d4');r(32,36,4,16,'#ecddd0');r(30,57,21,2,gold);p.circle(42,45,7,'#f4dfb5')}
 else if(relic.shape==='key'){p.circle(27,29,12,gold);p.circle(27,29,6,'#4d425d');poly([[33,35],[38,31],[61,55],[56,59]],gold);r(50,52,6,10,gold);r(58,55,6,9,gold)}
 else if(relic.shape==='bell'){poly([[22,51],[27,29],[34,24],[46,24],[53,30],[58,51]],gold);r(21,51,38,6,gold);p.circle(40,58,5,'#e5b67c');r(36,15,8,9,'#d2ac86');r(31,32,4,14,'#f9e7bc')}
 else if(relic.shape==='rose'){for(let i=0;i<7;i++){let a=i; p.circle(40+Math.cos(a)*9,33+Math.sin(a)*8,8,i%2?'#d6a3b7':'#edbdc8')}r(38,41,3,21,'#9eac8c');poly([[39,51],[23,42],[28,54],[40,56]],'#a4ba95');r(38,28,5,8,'#f4d3d0')}
 else{r(26,28,28,32,gold);r(29,31,22,26,'#73647d');r(33,36,14,18,'#f2d9ab');r(30,22,20,5,gold);r(36,15,8,7,gold);r(24,59,32,4,gold)}return p.canvas}
