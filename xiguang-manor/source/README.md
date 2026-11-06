# 曦光庄园：万圣夜的礼物 · V5.0

“你的名字好美，所以我送给你一座庄园。”

Phaser 3 + JavaScript + Vite 的手机竖屏像素庄园。沿用原地图与角色，加入可散步的秘密花园、小屋和分层湖畔风景。没有 NPC、顾客、任务或每日登录要求。

**线上正式版（V5）**：https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/

在普通浏览器打开即可，不需要 GitHub 或 ChatGPT 登录。存档保存在当前浏览器本地。

## 本轮全方位精修

当前开发分支 `upgrade/romantic-world-finish` 已升级山景与极光、四时段光色、自动风景演出、三套流星雨、七类烟花、糖果屋及十二件家具和配套界面。详细文件清单、配置、验证与剩余美术边界见 [WORLD_FINISH.md](WORLD_FINISH.md)。回退标签为 `before-world-finish-20261031`。

独立预览的比较页位于 `world-finish-review/index.html`，从那里可进入同一构建的完整游戏。正式 GitHub Pages 的 `main` 未被本轮覆盖；预览域名与正式域名的浏览器存档互不共享。

## 启动和构建

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`dist/` 是完整静态网页，Vite 的 `base: './'` 支持 GitHub Pages 子目录。不能直接双击源 HTML 运行。

现有仓库 `glenoliver1411-lang/english-valley` 的 `.github/workflows/pages.yml` 发布整个仓库；将 `dist/` 内的文件放进 `xiguang-manor/`，源码放进 `xiguang-manor/source/`，提交 main 后由 Actions 发布。不要改动仓库根目录原来的 English Valley 游戏。详细记录见 [V4_ROMANTIC_WORLD.md](V4_ROMANTIC_WORLD.md)。

观景星空已追加细碎星河美化：深蓝紫夜色、自然星团、蓝白与浅金星点、细光芒专属星、湖面碎光、薄云与垂花。保留现有角色、地图和全部玩法。

## 自由游玩

- 接收信件后，全部区域直接开放。摇杆 / WASD / 方向键移动，点物件或靠近后点互动，E / 空格也可互动。
- 原地图：右下小屋可进入，左下花拱门通往秘密花园，池塘木桥打开湖畔与遗迹入口，望远镜进入观星。也可用「在庄园里漫游」选择区域。
- 星空：点特殊星星收藏、命名、留下独立心愿；「送我一场流星雨」随时演出，最后可收下星星糖果。回忆册可重播流星雨、日出和烟花。
- 湖畔：「静静看一会儿」隐藏操作和任务界面，无奖励与倒计时。退出欣赏或拍照均可随时使用。
- 日出：湖畔、屋顶或窗前观看，天空、太阳、山峦、湖面与近景连续变化，结束回到清晨的探索。
- 秘密花园：六块花圃可选四种花，浇水后二十秒舒展、一分钟开花，采摘进入收藏；离线继续生长。树、秋千、水池、树洞与草地都有可选互动。
- 小屋：窗外可选晴天、细雨或薄雪；壁炉、窗前座位、床、衣橱、书架与信箱可互动。三套房间色彩，星星礼物可放在房间或挂回夜空。雨停后有彩虹。
- 布置小屋：12款原创家具免费使用，初始摆好6件；可点选/拖动预览、确认、取消、翻转、挪动与收起，最多同时摆10件。可更换墙纸、地板、房间配色；茶桌、月亮灯、烛台、绿植、小钢琴、留声机、阅读椅和猫篮都有互动。
- 晚风花海：漫游菜单或秘密花园的侧花拱门进入，可穿行花丛、坐长椅、在野餐毯休息、采花束与拍照。带回的花会开在小屋花瓶里，花架可换用已收藏的花。花海、小屋和观星照片都能导出864像素宽的无UI图片。
- 猫咪：取名、抚摸、跟随或自由休息，没有喂养义务和惩罚。
- 糖果屋：九种配方、搅拌与收火小游戏、记忆游戏、配方收藏、礼盒拖放包装；制作糖果可兑换六套原有服装。旧顾客订单玩法已停用，旧订单统计作为历史数据保留。
- 原有三颗魔法糖、重复糖果、四块老花田、遗迹寻珍、三种技能、烟花、换装与拍照保留。
- 音乐默认关闭，可启用原创合成旋律与环境声。回忆册内有低特效与静止风景模式；慢设备也会自动减少粒子。
- 万圣节和演出无真实日期限制。

