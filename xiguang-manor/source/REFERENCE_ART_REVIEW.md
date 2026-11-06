# 参考图质量样板 · 2026-11-06

独立试玩：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/reference-art-preview/?v=reference-art-20261106-1>

同机位实机对比：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/reference-art-preview/reference-review/>

## 参考图如何落实

上一版 V6 主要依靠原始形状重绘，主体轮廓、布艺与材质仍偏粗。这一轮改用真正的手工像素家具、织物、容器和建筑材质作为制作输入，在构建阶段完成裁切、配色与场景组合。没有拷贝参考截图、商业游戏或照片。

| 场景 | 实际主体修改 | 沿用的边界 |
| --- | --- | --- |
| 小屋 | 雕刻床框与花纹床品、褶皱帘布、软垫椅／沙发、带抽屉书架／衣柜／桌、真实织毯、灯罩、玻璃花柜等 | 原 432px 逻辑宽度、窗景孔位、家具占地、固定家具脚点、换色、翻转、免费家具与购买规则 |
| 晚风花铺 | 重组不同高度花架、木质抽屉柜台、包装台、纸卷／丝带／剪刀、玻璃器皿、窄织毯；保留中央走道 | 原碰撞、采花库存、单卖、三花包装、收藏／出售／带回小屋、六件购买家具 |
| 遗迹 | 蓝灰石板和砌墙材质、冷色雕刻柱／石像、四状态木质金属包边宝箱、宝箱附近局部暖光 | 原三层随机布局、墙体遮挡、机关预警与危险判定、技能、临时包、续局和撤离／失败结算 |

主地图、湖畔、花海和独立极光沿用原美术。人物沿用上一版四方向衣服和装备挂点，不更换主角。没有新增玩法、NPC、交易价格、任务、账号或存档字段。

## 素材与绘制方式

- 本地图集 `src/assets/reference/atelier.png`：1024×2048，59 帧，154,340 字节。RGBA 解码约 8 MiB，未计浏览器／GPU 副本。
- 五组输入为 LPC Wooden Furniture、Upholstery、Walls、Floors、Containers。原图、完整作者署名、哈希与修改说明保留在 `src/assets/reference/`。
- 使用明确的 CC BY / CC BY-SA 授权；组合图集按 CC BY-SA 4.0 发布。完整记录见 `ASSET_CREDITS.md`、`src/assets/reference/SOURCES.json` 和 `LICENSE.md`。
- 「庄园手记 → 美术来源与许可」提供完整署名，按需加载，包含在离线资源图中。
- 所有新图像在构建阶段生成；运行时裁帧缓存复用，遗迹背景仍仅在入层时合成。未加入全屏滤镜或增加粒子遮盖主体。
- 原始输入 5 项 SHA-256、59 帧边界与所有替换帧尺寸均已核对；占地没有随素材替换改变。

## 对比截图条件

从回退点 V6 和本轮源码分别启动真实游戏，使用 `tests/v6-capture.mjs` 重新拍摄。两侧均为 390×844、相同相机／位置、晴朗天气、可可服装与四件装备；遗迹种子 42654。日间小屋固定 09:30，其他固定 21:00，减少动态以控制可比状态。

七组包含小屋白天／夜晚、花铺、遗迹第一层／深层、主地图、人物装备。最后两组用于证明原内容保留，不声称本轮重制了室外或角色。没有用概念图代替运行截图。

## 修改文件

- 制作输入、图集与许可：`src/assets/reference/**`、`tools/build-reference-art.py`。
- 素材接入：`src/reference-assets.js`、`src/v6-assets.js`。
- 局部灯光：`src/expedition-art.js`、`src/ruins-scene.js`。
- 离线署名入口：`src/reference-credits.js`、`src/main.js`。
- 独立预览：`.env.reference-preview`、`package.json`、`tools/stage-release.py`、`.gitignore`。
- 验收与说明：`tests/v6-capture.mjs`、`tests/v6-performance.mjs`、`tests/v6-public-smoke.mjs`、`public/reference-review/**`、`README.md`、`ASSET_CREDITS.md`、本报告。

`save.js`、`play-model.js`、`expedition-model.js`、`adventure-model.js`、`session-model.js` 与回退点逐字节相同。

## 保护与运行

源码开发分支 `art/reference-quality`，源码和发布仓库均有回退标签 `before-reference-art-20261106`。仅新增 `reference-art-preview/` 运行目录，原正式版、`play-preview/`、`v6-art-preview/`、`experience-preview/` 不覆盖。

本地：`npm ci && npm run dev`。

构建：`MANOR_RELEASE=reference-art-20261106-1 npm run build:reference:preview`。

图集重制：安装 Pillow 后运行 `python tools/build-reference-art.py`。

## 尚有差距

这是一版沿用原相机、房间尺度与占地的参考方向样板，不是参考图的逐像素复刻。花铺未改成等距剖面建筑；遗迹仍有模块化重复，墙体与光源的空间表现还没有达到参考图的手绘密度。室外山景、建筑和花海未在本轮重画。实体 iPhone 的安装与长时性能仍需真机验收，WebKit 模拟不等同于真机。

必要检查结束后停止，交由玩家检查美术方向。

## 实际验证结果

- 94 项现有 Node 测试全部通过；原存档迁移、经济、临时背包与结算幂等测试保留。
- 真实花铺按钮验证了采花→库存→单卖→三花包装→出售／带回小屋→购买家具→摆放→刷新；六件商品逐件购买并同时摆放，四种开关与两种坐姿均通过。
- Chromium 和 WebKit 均通过真实触摸开箱、暂存与续局、物理出口撤离、解机关、进入下层、危险失败结算、旧物保护与装备卸下。
- 两个内核均执行生产构建完整缓存→关闭整个浏览器→浏览器离线且服务器强制 503→重新启动→首次进入花海、花铺、糖果屋、小屋、遗迹、独立极光→再次关闭重启→存档核对。糖果制作、家具摆放、交易、续局与撤离、JSON 备份均通过，没有页面脚本错误。
- 离线署名面板也已通过两个内核的断网加载；375×667 的主操作与关闭按钮均可到达，44px 点击高度、无横向溢出。
- 两个内核缓存审计均为完整 36 项资源，2,799,442 字节；缓存另有 1 个 66 字节 Workbox 内部记录。没有缓存上游原始大图、历史截图或文档。正式发布资源图与实际断网测试图逐文件哈希一致。

Chromium 同主机、同视口、预热 12 秒后 3 次各 2 秒回调采样：上一版中位数 52.6（51.1–54.0），本轮 54.6（52.3–55.9）；P95 帧间隔约 33.4 / 33.3ms。波动范围重叠，不宣称性能提升。两版分别进行四轮花铺／小屋／遗迹往返，回到主图纹理数均恒定：原版 41，本轮 42（多一张常驻图集）。Chromium 主动 GC 后堆样本两版均约 30 MB，未观察到随往返持续增加。

WebKit 同样四轮纹理数保持恒定；其部分回调采样与另一浏览器离线检查并发，未用于独立性能前后结论。原始记录已注明。上述测试为虚拟浏览器／GPU，不能替代实体手机长时帧率与总内存测量。
