import {METEORS} from './meteor-config.js';
// 星空、昼夜、演出时长和所有新增文案。名字仍来自 config.js 的 recipient。
export const SCENERY={
 daySeconds:1200, meteorSeconds:METEORS.duration, sunriseSeconds:34,
 text:{
  lookout:'星光观景台',look:'坐下看星星',heading:'为你留了一整片星空',first:'{name}，听说有人把整片星空都送给了你。',hint:'轻触星星，留下名字与愿望。',constellation:'曦光花冠座',skyTag:'THE SKY, JUST FOR YOU',leave:'回到庄园',
  meteor:'流星雨之夜',startMeteor:'送我一场流星雨',replayMeteor:'送我一场流星雨',waitDawn:'等待日出',replayDawn:'曦光初升',skip:'跳过演出',meteorGift:'{name}，从今晚开始，\n这片星空都属于你。',goodMorning:'早安，{name}。\n今天的第一缕阳光，也属于你。',
  meteorPhases:METEORS.phases.map(p=>p.line),
  dawnPhases:['深夜 · 群星仍在守候','黎明前 · 东方泛起浅紫','破晓 · 云边染上金粉色','日出 · 第一缕阳光越过山峦','清晨 · 庄园慢慢醒来'],
  album:'星光与风景回忆册',albumNote:'不用赶时间。喜欢的风景，随时可以回来。',starBook:'星光图鉴',collection:'收藏这颗星',collected:'已收入图鉴',rename:'给星星取名',namePlaceholder:'写下一个名字（最多16字）',saveName:'记住这个名字',fixed:'这颗星的名字，是永远的「曦光星」。',undiscovered:'尚未发现',wish:'向星星许愿',wishPlaceholder:'想把什么愿望留在这里？（最多100字）',saveWish:'把愿望交给星星',wishSaved:'星星记住了你的愿望。',noWish:'你的愿望，可以慢慢想。',
  candy:'星星糖果',candyDesc:'最后一颗流星留下的纪念，永远留在庄园手记里。',takeCandy:'接住星星糖果',candyOwned:'星星糖果已收藏',candyLocked:'看过流星雨后，可以收藏这份纪念。',candyAvailable:'有一颗星星糖果，正在等你接住。',
  photo:'风景拍照',photoHint:'界面已隐藏。按钮稍后隐去；轻点画面唤回。也可直接用手机截屏。',savePhoto:'保存照片',photoReady:'长按下方照片，存储到相册；也可使用手机截屏。',photoFailed:'浏览器无法导出图片，请用手机系统截屏保存当前风景。',photoFile:'曦光庄园-风景',returnPhoto:'结束拍照',close:'关闭',
  time:'庄园时光',rest:'休息，换一段时光',morning:'清晨',day:'白天',dusk:'黄昏',night:'夜晚',timeNote:'庄园按自己的时间流动。也可以在这里休息到喜欢的时段。',reduced:'减少粒子与光效',reducedNote:'适合低性能手机；演出和收藏内容完整保留。',normalQuality:'细腻光影',lowQuality:'轻盈光影',remember:'风景回忆',goLookout:'前往观景台',discover:'新风景 · 池塘东南侧有一架望远镜',chapterDawn:'旧日的祝福 · 第一章日出',nameSaved:'星星记住了你给它的名字。',emptyName:'名字可以留给下一次的灵感。',seated:'坐在长椅上，让时间慢一点。',viewNight:'观星时会暂时来到夜晚，回庄园后恢复原来的时光。',
  starsCount:'已收藏 {count} / {total} 颗星',starNameLabel:'星星的名字',wishLabel:'留给星星的愿望',quality:'画面设置',photoAlt:'曦光庄园的像素风景照片',back:'返回',resumeSky:'继续看天空',skyMemory:'星空里的小小纪念',candyAction:'拾起流星的礼物',
 },
 stars:[
  {id:'xi',name:'曦光星',x:.52,y:.32,fixed:true,description:'花冠正中的光。不管在哪个季节抬头，它都会把最温柔的亮，留给{name}。'},
  {id:'petal',name:'花瓣星',x:.32,y:.26,description:'它收集花田里飘落的花瓣，编成一顶只属于你的花冠。'},
  {id:'moon',name:'月眠星',x:.20,y:.40,description:'等小猫睡着以后，它会替月亮守着甜甜的梦。'},
  {id:'sugar',name:'糖霜星',x:.40,y:.48,description:'像糖果屋屋顶的一点糖霜，偷偷甜了一整片夜空。'},
  {id:'wish',name:'心愿星',x:.65,y:.48,description:'听见愿望以后，它会悄悄亮一下。你可以把这颗星叫作喜欢的名字。'},
  {id:'wind',name:'晚风星',x:.79,y:.35,description:'从遥远的山谷带来晚风，也带来一声轻轻的晚安。'},
  {id:'dawn',name:'晨露星',x:.71,y:.20,description:'在太阳醒来以前，它替花儿准备第一滴露水。'}
 ],
 links:[[2,1],[1,0],[0,6],[6,5],[5,4],[4,3],[3,2],[3,0],[0,4]],
 hours:{morning:6.8,day:12,dusk:18,night:22},
};
export const ST=SCENERY.text;
