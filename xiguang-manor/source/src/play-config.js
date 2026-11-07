import {FLOWERS} from './flower-catalog.js';
// 本轮玩法、价格、尺寸、规则与文案集中在这里；角色名字沿用 config.js。
export const PLAY={
 flowers:FLOWERS,
 wraps:[{id:'cream',name:'奶油花笺',bonus:3,color:'#e8cfac'},{id:'rose',name:'草莓来信',bonus:5,color:'#deb0be'},{id:'night',name:'星夜丝带',bonus:7,color:'#9790b8'}],
 goods:[
  {type:'berryLamp',name:'草莓小台灯',price:18,desc:'磨砂草莓灯罩、黄铜灯座。轻触点亮一角暖光。',w:34,h:49,footW:24,footH:14,action:'light'},
  {type:'starProjector',name:'星空投影灯',price:32,desc:'玻璃小星球，会把星座投在小屋地板上。',w:40,h:52,footW:28,footH:16,action:'projector'},
  {type:'laceDrape',name:'蕾丝窗帘',price:24,desc:'自带黄铜帘架，摆在窗边；轻触打开或垂下花边。',w:54,h:91,footW:42,footH:14,action:'curtain'},
  {type:'vintageSofa',name:'复古小沙发',price:38,desc:'绒面扶手、绗缝靠背和卷边木脚。可以坐下。',w:68,h:57,footW:58,footH:23,action:'sit'},
  {type:'flowerSwing',name:'花海秋千',price:44,desc:'花藤缠绕的落地秋千，可在小屋角落轻轻摇晃。',w:66,h:98,footW:48,footH:18,action:'sit'},
  {type:'glassCabinet',name:'精致玻璃花柜',price:48,desc:'三层玻璃、铜质合页和一柜小花。轻触点亮展示灯。',w:54,h:83,footW:40,footH:18,action:'flowers'}
 ],
 text:{shop:'晚风花铺',tag:'FLOWERS, WRAPPED IN A LITTLE WIND',intro:'采来的花，既可以留给自己，也可以换成糖果。',enter:'去晚风花铺',leave:'回到庄园',stock:'鲜花库存',wrap:'包装花束',bouquets:'花束与收藏',decor:'家具与装饰',harvest:'采下一朵',harvestNote:'每次采下的花都会进入库存。花海会一直盛开；图鉴只记录发现，不会被出售清空。',picked:'鲜花已放进库存。可以带到晚风花铺包装。',cooldown:'给花枝一点时间，再轻轻采一朵。',sellOne:'出售 1 朵',empty:'还没有鲜花。去花海采花，或收获亲手种下的花。',balance:'糖果',bag:'可用鲜花',collectNote:'图鉴记住曾经遇见的花；这里记录真正能使用的数量。',choose:'选 3 朵花',chooseNote:'轻点鲜花加入花束，点花槽可以取回。包装会消耗选中的 3 朵花。',make:'系好丝带，完成花束',needThree:'选满 3 朵，再为它们系上丝带。',notStock:'库存不够了，请重新选择。',made:'花束包装好了',sellBouquet:'出售花束',keepBouquet:'收进花束收藏',homeBouquet:'放进小屋花瓶',returnBouquet:'收回到花铺',sold:'已售出',kept:'已收藏',home:'正在小屋展示',stocked:'待售花束',noBouquet:'还没有包装过花束。选三朵喜欢的花试试吧。',saved:'这笔小小的交易已经保存。',saveFailed:'没能保存，这次操作已撤回；原来的物品和糖果还在。',buy:'购买并永久拥有',owned:'永久拥有 · 可以摆放',short:'糖果还不够。卖一束花，慢慢布置也很好。',free:'原有家具仍然全部免费',storeNote:'买下以后，随时在小屋「布置小屋 → 新装饰」摆放、转向或收起。',newDecor:'新装饰',arranged:'这束花已经放进小屋花瓶。',back:'返回',close:'关闭',packAgain:'再包一束',trades:'花铺交易和探险结算立即保存，不随「不保存本次」撤销。',equipment:'随身装备',equip:'装备',unequip:'卸下',noEquipment:'安全带回的花冠、胸针、守夜灯和猫铃，都能在这里装备。'}
};
export const EXPLORE={
 floors:3,chests:3,height:1920,speed:92,channel:2.4,damageCooldown:2.4,
 text:{title:'月影遗迹 · 深入与归途',enter:'开始一局探索',resume:'继续未撤离的一局',rules:'三层遗迹，每层路线和宝箱位置会变化。宝物先进入本局背包，走到撤离石阶才会安全入库。',duration:'完整探索约 5–8 分钟；可随时回入口提前安全撤离，无体力、无入场费。',suspend:'关闭页面、刷新或保存退出会保留本局，回来继续；不会自动把临时战利品变成永久物品。',risk:'灯火失稳或主动放弃时，每件本局战利品独立抽取，保留概率在 30%–70% 之间。永久宝物、衣服和家具不受损失。',bag:'本局战利品',permanent:'永久收藏',temporary:'尚未撤离',empty:'背包还空着。先点亮提灯，再找一只宝箱。',exit:'安全撤离石阶',walkExit:'走向出口并安全撤离',extract:'带着战利品安全撤离',far:'先走到石阶旁边，再安全撤离。',abandon:'放弃本局并返回',confirmAbandon:'确定放弃本局吗？只会按失败规则结算临时战利品，已安全带回的收藏不会减少。',continue:'继续探索',leave:'返回庄园',succeeded:'星光已经安全带回',failed:'灯火暗了，月影把你送回庄园',kept:'安全留下',lost:'留在遗迹',settled:'本局已结算，不能再次领取。',next:'通往下一层',last:'深处的归途',locked:'前方石门需要解开本层星纹机关。',puzzle:'星纹机关',puzzleNote:'先用「提灯照影」看清顺序，再依次触摸三个星纹。',puzzleDark:'石纹有些模糊。先用提灯照影。',puzzleDone:'石门缓缓打开，附近的危险光纹安静了。',puzzleWrong:'顺序偏了一点，灯火紧张度增加 8。可以重新尝试。',hazard:'光纹正在蓄力，先等一等，或用月影穿行。',hit:'光纹擦过了提灯。靠边歇一歇，也可以先撤离。',open:'正在解开箱扣…',found:'已收入本局背包，撤离后才会永久拥有。',room:'层',alert:'灯火紧张度',all:'本层宝箱都已找到。可以继续深入，或带着收获回家。',frozen:'保存尚未成功，探索已暂停。重试保存后再继续。',retry:'重试保存',settlementNote:'本局只能结算一次。永久收藏、已买家具与衣服都完整保留。',ratio:'本次每件战利品的保留概率',glyphs:['月','花','星'],step:'星纹顺序',portal:'解开本层机关后可继续深入。',lootTitle:'箱扣打开了',suspendExit:'保存并休息 · 回来继续本局',exitNote:'正在探索：退出只会暂停本局，不会自动撤离。战利品已按每次拾取即时保存。'}
};
