import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';

const engine=process.argv.includes('--webkit')?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN||undefined}:{args:['--no-sandbox']})});
try{
  const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{
    if(!localStorage.getItem('xiguang-manor-v1'))localStorage.setItem('xiguang-manor-v1',JSON.stringify({version:1,accepted:true,completed:true,stage:5,candies:31,catName:'奶盖',favorite:'lavender',position:{x:88,y:588},romance:{reducedMotion:true},scenery:{clock:22,visited:true,names:{petal:'晚风'}}}));
    localStorage.setItem('xiguang-world-atmosphere-v1',JSON.stringify({autoShows:false,aurora:false}));
  });
  await p.goto('http://localhost:5173');await p.click('#skip-return');await p.waitForFunction(()=>!__manor.session.returning);
  const layers=await p.evaluate(()=>{
    const s=__manor.scene,e=s.environment,front=s.baseMap.texture.getSourceImage(),alpha=front.getContext('2d').getImageData(0,0,432,100).data;
    return{sky:e.skyCanvas.height,behind:s.world.getIndex(e.sky)<s.world.getIndex(s.baseMap)&&s.world.getIndex(e.sky)<s.world.getIndex(e.blend),opaqueTop:Array.from(alpha).filter((v,i)=>i%4===3&&v>0).length};
  });
  assert.equal(layers.sky,190);assert.equal(layers.behind,true,'sky must be behind the entire foreground, including tree crowns');assert.equal(layers.opaqueTop,0,'foreground may not cover mountain tips with an opaque sky rectangle');
  const haze=await p.evaluate(async()=>{
    const {bindToSky}=await import('/src/scenery-grounding.js');
    const c=document.createElement('canvas');c.width=c.height=40;const g=c.getContext('2d');g.fillStyle='#888';g.beginPath();g.moveTo(5,38);g.lineTo(19,3);g.lineTo(35,38);g.fill();
    const before=g.getImageData(0,0,40,40).data.slice();bindToSky(c,'dawn',{far:true});const after=g.getImageData(0,0,40,40).data;
    let alphaChanges=0,colorChanges=0;for(let i=0;i<before.length;i+=4){if(before[i+3]!==after[i+3])alphaChanges++;if(before[i]!==after[i])colorChanges++}return{alphaChanges,colorChanges};
  });
  assert.equal(haze.alphaChanges,0,'atmospheric haze must not fill the transparent sky around a ridge');assert.ok(haze.colorChanges>100);
  await p.evaluate(()=>__manor.scenery.enter(null,false,'lake'));await p.waitForFunction(()=>__manor.scenery.view?.lakeArt);
  const contacts=await p.evaluate(async()=>{
    const {drawGroundedTree}=await import('/src/scenery-grounding.js'),{v5Frame}=await import('/src/v5-assets.js');
    return ['nature-oak','nature-rowan'].map(name=>{
      const original=v5Frame(name,{period:'dawn'}),c=document.createElement('canvas');c.width=120;c.height=160;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
      const p=drawGroundedTree(g,original,{left:25,top:10,width:60,height:83,groundY:130,period:'dawn'});
      let brokenRows=0;
      // Check actual trunk pixels, excluding contact shadow and grass. Every
      // scanline from the old bottom through the new root must be connected.
      for(let y=94;y<127;y++){
        const row=g.getImageData(Math.round(p.rootX)-7,y,15,1).data;
        if(!Array.from(row).some((a,i)=>i%4===3&&a>150))brokenRows++;
      }
      return{name,brokenRows};
    });
  });
  assert.ok(contacts.every(v=>v.brokenRows===0),'rendered trunks must connect continuously to their roots');
  // Existing lake photo export and responsive framing still work after roots move.
  for(const viewport of [{width:375,height:667},{width:430,height:932}]){
    await p.setViewportSize(viewport);await p.waitForTimeout(180);assert.ok(await p.locator('#leave-sky').isVisible());
    await p.click('#sky-photo');await p.click('#save-landscape');await p.waitForFunction(()=>document.querySelector('#landscape-preview')?.naturalWidth===864);await p.click('#scenery-close');await p.click('#end-photo');
  }
  await p.click('#leave-sky');await p.reload();await p.click('#skip-return');await p.waitForFunction(()=>!__manor.session.returning);
  const saved=await p.evaluate(()=>__manor.data);assert.equal(saved.candies,31);assert.equal(saved.catName,'奶盖');assert.equal(saved.favorite,'lavender');assert.equal(saved.scenery.names.petal,'晚风');assert.deepEqual(errors,[]);
  console.log(JSON.stringify({engine:engine.name(),layers,haze,contacts,passed:'unclipped skyline, transparent foreground, haze alpha preservation, connected tree roots, two mobile sizes, 864px photo and old progress',errors}));
}finally{await browser.close()}