## 配置和存档

`src/config.js` 修改收礼人 `recipient`、开场信与原文案。`src/romantic-config.js` 修改 V4 场景名称、短句、花种、房间色彩；`scenery-config.js` / `fireworks-config.js` / `candy-config.js` / `adventure-config.js` / `session-config.js` 分别控制对应玩法。

`src/home-config.js` 集中修改家具名称、说明、交互文案、布局约束和晚风花海文字。新增布置保存在原v1存档的`romance.room`，旧档自动补齐，保留原有进度。

名字使用 `{name}` 替换。没有收集或上传任何个人信息。

localStorage 继续使用 `xiguang-manor-v1`，新增 `romance` 字段，自动迁移旧存档。刷新保留花圃、收藏、心愿、服装和喜好；重新打开从原地图安全位置进入。换域名、换浏览器或清除站点数据不会自动转移存档。

右上退出按钮：保存退出 / 不保存本次并退出 / 取消。不保存会恢复本次进入前的快照，包括已经自动保存的 V4 更改。三种回归开场轮换，可跳过。直接关闭浏览器页签仍按浏览器限制自动保存，无法强制弹出自定义退出对话。

## 检查

```bash
npm test
# 先保持开发服务器运行，再运行浏览器测试
npx playwright install chromium webkit
node tests/journey.mjs
node tests/romantic-journey.mjs
node tests/retreat-view-journey.mjs
node tests/meteor-journey.mjs
node tests/nature-journey.mjs
node tests/candy-journey.mjs
node tests/adventure-journey.mjs
node tests/session-journey.mjs
node tests/fireworks-journey.mjs
node tests/romantic-journey.mjs --webkit
```

WebKit 所需系统依赖按 Playwright 安装说明配置。开发环境可使用 `WEBKIT_PORTABLE_BIN` 指定可用的 WebKit 启动程序。浏览器自动化使用手机尺寸与真实点击/拖动，并通过仅在开发构建存在的只读测试入口辅助定位；正式站点不暴露入口。模拟不能替代真实手机验收。

原版本以原创代码像素绘图与Web Audio合成为主；本湖畔实验分支另采用karsiori明确标注CC0的本地美术素材，并统一配色、像素密度和受光。无付费图片API或运行时第三方图片外链。详见[ASSET_CREDITS.md](ASSET_CREDITS.md)和[ASSETS.md](ASSETS.md)。

星光、草风与采花反馈：星星会独立明暗闪烁，草坪上的小草随阵风弯曲，草屑轻轻飘散。原花田和秘密花园的四种花分别触发「蔷薇心语 / 月光涟漪 / 暮紫星环 / 曦光萤舞」，成熟后采摘即可体验。`src/nature-config.js` 可调整闪烁、粒子上限与特效文案。

## 首次收到礼物的开场

首次打开会看到「小曦亲启」的星空信封，轻触后封口绕折痕翻开、信纸抽出。阅读按玩家自己的节奏进行；接收后播放约9秒的原地图苏醒镜头，窗户、灯笼与南瓜灯依次点亮，再出现可自由移动时观看的欢迎文字。所有演出可以跳过，右上角有跳过入口，拆信过程中可直接读信。开场可选择减少动态和开启音乐；音乐默认关闭，保留的音乐偏好也只在真实操作后恢复播放。

已有存档直接播放约3.6秒的三种轮换欢迎之一，减少动态时约0.8秒，并可立即跳过。庄园手记新增「重看完整礼物开场」，原来的读信与日出回忆继续保留；重播不改变位置、糖果、衣橱、家具、愿望或收藏。原`xiguang-manor-v1`存档格式不变，首次互动提示仅使用独立的`xiguang-manor-first-hints-v1`键记录看过的简短引导，不重置旧数据。

