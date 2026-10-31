// 首次礼物开场的节奏、文案与引导；收礼人统一读取 config.js 的 recipient。
export const GIFT = {
  timing: {unfold: 1.45, awakening: 9.2, reducedAwakening: .75, welcome: 6.8},
  text: {
    tag: 'A LITTLE WORLD, HANDMADE FOR YOU',
    heading: '有一封信，想亲手交给你。',
    envelope: '{name}亲启', open: '拆开给{name}的信',
    touch: '轻触信封 · 让这份心意慢慢展开',
    skip: '跳过开场', unfoldSkip: '直接读信',
    reduced: '减少动态', music: '伴着音乐打开', musicOn: '音乐已开启',
    awakening: '月光落下，庄园正慢慢醒来。',
    welcome: '欢迎回家，{name}。',
    welcomeLine: '这里的每一寸风景，都为你准备好了。',
    free: '摇杆漫步 · 轻点物件 · 不必完成任何任务',
    replay: '重看完整礼物开场',
    tips: {
      shop: '糖果屋的门开着。轻点右下角，进去自由制作糖果。',
      cabin: '这是你的小屋。轻点右下角，进去休息或布置房间。',
      garden: '花园藏在树后。轻点右下角，沿着花香走进去。',
      lookout: '轻点右下角，在观景台为自己送一场流星雨。',
      cat: '轻点右下角，可以摸摸小猫，也可以给它取名字。',
      pond: '轻点右下角，可以在水边静静看一会儿。'
    }
  }
};
