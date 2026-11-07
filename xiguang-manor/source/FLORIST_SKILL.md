# 晚风花铺 · 已安装的美术 Skill 与高清 PNG 样板

试玩：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/florist-skill-preview/?visit=florist&v=florist-skill-20261107-1>

实机对比：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/florist-skill-preview/florist-skill-review/>

## 安装与原画

ZIP 内 `.agents/skills/xiguang-scene-art/` 的四个文件完整安装到仓库根目录，逐文件与压缩包字节校验相同。已阅读 `SKILL.md`、`PRODUCTION_GUIDE.md`、`QUALITY_GATE.md` 并执行其流程。分支 `art/florist-skill-hd`，回退标签 `before-florist-skill-20261107`。

本轮真正加载 Skill 附带的 **1199×1312 RGB PNG**，没有继续使用上一轮聊天压缩的 1169×1280 JPG。原文件 3,303,012 字节，SHA-256：`3eb12dcd11994bae79eeda031a541a2db7684647e9a91b82dcefde858834a886`。游戏素材副本与安装后的 Skill 原图逐字节相同，构建产物也校验同一哈希。

原画直接成为 Phaser 背景；Pillow 仅解码、裁切、编码，numpy 仅处理透明度，没有重新绘制家具、地板、鲜花、光照或温室。六张遮挡 PNG 合计 1,138,857 字节，每个 RGB 来自高清原图。制作脚本验证：将裁片在原位置叠回，整个画面逐像素一致。

## 实际可玩内容

- 沿用并对齐已有一楼脚底碰撞、触屏/摇杆移动和自动绕行。柜台、花桌、花箱、玻璃玫瑰桌、招牌及楼梯占地不可通行。
- 六个原画前景裁片根据倾斜接地脚线决定与角色的遮挡；没有在原画家具上重画第二套家具。完全遮挡时保留微弱人物定位透出。
- 售花、三花包装、花束出售/收藏/带回小屋、六件装饰购买继续用现有模型与价格；轻点柜台或选操作后先走近再交互。
- 二楼、楼梯、阁楼、玻璃温室完整可见；本轮不开放上楼。
- 角色保留原身份、四方向动画、服装与装备；使用脚底锚点及贴地影。画面统一倍率缩放，不拉伸、不压扁；可切换跟随与全景，并隐藏 UI 录屏。

精确的坐标、图层与边界见 `src/assets/scenes/florist/SCENE_PLAN.md`。为保留已经测试的一楼路线，世界高度保持 1280，原图和所有裁片使用相同的 `1280/1312` 倍率，世界宽 1169.75609756。图像本身没有重采样或分别缩放 X/Y。

## 存档、PWA 与发布

保留单存档键 `xiguang-manor-v1`。`save.js`、`play-model.js`、`expedition-model.js`、`adventure-model.js`、`session-model.js` 与修改前逐字节一致；不改经济，不清空旧进度。新图和所有动态导入都进入现有 Workbox 完整版本缓存。

独立预览路径 `/english-valley/xiguang-manor/florist-skill-preview/` 的 Manifest 和 Service Worker 仅控制本目录。不覆盖正式版或已有预览，包括上一轮 `florist-original-preview/`。发布脚本只复制当前可玩资源图与本轮截图；旧资源、Skill 文档、历史截图不进入离线缓存。

## 修改文件与新增资源

- 仓库根 `.agents/skills/xiguang-scene-art/`：原封不动安装的 Skill、两份参考文档、高清 PNG。
- `src/assets/scenes/florist/`：高清原图副本、六张透明前景 PNG、`regions.json`、`layers.json`、`SOURCE.json`、`SCENE_PLAN.md`。
- `src/florist-art.js`：加载高清原图及对应裁片，共同使用一个倍率。
- `src/florist-layout.js`：世界宽对应原图真实比例；原有安全路线与碰撞保留。
- `tools/prepare-florist-skill.py`：制作裁片与像素一致性检查。
- `.env.florist-skill-preview`、`package.json`、`tools/stage-release.py`：独立构建与隔离发布；在仓库内运行 staging 时避免复制/删除自身源码。
- 截图、离线和公开试玩测试增加可配置输出及正确等待：`tests/florist-capture.mjs`、`florist-original-journey.mjs`、`florist-offline-entry.mjs`、`play-offline-journey.mjs`、`v6-public-smoke.mjs`。
- `.gitignore`、`ASSET_CREDITS.md`、本报告与 `public/florist-skill-review/`。

构建：`MANOR_RELEASE=florist-skill-20261107-1 npm run build:florist:skill`。本轮开发、构建和发布均在云端完成，玩家无需电脑。

## 边界

原画是合成的一张固定日光图，本轮没有伪造可移动整件家具、夜景变体或被家具遮住的完整地板。以可靠禁行区域避开缺失背景，二楼只展示。新原图保真使首次联网需要下载更多资源，完整缓存后可断网游玩。自动化 WebKit 不替代实体 iPhone 的长期使用或系统安装验收。

## 已完成的实际验证

- 97 项 Node 测试通过；构建成功。
- Chromium、WebKit 均完成真实触屏点柜台、实际走近售花、三花包装、出售/带回小屋、家具购买、花桌前后遮挡与 375×667 检查。连续三次进出返回原画布尺寸，纹理数均为 51/51/51，交易重载后保留。
- 两内核完成首次拆信/接收→花铺→完整缓存→关闭整个浏览器→浏览器断网且服务器 503→重新从带 visit 参数的入口进入。离线去花海采花再售卖，第二次关闭重开仍保留收益及库存消耗。
- 两内核完成完整旧玩法断网回归：花海、花铺、小屋摆放、糖果制作、遗迹暂存/重开/撤离、独立极光、退出重开与导出备份。原服装、宝物、猫名、天气、音乐和布局保留。
- 实际 Workbox 缓存完整 44 项、7,254,305 字节，另有 66 字节内部版本记录；缺失资源 0。原图、六张裁片和全部懒加载模块均包含在当前发行版图中。
- 实机截图来自 Phaser：390×844 与 375×667、DPR 2。渲染器实际源图尺寸为 1199×1312，X/Y 缩放均为 1280/1312，无横向溢出。
- 以上是自动化内核及短程纹理检查，不是实体手机长时帧率或主屏幕安装承诺。

本轮停止于一楼可玩样板，不继续扩展二楼、遗迹或其他美术。
