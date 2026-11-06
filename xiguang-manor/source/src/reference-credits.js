import sources from './assets/reference/SOURCES.json';
import furniture from './assets/reference/originals/CREDITS-furniture.txt?raw';
import upholstery from './assets/reference/originals/CREDITS-upholstery.txt?raw';
import walls from './assets/reference/originals/CREDITS-walls.txt?raw';
import floors from './assets/reference/originals/CREDITS-floors.txt?raw';
import containers from './assets/reference/originals/CREDITS-container.txt?raw';

// Attribution is included in the offline JS graph; no remote service is needed.
const notices={'white-wood.png':furniture,'upholstery.png':upholstery,'walls.png':walls,'floors.png':floors,'container.png':containers};
export function showCredits(show,back){
 show('<article class="card journal"><button id="credits-back" class="icon-button corner" aria-label="返回庄园手记">×</button><span class="eyebrow">PIXELS & THEIR MAKERS</span><h2>美术来源与许可</h2><p>这一版家具、织物与石材改编自 Liberated Pixel Cup 素材。感谢每位像素艺术家。</p><p>裁切、重新配色与场景组合由本项目完成。新增组合图集按 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> 公开；原作者与许可如下。其他原有素材沿用原许可。</p><div id="art-notices"></div></article>');
 const root=document.querySelector('#art-notices');
 for(const [name,item]of Object.entries(sources.sources)){
  const section=document.createElement('details'),title=document.createElement('summary'),link=document.createElement('a'),pre=document.createElement('pre');
  title.textContent=`${name} · ${item.license}`;link.href=item.source;link.textContent='素材原页与作者';link.target='_blank';link.rel='noopener noreferrer';pre.textContent=notices[name];pre.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;text-align:left;font-size:12px;line-height:1.65';section.append(title,link,pre);root.append(section);
 }
 document.querySelector('#credits-back').onclick=back;
}
