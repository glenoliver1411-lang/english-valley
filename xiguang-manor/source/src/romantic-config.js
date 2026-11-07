import {FLOWERS} from './flower-catalog.js';
// V4 风景、房间、花园与文字的统一配置；收礼人通过 fmt 的 {name} 修改。
export const ROMANCE = {
  wander:'去逛逛 · 花海与小屋', photo:'风景拍照', title: '属于你的浪漫世界', version: 'V4.0 · A WORLD THAT BREATHES',
  garden: '林间秘密花园', cabin: '{name}的小屋', lake: '黄昏湖畔',
  enterGarden: '穿过花拱门', enterCabin: '推开小屋的门', lakeSit: '静静看一会儿',
  treeLine: '愿你经过的每一个季节，都有花为你盛开。',
  gardenLine: '这里的花开得很慢，不必着急。',
  homeLine: '你不必做些什么，这里本来就是送给你的。',
  tree: '轻触树干', swing: '坐上秋千', leave: '回到庄园', endQuiet: '起身，继续散步',
  gardenTag: 'A SECRET AMONG THE LEAVES', cabinTag: 'A LIGHT LEFT ON FOR YOU',
  plant: '选一朵喜欢的花', water: '浇一点水', harvest: '采下这朵花', growing: '花正在慢慢长大',
  seedNote: '种下后轻轻浇水。小苗约二十秒舒展，一分钟后开花，离开也会继续生长。',
  watered: '水珠留在叶子上了。', picked: '花儿已夹进收藏册，这里又能种一朵花。',
  flowerBook: '花与秘密收藏', flowerEmpty: '散步时遇见的花与秘密，会留在这里。',
  gift: '窗边的小礼物', star: '{name}的星星', giftLine: '一颗可以带回房间，也可以挂回天空的星星。',
  openGift: '解开缎带', starRoom: '放在房间里', starSky: '挂回星空', starPlaced: '星星已经在你喜欢的地方亮起。',
  room: '布置小屋', roomNote: '换一块地毯、一盏灯与床上的颜色，让小屋慢慢像你。',
  rest: '躺下休息', seat: '在窗前坐一会儿', wardrobe: '打开衣橱', shelf: '翻看收藏', mailbox: '打开信箱',
  roof: '去屋顶等日出', windowDawn: '在窗前等日出', lakeDawn: '在湖畔等日出',
  weather: '窗外的天气', clear: '晴天', rain: '细雨', snow: '薄雪',
  cat: '和小猫待一会儿', catName: '给小猫取名', catFollow: '一起散步', catStay: '让它自由休息',
  catFollowed: '小猫轻轻跟了上来。', catRested: '它会在喜欢的地方打个盹。', catSaved: '小猫记住了这个名字。',
  pet: '摸摸脑袋', petLine: '{cat}轻轻闭上眼睛。', save: '记住', close: '关上',
  wishes: '留给这颗星的私语', wishSaved: '星光悄悄收好了。',
  quietSky: '收起界面，慢慢看', quietNote: '今晚的星星很多，你可以慢慢看。',
  reducedMotion: '静止风景模式', motionNote: '停止草木、天气与镜头晃动；需要时仍可主动播放演出。',
  secrets: {
    hollow: {name:'树洞里的信', line:'不必记得回来的时间。这里的灯，会一直亮着。'},
    grass: {name:'落在草地的星星', line:'它没有迷路，只是想离你近一点。'},
    candy: {name:'花丛里的糖', line:'一颗莓果糖，沾着花瓣的香气。'},
    rainbow: {name:'雨后的彩虹', line:'雨停以后，世界轻轻换了一种颜色。'},
    moon: {name:'湖水里的月亮', line:'月亮落在水里，晚风替它折起细碎的光。'}
  },
  flowers:FLOWERS,
  themes:[{id:'rose',name:'草莓晚安',rug:'#c899af',bed:'#e7b1c2'}, {id:'lavender',name:'月光小憩',rug:'#9f91ba',bed:'#beb0d8'}, {id:'cream',name:'奶油清晨',rug:'#c4ad8c',bed:'#ecd2a9'}]
};
