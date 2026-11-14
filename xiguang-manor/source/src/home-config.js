import {PLAY} from './play-config.js';
// 家具、软装、花海与新增文案的统一配置。原有家具免费，新增六件以糖果兑换。
export const HOME={
 grid:8,wallZones:[{x:34,y:60,w:70,h:220},{x:328,y:60,w:70,h:220}],door:{x:216,y:798},
 text:{catalog:'家具与软装',note:'这些小小的家具，都已经为你准备好了。选一件，放在喜欢的地方。',newDecor:'新装饰',furniture:'免费家具',surfaces:'墙面与地板',placed:'已经摆好',place:'放进小屋',move:'挪个位置',store:'收进家具箱',done:'摆在这里',cancel:'取消',flip:'换个朝向',editing:'轻点地面或拖动家具，选择位置',valid:'这里刚刚好。',invalid:'这里有些拥挤，换个位置试试。',full:'小屋先留一点走路的空间，可以收起一件再添新的。',saved:'小屋记住了你喜欢的样子。',empty:'家具箱是满满的，房间可以慢慢布置。',allFree:'原有家具免费 · 新装饰可购买 · 自动保存',wallpaper:'墙面',floor:'地板',use:'和它待一会儿',turnOn:'亮起来',turnOff:'暂时关上',water:'给叶子一点水',watered:'叶尖留住了一点露水。',brew:'泡一壶热茶',tea:'热茶慢慢冒着香气，不必急着喝。',piano:'弹一小段旋律',pianoHint:'轻点琴键，给小屋留下一段自己的旋律。',sound:'开启音乐与琴声',soundHint:'音乐开关也会控制琴声。',vase:'花瓶里的花',vaseHint:'去花海采一束喜欢的花，回来就会在这里开放。',chooseBouquet:'换一束花',lit:'暖光轻轻亮起来了。',quiet:'就这样坐一会儿。',painting:'看看画里的风景',paintingLine:'一幅收藏花与星光的小画，可以翻转换个朝向。',shelf:'翻开收藏册',catBed:'让小猫来这里休息',catRest:'小猫找到了一块软软的地方。',sparkle:'一点点星光，落进了房间。'},
 walls:[{id:'original',name:'奶油木墙'},{id:'floral',name:'雾紫花枝'},{id:'gingham',name:'草莓格纹'}],
 floors:[{id:'original',name:'暖木地板'},{id:'herringbone',name:'蜂蜜鱼骨木'},{id:'pale',name:'月白木纹'}],
 items:[
  ...PLAY.goods.map(f=>f.type==='laceDrape'?{...f,layer:'wall'}:f),
  {type:'bed',name:'绣花床铺',desc:'松软的枕头，等一场好梦。',w:119,h:190,footW:102,footH:103,action:'rest'},
  {type:'sofa',name:'暖木沙发',desc:'坐在软垫上读一会儿书。',w:68,h:85,footW:57,footH:35,action:'sit'},
  {type:'desk',name:'窗边书桌',desc:'读一封留在庄园里的信。',w:156,h:76,footW:141,footH:23,action:'mail'},
  {type:'wardrobe',name:'花枝衣柜',desc:'换上今天喜欢的衣服。',w:74,h:119,footW:64,footH:30,action:'wardrobe'},
  {type:'bookcase',name:'暖木书柜',desc:'收藏每一次遇见的花。',w:84,h:116,footW:72,footH:30,action:'books'},
  {type:'fireplace',name:'暖灯壁炉',desc:'把一点暖意留在小屋里。',w:103,h:142,footW:91,footH:30,action:'hearth'},
  {type:'rug',name:'花纹地毯',desc:'铺在家具下面，也可以叠放。',w:188,h:132,footW:180,footH:117,layer:'rug'},
  {type:'floralWall',name:'花枝墙纸小画',desc:'挂在墙上的一片花影。',w:28,h:72,footW:28,footH:1,layer:'wall'},
  {type:'chair',name:'云朵阅读椅',desc:'坐下来，慢慢看一本书。',w:44,h:57,footW:36,footH:17,action:'sit'},
  {type:'tea',name:'花瓣茶桌',desc:'一壶会冒热气的花茶。',w:54,h:43,footW:44,footH:20,action:'tea'},
  {type:'lamp',name:'弯月落地灯',desc:'把一小弯月亮留在床边。',w:34,h:77,footW:22,footH:12,action:'light'},
  {type:'plant',name:'绣球绿植',desc:'叶子会回应轻轻的浇水。',w:42,h:60,footW:28,footH:15,action:'water'},
  {type:'vase',name:'花海小花架',desc:'放上你亲手带回来的花。',w:38,h:54,footW:28,footH:14,action:'bouquet'},
  {type:'piano',name:'奶油小钢琴',desc:'可以亲手弹奏的七个音。',w:66,h:58,footW:58,footH:23,action:'piano'},
  {type:'candles',name:'星屑烛台',desc:'烛光会在夜里轻轻呼吸。',w:30,h:43,footW:22,footH:12,action:'light'},
  {type:'record',name:'晚安留声机',desc:'转动唱片，听一小段旋律。',w:43,h:49,footW:34,footH:18,action:'record'},
  {type:'screen',name:'花枝屏风',desc:'一角半透的花影。',w:57,h:83,footW:48,footH:13,action:'sparkle'},
  {type:'cushion',name:'蝴蝶结坐垫',desc:'可以直接坐下的小角落。',w:38,h:22,footW:30,footH:14,action:'sit'},
  {type:'easel',name:'星夜小画架',desc:'画里藏着一片花海与月亮。',w:42,h:65,footW:30,footH:16,action:'painting'},
  {type:'catBed',name:'猫咪藤编篮',desc:'小猫可以自己来打盹。',w:49,h:29,footW:39,footH:18,action:'cat'}
 ],
 defaults:[{type:'tea',x:144,y:544},{type:'lamp',x:272,y:608,on:true},{type:'plant',x:368,y:752},{type:'vase',x:136,y:704},{type:'chair',x:72,y:704},{type:'candles',x:144,y:384,on:true}],
 largeDefaults:[{type:'fireplace',x:77,y:330,on:true},{type:'desk',x:216,y:330},{type:'bed',x:332,y:527},{type:'sofa',x:62,y:448},{type:'wardrobe',x:65,y:667},{type:'bookcase',x:365,y:684},{type:'rug',x:178,y:613}],
 access:[{x:216,y:798},{x:216,y:348}],
 notes:[261.63,293.66,329.63,349.23,392,440,493.88],noteNames:['Do','Re','Mi','Fa','Sol','La','Si']
};
export const MEADOW={
 title:'晚风花海',tag:'WHERE EVERY FLOWER WAITS FOR YOU',enter:'去花海走走',back:'回到秘密花园',note:'不必赶路，花海没有尽头一样的温柔。',pick:'采一束喜欢的花',picked:'这束花已经带回小屋的花瓶了。',bouquetNote:'喜欢哪一种颜色，就带一束回家。花海会一直盛开。',bench:'坐在花海里',picnic:'在野餐毯上歇一会儿',photo:'拍一张花海',view:'慢慢看花',gate:'通往晚风花海',returnHome:'带着花回小屋',petalLine:'晚风经过时，花瓣会绕着你轻轻转一圈。'
};
