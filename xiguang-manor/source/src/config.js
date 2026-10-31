// 修改这里即可更换收礼物的人、所有游戏文案与糖果选项。
export const CONFIG = {
  recipient: '小曦', title: '曦光庄园', subtitle: '万圣夜的礼物', edition: 'V4.0 · A LITTLE WORLD FOR YOU',
  letter: '你的名字好美，所以我送给你一座庄园。\n今天是万圣节，\n我在里面偷偷放了好多糖果。\n晚风、花园，还有一只陪你的猫。\n这里的一切都属于你。\n希望你会喜欢这个小小的世界。',
  ending: '{name}，万圣节快乐！\n这座庄园是送给你的礼物。\n什么时候想来玩，都欢迎你。\n希望你每天都开开心心。',
  ui: {
    dedication:'一份只属于{name}的礼物', letterTag:'TO MY DEAREST', salutation:'亲爱的{name}：', signature:'把月光与甜蜜，都送给你', accept:'接收庄园', resume:'回到我的庄园', letterTitle:'一封悄悄写给你的信', saved:'心意已悄悄保存', saveError:'浏览器暂时无法保存，请保持本页打开',
    musicOn:'关闭音乐',musicOff:'开启音乐', memories:'庄园手记', close:'关闭', interact:'互动', move:'摇杆移动 · 点物件互动', chapter:'第一章 · 万圣夜的礼物', free:'月光日常 · 永久开放', welcome:'曦光庄园 · 欢迎{name}', skip:'轻点继续', next:'继续',
    candyCount:'糖果', magicCount:'魔法糖', taskLabel:'今晚的小小心愿', room:'月光糖果屋', shopDesc:'每一颗糖，都是一种甜蜜的心情。', choose:'选这一颗', chosen:'你喜欢的甜蜜，已经记住啦。', exitShop:'走出糖果屋',
    catTitle:'给小猫一个熟悉的名字', catDesc:'可以填现实中猫咪的名字，也可以让它继续叫「月饼」。', catPlaceholder:'猫咪的名字（可选）', catSave:'记住这个名字', catSkip:'就叫月饼吧', pet:'轻轻摸摸', catDefault:'月饼',
    journalTitle:'属于你的庄园手记', journalDesc:'所有小小的喜欢，都留在这台设备里。', favorite:'最喜欢的糖', noFavorite:'还在等你挑选', catName:'庭院里的猫', flowers:'盛开的花', replayLetter:'再读一遍信', replayEnding:'再看一次日出', continue:'继续逛逛', completed:'第一章已完成', pending:'故事正在慢慢发生', resetMove:'回到庄园门口',
    ghost:'南瓜小幽灵', shop:'糖果屋', cat:'魔女猫咪', tree:'曦光树', garden:'月光花田', pond:'星星池塘', gate:'庄园大门', magical:'魔法糖', seed:'种一朵花', water:'给花浇水', bloom:'看看花儿', pickup:'收集糖果', offer:'放下三颗魔法糖', home:'这里永远为你留着一盏灯',
    seedToast:'种下一颗小心愿，再浇一点水吧。',waterToast:'小花喝饱水啦，过一会儿就会开放。',bloomToast:'这朵花为你开放。可以重新种一朵啦。',sweetToast:'捡到一颗糖！过一会儿还会出现。',magicToast:'找到一颗魔法糖，月光更亮了一点。',petToast:'{cat}眯起眼睛，把脑袋轻轻蹭向你的手。',offering:'把甜蜜交给黎明……', dawn:'愿你的每一天，都有光。', sky:'月亮先替我，照看这个小世界。', loading:'正在点亮庄园里的灯……'
  },
  tasks:['和门口的小幽灵打个招呼','去糖果屋挑一颗喜欢的糖','到庭院认识魔女小猫','找到藏在庄园里的三颗魔法糖','把魔法糖带到曦光树下','种花、摸猫，慢慢享受你的庄园'],
  dialogue: {
    welcome:['呀，你终于来啦，{name}！我差一点就把欢迎词忘光了。','这座庄园，是专门送给你的。连天上的星星，都偷偷练习过怎样欢迎你。','先沿着小路去糖果屋吧。挑一颗喜欢的糖，然后认识庭院里的小猫。今晚可以慢慢来。'],
    ghostAgain:['我是这里的南瓜管家！虽然偶尔会迷路，但一定会照看好你的庄园。','三颗魔法糖分别藏在花田旁、池塘边，还有曦光树的左边。跟着闪光找找吧。'],
    shop:['欢迎来到月光糖果屋。这里的糖果不用买，选你最喜欢的一颗就好。'],
    cat:['嘘……这位戴帽子的小居民，好像已经等你很久了。','伸出手，它就会靠过来。你也可以给它一个熟悉的名字。'],
    treasure:['小猫替你找到了一张寻宝纸条！','「花田旁一颗，池塘边一颗，曦光树左边一颗。把三颗魔法糖交给树，天就会为你亮起来。」'],
    treeWait:['曦光树正在等三颗魔法糖。它说：甜蜜积攒够了，黎明就会到来。'],
    treeEarly:['这棵树把最温柔的黎明藏在枝叶间。先去听听小幽灵准备的欢迎词吧。'],
    finished:['庄园里的万圣夜永远不会结束。糖果会再长出来，花儿会再次开放。','你随时可以回来。这里一直属于你，{name}。']
  },
  candies:[{id:'strawberry',name:'草莓月亮糖',note:'把粉色的好心情含在嘴里',color:'#ed9caf',pixel:'pink'},{id:'pumpkin',name:'奶油南瓜糖',note:'像被秋天温柔地抱了一下',color:'#f2be83',pixel:'orange'},{id:'lavender',name:'薰衣草星星糖',note:'做一个柔软又香甜的梦',color:'#beb0e1',pixel:'purple'}]
};
export const fmt = (s, extra={}) => s.replace(/\{(\w+)\}/g, (_,k)=>({name:CONFIG.recipient,...extra}[k] ?? ''));
export const T=CONFIG.ui;