- `src/config.js`：收礼人、原信件。
- `src/gift-config.js`：开场文案、演出时长、初次接近提示。
- `src/gift-opening.js`、`src/gift-art.js`、`src/manor-awakening.js`、`src/gift.css`：独立开场模块、原创像素信封、原地图镜头和局部灯光。
- `src/session-config.js`：再次进入的时长和三种欢迎文案。

手机尺寸浏览器回归（开发服务器端口5173）：

```bash
node tests/gift-opening-journey.mjs
node tests/gift-opening-journey.mjs --webkit
```

部署继续使用`npm run build`输出的`dist/`，Vite的相对路径配置保持不变，兼容现有GitHub Pages子目录。已有进度的浏览器可从庄园手记重播本次开场，无需清除存档。

## 湖畔高品质美术样板（独立分支）

本轮位于`art/lakeside-quality-study`，未覆盖正式`main`。只将湖畔观星的建筑、山体、林丘、水面、植被和坐姿接入独立美术模块，其他视点与玩法保持原路径。

启动仍使用`npm ci`、`npm run dev`；打开浏览器后从顶部星星按钮进入星光观景台。运行`npm run build`可得到相对路径静态版本，`dist/lakeside-review/index.html`是随构建附带的前后对比页；启动`npm run preview`后访问`/lakeside-review/`即可。

来源、许可证与逐项修改见[ASSET_CREDITS.md](ASSET_CREDITS.md)；统一规范见[LAKESIDE_ART_DIRECTION.md](LAKESIDE_ART_DIRECTION.md)；修改文件、检查结果与未完善问题见[LAKESIDE_REVIEW.md](LAKESIDE_REVIEW.md)。浏览器核对可在开发服务器运行时执行`node tests/lakeside-art-journey.mjs`和同命令加`--webkit`。

极光专项精修：青绿色折叠光幕、薄荷色亮边、细光丝与极淡湖面碎影；保持原像素场景。比较页为 `world-finish-review/aurora.html`，文件、参考和检查见[AURORA_REFINEMENT.md](AURORA_REFINEMENT.md)。

## V5 主体美术重制

独立分支 `v5/art-remaster` 使用92帧本地PNG图集重制湖畔、花海、糖果工坊、小屋及主地图；原玩法和v1进度保留。实机对比位于 `v5-review/index.html`。详见[V5_DELIVERY.md](V5_DELIVERY.md)、[V5_ART_DIRECTION.md](V5_ART_DIRECTION.md)、[资源许可](V5_ASSET_CREDITS.md)和[完整资源清单](V5_ASSET_INVENTORY.md)。正式main未覆盖。

独立花海极光页面：开发时打开`/aurora.html`；游戏内从晚风花海的「去花海看极光」进入。实现、存档返回规则及复用素材见[AURORA_MEADOW.md](AURORA_MEADOW.md)。

极光之夜本轮精修与全隐藏录屏模式见[AURORA_ART.md](AURORA_ART.md)；三阶段手机实机截图和22秒原速视频位于`/aurora-review/`。净景模式双击画面或按Esc恢复全部选项。

2026-11-01：经用户确认，将 `v5/art-remaster` 的完整游戏发布到正式main，使用现有GitHub Pages地址。发布内容包括V5四大场景和最新独立极光之夜。旧档继续使用v1格式；预览域名的存档与正式域名分别保存。

普通游戏页面也支持净景录屏：点击顶部斜线眼睛按钮，或在「庄园手记」选择「关闭全部选项」。双击画面或按Esc恢复；隐藏时仍可点空地行走。详见[CLEAN_VIEW.md](CLEAN_VIEW.md)。

每日日期欢迎已接入原开场：按浏览器当地日期、星期、时段和季节显示约4秒的轻提示，支持轻点收起。配置、特殊日期接口和存档说明见[DAILY_WELCOME.md](DAILY_WELCOME.md)。

### 参考图质量样板

独立试玩：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/reference-art-preview/>

运行源码：`npm ci && npm run dev`。构建此独立预览：
`MANOR_RELEASE=reference-art-20261106-1 npm run build:reference:preview`。
素材再制作需要 Python 3 与 Pillow：`python tools/build-reference-art.py`。
完整署名和改编许可见 `src/assets/reference/LICENSE.md`、`ASSET_CREDITS.md`。
