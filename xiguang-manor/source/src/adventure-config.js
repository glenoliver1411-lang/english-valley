// 月下寻珍、服装与全部新增文字。角色名字仍来自 config.js。
export const ADVENTURE={
 qualities:[{id:'plain',name:'一般',chance:.10,color:'#b7b4c7',candies:2},{id:'fine',name:'良',chance:.50,color:'#aec9b7',candies:4},{id:'rare',name:'好',chance:.10,color:'#c6b2e6',candies:6},{id:'gold',name:'大金',chance:.30,color:'#f2cc84',candies:10}],
 outfits:[
 {id:'original',name:'最初的月光',cost:0,style:'original',coat:'#b598bc',top:'#c5acd0',skirt:'#8c6991',boots:'#654e68',accent:'#edb9bb',note:'最初收到庄园时穿着的温柔紫色。'},
 {id:'cocoa',name:'可可秋日',cost:8,style:'cardigan',coat:'#6c5147',top:'#f0c4c6',skirt:'#8e6b57',boots:'#5a4143',accent:'#e2c2ad',note:'粉色条纹针织、可可开衫、扣饰短裙与系带长靴。'},
 {id:'rose',name:'玫瑰奶霜',cost:12,style:'knit',coat:'#d7afc1',top:'#f3d9dc',skirt:'#80675e',boots:'#aa8472',accent:'#f3e5d7',note:'柔软粉色针织叠穿，搭配奶霜色蕾丝与棕色长靴。'},
 {id:'wild',name:'林间来信',cost:15,style:'spots',coat:'#8d7659',top:'#efe2cb',skirt:'#aa9273',boots:'#80664e',accent:'#e6d5b3',note:'林间斑纹外套、奶油内搭与毛绒靴套。'},
 {id:'berry',name:'草莓蝴蝶结',cost:18,style:'bows',coat:'#e6b7c4',top:'#f6e5d5',skirt:'#b8a393',boots:'#e6ded1',accent:'#a77983',note:'草莓粉丝带、细褶短裙、白色靴套和一只小挎包。'},
 {id:'pearl',name:'月眠珍珠',cost:20,style:'lace',coat:'#e9dcd9',top:'#faeeee',skirt:'#796054',boots:'#68514d',accent:'#d4acbf',note:'玫瑰刺绣上衣、珍珠吊坠、巧克力褶裙与系带鞋。'},
 {id:'mist',name:'晨雾花笺',cost:24,style:'drape',coat:'#c9bdb7',top:'#ebe0d7',skirt:'#927d71',boots:'#6d6550',accent:'#a78291',note:'垂坠针织、花纹腰带、暖灰裙摆与橄榄棕长靴。'}
 ],
 relics:[
 {id:'moonbottle',quality:'plain',name:'月光玻璃瓶',shape:'bottle',note:'里面装着池塘今晚最亮的一点倒影。',action:'打开月光瓶'},
 {id:'oldkey',quality:'plain',name:'花纹小铜钥匙',shape:'key',note:'它打开的不是锁，是庄园里一段轻轻的回声。',action:'听听钥匙的回声'},
 {id:'catbell',quality:'fine',name:'猫咪的小金铃',shape:'bell',note:'摇响以后，会有一位毛茸茸的小居民跑来陪你。',action:'摇响小金铃'},
 {id:'rosepin',quality:'fine',name:'晚风玫瑰胸针',shape:'rose',note:'风把花香别在你的衣襟，也替你留住一个温柔的夜晚。',action:'别上玫瑰胸针'},
 {id:'starwatch',quality:'rare',name:'星河怀表',shape:'watch',note:'与你一起的时候，想让时间慢一点。',action:'把时间拨到清晨'},
 {id:'ghostlamp',quality:'rare',name:'幽灵守夜灯',shape:'lantern',note:'小幽灵说，它会照亮你下一次想去的地方。',action:'点亮守夜灯'},
 {id:'crown',quality:'gold',name:'曦光花冠',shape:'crown',note:'这顶花冠，只为{name}留了一点晨光。愿你永远被温柔照亮。',action:'戴上曦光花冠'},
 {id:'galaxyclock',quality:'gold',name:'星河永恒怀表',shape:'clock',note:'把所有想陪你的时刻，装进一小片永不熄灭的星河。',action:'展开掌心星河'}
 ],
 skills:[{id:'light',name:'提灯照影',note:'照亮遗迹里的隐藏符文；让庄园里的小物件发光。'},{id:'compass',name:'星盘寻珍',note:'指引最近尚未打开的宝箱；在庄园中指向月影入口。'},{id:'phase',name:'月影穿行',note:'化成半透明星光，七秒内可以穿过遗迹的藤蔓门。'}],
 text:{wardrobe:'糖果衣橱',skills:'互动技能',collection:'藏珍手记',title:'月下寻珍',tag:'MOONLIGHT & LITTLE TREASURES',pondAction:'触碰月影',wallNote:'石墙里的星纹亮了一瞬，像在回应你的脚步。',pondTitle:'池塘藏着另一片月亮',pondNote:'轻触倒影，月影石阶会通往庄园下方的星灯遗迹。这里的每一盏灯、每一件小物，都愿意回应你。',enter:'沿月影石阶下去',newRun:'再探一回星灯遗迹',continueRun:'继续这次探索',ripple:'拨动月亮的倒影',close:'关闭',back:'回到庄园',wardrobeNote:'拾起糖果，换一身喜欢的衣服。每套都能在庄园、观星与探索时穿着。',balance:'拥有 {count} 颗糖果',buy:'用 {cost} 颗糖果兑换',wear:'穿上这一套',wearing:'正在穿着',owned:'已收藏',notEnough:'糖果还差 {count} 颗。花田旁的糖果与遗迹宝箱都在等你。',purchased:'新衣服收好啦，现在就穿给月亮看。',dressed:'换好啦，今晚的你也闪闪发光。',preview:'转个身看看',skillHint:'三种技能都已学会，可以反复使用。',cast:'使用技能',lightOn:'提灯照出了隐藏符文。宝箱的锁孔亮起来了。',compassHome:'星盘指向池塘，月影石阶就在那儿。',phaseOn:'化作月影，七秒内可穿过发光的藤蔓门。',compassAll:'这一回的宝物都已找到。可以回池塘，再探一次。',compassTarget:'星盘指向{dir}，还有约 {steps} 步。',directions:['东','东南','南','西南','西','西北','北','东北'],ruinNote:'先用提灯照影唤醒符文，再用月影穿行越过藤蔓门。三只宝箱都可以打开，探索不消耗糖果。',chest:'月光宝箱',sealed:'锁孔上有隐藏文字。试试「提灯照影」。',opened:'这个宝箱已经收好心意了，去看看另外几只吧。',vine:'月影藤蔓门',vineNote:'藤蔓会认出星光。使用「月影穿行」就能从中穿过。',rune:'会发光的壁画',runeNote:'壁画里画着一位提灯的女孩，和一路陪伴她的小幽灵。',fountain:'星灯泉',fountainNote:'轻触泉水，一小片星河在掌心展开。',guardian:'守箱的小幽灵',guardianNote:'这些宝物不是谁遗失的，是有人很早以前，为{name}藏好的。',sconce:'星灯',sconceNote:'你点亮了遗迹的灯。连影子也变得柔软了。',leaveNote:'探索进度已经记住。下次仍能从这回未打开的宝箱继续。',rewardTitle:'小幽灵替你打开了宝箱',rewardCandy:'还找到 {count} 颗糖果，可以去衣橱换新衣服。',take:'把心意收好',odds:'一般 10% · 良 50% · 好 10% · 大金 30%',inventoryNote:'每件宝物都能再次触摸、使用。重复找到的宝物也会记在这里。',empty:'还没有找到宝物。到池塘触碰月亮的倒影吧。',use:'使用这件宝物',count:'收藏 × {count}',active:'正在陪伴你',remove:'收起随身宝物',relicUsed:'这件宝物正在陪伴你。',litGift:'第一次发现这种小风景，收到一颗糖果。',flower:'花朵把一片花瓣送到你的手心。',tree:'树叶轻轻摇响，为你落下一阵花雨。',fence:'替栅栏系上一颗星星，像替庄园系好一份心意。',lamp:'灯笼回应了你的手指，暖光轻轻亮灭。',pumpkin:'南瓜灯眨了眨眼睛，像是在和你打招呼。',roof:'糖果屋的窗边，藏着一阵温暖的甜香。',bird:'小鸟扑了扑翅膀，像是在向你轻轻点头。',fish:'小鱼绕着倒影游了一圈，留下一串细小的波纹。',skyStar:'这颗远星轻轻闪了一下：今晚也为你留着光。',moon:'月亮听见了，它会替你照看所有温柔的愿望。',cloud:'云朵捎来一声晚安，又慢慢漂向远方。',mountain:'山谷把你的问候，悄悄送回庄园。',bench:'在长椅上坐一会儿，小猫也愿意陪你看星星。',skyCat:'小猫醒来伸了个懒腰，蹭了蹭你的裙摆。',sun:'把手心伸向清晨，接住第一缕阳光。',caught:'接住一小点流星的光，得到一颗糖果。',skyHint:'点击星星、月亮、云朵、屋顶与花草 · 星雨时可以接星光',mapHint:'摇杆移动 · 点物件互动，点小路前往',firstVisit:'池塘的倒影里出现了月影石阶。技能与衣橱已为你准备好。',runeLit:'隐藏符文已点亮',runeUnlit:'用提灯照影唤醒符文',chestProgress:'宝箱 {count} / 3',next:'继续探索',chestAgain:'看看收藏过的宝物',relic:'随身宝物',tap:'轻触，看看它的回应',flowerField:'花田的小心愿',view:'欣赏它的光',shirt:'服装',newWardrobe:'衣橱与寻珍',chestLoot:'找到 {quality} · {name}',door:'庄园大门',doorNote:'这扇门永远向你敞开。想休息时，可点右上角退出保存。'}
};
export const AT=ADVENTURE.text;
