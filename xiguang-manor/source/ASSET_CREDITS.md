# 曦光庄园：素材与授权记录

本记录适用于湖畔样板及其后续全方位精修分支 `upgrade/romantic-world-finish`。正式 `main` 版本未覆盖。所有运行时美术均在项目内，不使用图片外链、收费素材、商业游戏素材或图片生成 API。

## 实际采用的第三方素材

**素材包：** FREE Pixel Art Mountains Tileset and Backgrounds

**作者：** karsiori

**作者发布页：** https://karsiori.itch.io/free-pixel-art-mountains-tileset-and-backgrounds

**核实日期：** 2026-10-31

**授权：** CC0 1.0 Universal，https://creativecommons.org/publicdomain/zero/1.0/

**作者许可说明摘录：** “CC0, you can use this asset pack however you want, in your commercial or non-commercial projects.”

**署名要求：** CC0不强制署名；本项目仍保留作者、来源和原文件对应关系。

**再分发：** CC0允许修改和再分发，适合本项目公开源码及静态网页；不是只允许打包游戏而禁止公开原素材的许可。

原PNG保存在 `src/assets/lakeside/`。`SOURCE.json`记录原文件名、下载来源及每个本地原文件的SHA-256；`CC0-1.0.txt`附通用CC0法律文本。作者原包名为`Pixel Art Tiles and Backgrounds - Mountains.zip`。解压后仅选取以下13张，不把整包未使用资源装进游戏。

| 本地资源 | 作者原文件 | 实际使用与修改 |
| --- | --- | --- |
| `cottage.png` | `Decoration/House.png` | 主湖畔小屋；保留手绘瓦片、木构与砖石纹理，重映射为粉紫屋顶、暖木色与奶油窗光，镜像使主光来自右上方，补原创花箱、爬藤、台阶和局部照明。 |
| `oak.png` | `Decoration/Tree 1.png` | 左侧树木；保留枝干与不对称叶簇，统一冷绿／蓝绿／晨光色阶，镜像调整受光。 |
| `rowan.png` | `Decoration/Tree 2.png` | 右侧树木；不同冠形与枝杈，按四时段重映射并调整受光。 |
| `pink-cosmos.png` | `Decoration/Flower 1.png` | 近景粉色花；统一花瓣、花心、叶与茎，使用固定的非对称花丛布局。 |
| `rose.png` | `Decoration/Flower 2.png` | 低矮花簇；同色板映射，部分随独立相位轻摆。 |
| `daisy.png` | `Decoration/Flower 3.png` | 浅奶油色花；与其他花不同的轮廓与明度，保留花心。 |
| `wildflower.png` | `Decoration/Flower 4.png` | 林缘小花；固定成组，少量轻摆。 |
| `bellflower.png` | `Decoration/Flower 5.png` | 较深紫花；保留不同花形，作为花丛中的低明度层。 |
| `grass-fan.png` | `Decoration/Grass 1.png` | 岸边扇形草叶，统一冷暖叶色。 |
| `grass-tuft.png` | `Decoration/Grass 2.png` | 小草丛，配置不同朝向与疏密。 |
| `shore-rock.png` | `Decoration/Rock 3.png` | 岸石；映射为冷灰石色，保留受光边及裂隙。 |
| `mountains-3.png` | `Backgrounds/Mountains 3.png` | 极淡的林地远景底形；裁取顶部，与原创林丘/树线结合。 |
| `mountains-4.png` | `Backgrounds/Mountains 4.png` | 手绘岩壁与山形；使用不同原生像素区域构成远、中两层，镜像统一受光，分别加入空气透视、颜色映射和山脚薄雾。 |

全部改色发生在一次性缓存的Canvas材质中；原PNG不被覆盖。山图渲染缓存只保留顶部256像素，避免原文件大片纯色底部占用多份重着色缓存。近景叶片与建筑维持原生像素，浏览器不对纹理做模糊放大。

## 本项目原创及沿用资源

- `lakeside-actors.js`：根据原小曦发色、桃色蝴蝶结、衣橱配色补绘湖畔坐姿、头发层次和衣袖；新增湖畔猫咪睡觉、坐下、伸展的像素姿态，保留原紫色魔女帽形象。没有引入新的角色身份或更换主地图行走素材。
- `lakeside-art.js`：原创小船屋、花箱、爬藤、台阶、石径、长椅、望远镜、蕨叶、鸢尾、接触阴影、局部灯光与烟雾。
- `lakeside-background.js`：原创森林山丘、林缘树线、水色底画、波纹、分段倒影和晨雾，使用上述授权山体纹理。
- 原项目 `starlight.js`、星星命名、许愿、日出时间轴及音乐保留。全方位精修增加流星编排、烟花类型及独立的风景偏好存储；原v1游戏进度不重置。

## 搜索后未采用的候选与学习资料

| 来源 | 核实情况 | 不采用／用途 |
| --- | --- | --- |
| [Kenney Tiny Town](https://kenney.nl/assets/tiny-town) | 具体素材页与预览标注CC0；16×16图块。 | 轮廓更简化、偏俯视小地图，不能解决本轮湖畔纹理和体积问题。仅查看预览，未放入工程。 |
| [dustdfg Pixel Art Mountains Parallax](https://dustdfg.itch.io/pixel-art-mountains-parallax) / [OpenGameArt发布页](https://opengameart.org/content/pixel-art-mountains-parallax) | 作者页标注CC0，下载包附CC0全文。 | 原160×80，与湖畔原生432像素画布相比过小，放大会增加粗糙感，未采用其图像。 |
| [Riclmbr Pixel Trees](https://riclmbr.itch.io/pixel-trees-10-free-pixel-art-trees) | 作者页标注CC0。 | 优先选择与已选小屋、山体同一作者的树木，减少风格拼贴；未下载整合。 |
| [SLYNYRD：Landscape Pixeling](https://www.slynyrd.com/blog/2018/11/16/pixelblog-11-landscape-pixeling) | 美术教程，不视为可再分发游戏素材。 | 只学习空气透视、光照层次与材质概括，不复制插图、代码或纹理。 |

以上资源没有因为平台“免费”就自动获得可用许可；实际纳入游戏的13张图均依据karsiori具体发布页的CC0声明选取。

## 全方位精修追加（2026-10-31）

本轮没有新增第三方PNG、字体、录音、视频或服务。继续使用上表13张CC0本地文件；山体材质现在也用于屋顶／窗前远景、主地图地平线以及糖果屋和小屋窗外，并按原生像素裁取和四时段色板缓存。其他新增资源全部由本项目代码绘制：

| 原创资源模块 | 内容与修改 |
| --- | --- |
| `aurora.js` | 分层透明光幕、纵向细光线、折叠下缘与低频流动；固定小尺寸缓存，不使用极光照片。 |
| `material-painter.js` | 统一顶面、侧面、边沿、玻璃、木纹、布料与接地阴影绘图基础。 |
| `furniture-atelier.js` | 原12种家具的立体重绘，保留家具类型、原尺寸、足迹、位置及互动。 |
| `room-detail.js` | 原床、窗框、壁炉、沙发、书架、地毯、家具与窗光细修。 |
| `candy-room-art.js` / `candy-art.js` | 糖果屋柜台、罐架、配方板、礼盒、玻璃烤炉、搅拌盆和糖果；不增加顾客或NPC。 |
| `world-detail.js` | 原主地图建筑边沿、窗箱、门阶、瓦片、岸石与不同花形；复用授权山体。 |
| `meteors.js` / `fireworks.js` | 三种流星雨编排；圆形、柳枝、心形、星形、多层、彗尾、连续礼花共七类原创对象池动画与细碎水面映光。 |
| `world-polish.css` | 统一纸质配方卡、铜金边框、立体按钮、收藏图标底座及清晰中文输入框，无外部字体。 |

### 本轮查阅的学习参考（没有复制到游戏）

- [NOAA / NWS — Aurora Tutorial](https://www.spaceweather.gov/content/aurora-tutorial)：学习真实极光的弧状／帘状结构、纵向射线、绿色与紫色的层次、波动与透明感。只借鉴自然现象；没有将其照片、图表或视频作为纹理。
- [SLYNYRD — Pixelblog 35: Top Down Interiors](https://www.slynyrd.com/blog/2021/11/30/pixelblog-35-top-down-interiors)：学习3/4视角家具的顶面、侧面、遮挡、接地和材质概括。没有下载、复制或重分发作者付费素材和示例像素图。

参考网页不等于获得该网页插图的素材许可。实际发布的外部游戏图像仍只有上述明确CC0的13张；源文件、许可证及SHA-256记录继续保留。

## 极光专项精修（2026-10-31）

依据用户提供的极光摄影截图与前述NOAA自然现象资料，重新观察帘状弧面、回卷、发亮下缘、纵向细光丝与向上消散的辉光。截图、平台UI、水印、视频和摄影像素均未收入项目；只参考自然形态。新版`aurora.js`的折叠曲面、青绿／薄荷色光谱、局部光扩散及碎水纹都是原创代码，12张微型光谱缓存现场生成。没有新增外部美术、音频、字体、收费API或外链。具体文件与性能说明见[AURORA_REFINEMENT.md](AURORA_REFINEMENT.md)。

## V5 主体美术重制

本轮采用17张明确CC0的新源图（15张花卉／灌木／盆栽、2张森林层），并原创绘制新的本地PNG主体。完整来源与修改记录见[V5_ASSET_CREDITS.md](V5_ASSET_CREDITS.md)，全部92帧见[V5_ASSET_INVENTORY.md](V5_ASSET_INVENTORY.md)。未增加付费服务、商业游戏素材或运行时外链。

2026-11-01 花海极光独立页面：无新增第三方资源，复用上述V5本地图集、CC0花草与山景、原创坐姿及合成音乐。极光不再绘制到原观星或主地图。

2026-11-01 极光之夜美术精修：新增原创连续光场与后视长椅代码，无新增第三方素材。挪威、冰岛与芬兰摄影仅研究、不嵌入；具体参考及版权边界见[AURORA_ART.md](AURORA_ART.md)。实机验收位于`aurora-review/`。

2026-11-01 树木落地与天空山景衔接修正：没有新增外部素材。复用原V5本地树木与已记录的CC0山体；仅调整树干与树根衔接、接地阴影、山体裁切接缝、空气透视和主地图合成顺序。

2026-11-06 手机加载优化：新增`src/assets/v5/atelier.webp`，由项目原`atelier.png`无损转换（可见像素及透明度保持一致，原PNG保留作兼容回退）。素材作者、授权和修改归属沿用[V5_ASSET_CREDITS.md](V5_ASSET_CREDITS.md)，无新增第三方素材。

2026-11-06 第二轮体验优化：无新增外部美术、音频、字体或服务。`v5-meadow.js`仅将已有花海代码分离，`tree-occlusion.js`遮挡纹理来自原图集透明轮廓与当前地图像素；原PNG／WebP文件不变。完整实测与修改清单见[EXPERIENCE_ROUND2.md](EXPERIENCE_ROUND2.md)。
# 离线版补充（2026-11-06）

本轮没有替换场景美术，也没有引入网络图片或音频。`public/pwa-icons/icon-{180,192,512}.png` 是本项目原创：以 64px 像素画绘制月亮、暖灯小屋与花朵，再使用最近邻采样输出手机图标；制作源码为 `tools/pwa-icons.mjs`。安装指引中的分享／添加图示为原创 SVG。

离线缓存采用 [vite-plugin-pwa 1.3.0](https://github.com/vite-pwa/vite-plugin-pwa) 与 [Google Workbox 7.4.1](https://github.com/GoogleChrome/workbox)，均为 MIT 许可的软件依赖；原始许可随 npm 包保留。原有第三方游戏美术的 CC0 来源与修改记录仍见本文及 V5 素材记录，没有改变其授权。

## 生活玩法预览（2026-11-06）

新增本地原创图集 `src/assets/play/atelier.png`（1024×1024，59,630 字节）与 `atlas.json`，共 41 帧。制作源码 `tools/build-play-art.py` 复用本项目 V5 像素绘图工具及色板，全部重新绘制；没有从网络下载或复制新的图像、录音、字体，也没有调用收费服务。已有第三方素材及其许可保持原记录。

| 原创帧 | 实际用途 |
| --- | --- |
| `florist-room` | 432×850 可走动花铺：柜台、玻璃花瓶、包装桌、纸卷、剪刀、花柜、帘架和地毯。 |
| `furniture-{berryLamp,starProjector,laceDrape,vintageSofa,flowerSwing,glassCabinet}-{off,on}` | 六件新家具的完整开／关 PNG 帧；保留可辨识的木脚、玻璃、布褶、灯罩、铜件和接地阴影。 |
| `flower-{rose,lily,aster,glow}`、`wrap-{back,front}-{cream,rose,night}` | 四种真实库存鲜花；三种包装前后层，运行时合成玩家选择的三朵花束。 |
| `equip-{crown,rosepin,ghostlamp,catbell}` | 真实角色花冠、胸针、手持灯和猫铃；不替换原角色身份及服装。 |
| `ruins-floor-0..2`、`ruins-wall`、`ruins-pillar`、`ruins-chest-0..2`、`glyph-0..2`、`ruins-mechanism`、`ruins-stairs`、`ruins-portal` | 遗迹地砖、厚石墙、柱、三段开箱、可解机关、真实撤离石阶和层间拱门。 |

本轮的坐姿延用原项目原创 `LakesideActors`，保留原衣服；危机提示音为本地 Web Audio 合成并遵守静音。未修改极光美术或混入新的外部风格。`public/play-review/` 的截图由真实 Chromium／WebKit 游戏运行产生，包含测试档案状态，不是概念图。

## V6 美术专项（2026-11-06）

新增 `src/assets/v6/atelier.png`，1024×2048、134,623 字节，共 45 个打包图块。全部由本项目 `tools/build-v6-art.py` 原创绘制，复用项目已有像素绘图工具；本轮没有下载新的外部图片、音频或字体，也没有调用图像生成服务。原 V5 第三方资源及其 CC0 许可维持原记录。

图块含花铺室内、12 块破损石板、3 种厚墙、石柱、雕像、壁画、积水、4 段宝箱、3 种帘墙、两种木地板、床铺、壁炉、地毯、固定家具、主地图灯与石路，以及原七套服装的四方向行走表（每套 16 帧）。完整位置与尺寸见同目录 `atlas.json`；装备挂点见 `anchors.json`。衣服的名称、身份和颜色直接读取原 `adventure-config.js`，没有新增服装或修改价格。

`public/v6-review/before/` 和 `after/` 为相同 390×844 视口、同位置／时间／天气／服装／遗迹种子的真实浏览器截图。基线来自 `before-v6-art-20261106` 回退点。制作与检验记录见 [V6_ART_REFINEMENT.md](V6_ART_REFINEMENT.md)。

## 参考图质量样板 · 2026-11-06

本轮新增本地手工像素素材改编图集 `src/assets/reference/atelier.png`，而非引用用户截图或商业游戏美术。运行时仅加载组合图集；源图保留在源码目录，便于核实和再制作。

| 素材 | 作者与来源 | 本轮选择的许可 | 修改 |
| --- | --- | --- | --- |
| LPC Wooden Furniture | bluecarrot16 等；[原页](https://opengameart.org/content/lpc-wooden-furniture) | CC BY-SA 4.0 | 裁切床、柜、架、桌、钢琴与壁炉；适配原占地 |
| LPC Upholstery | bluecarrot16、Lanea Zimmerman (Sharm)；[原页](https://opengameart.org/content/lpc-upholstery) | CC BY 4.0 | 雾紫／草莓粉布艺、帘、座垫；保留原主题换色 |
| LPC Walls | bluecarrot16 等；[原页](https://opengameart.org/content/lpc-walls) | 原图 CC BY-SA 3.0，改编图集 CC BY-SA 4.0 | 室内墙材、遗迹石墙与配色 |
| LPC Floors | bluecarrot16 等；[原页](https://opengameart.org/content/lpc-floors) | CC BY-SA 4.0 | 连续木板、织毯、石板，重新配色和组合 |
| LPC Containers | bluecarrot16、Sharm 等；[原页](https://opengameart.org/content/lpc-containers) | CC BY-SA 4.0 | 四种宝箱状态、金属包边、玻璃器皿 |

以上所有作者与上游署名完整保留在 `src/assets/reference/originals/CREDITS-*.txt`，不要只保留表格中的简称。下载地址、原文件哈希、具体许可和改动记录见 `src/assets/reference/SOURCES.json`。组合图集及改编遵守 CC BY-SA 4.0，许可说明见同目录 `LICENSE.md`。玩家可在「庄园手记 → 美术来源与许可」离线查看完整署名。原有美术、代码和音频的许可保持原状。本轮没有新增音效或字体，没有收费素材。

## 原画花铺样板 · 2026-11-07

`src/assets/florist-original/original.jpg` 是用户本轮提供的花铺原画附件，1169×1280，原文件 SHA-256 为 `65894e680b4db173744c68b10af36c483657c911e4f8392a15cfce52109381e0`。手机聊天中收到的实际格式为 JPEG，已逐字节保留并直接作为游戏底图使用，没有重新压缩、重绘家具、生成地砖或替换原画。

作者未提供；使用依据为用户本轮明确要求将此附件制作成本项目场景，不将其宣称为 CC0，也不将它重新许可为 LPC 图集的 CC BY-SA 4.0。原权利归原权利人。六张透明 PNG 是原图的局部裁片，只改变 alpha，RGB 与原图对应区域一致。原图与这些裁片叠合的像素一致性已由制作脚本验证。来源、文件哈希、尺寸和加工方式见同目录 `SOURCE.json`、`layers.json`；轮廓记录见 `regions.json`。本轮没有新增外部素材、音效或字体。

## 晚风花铺 Skill 附带的高清原画（2026-11-07）

- 名称：`florist_original_concept.png`，1199×1312 RGB PNG，3,303,012 字节。
- 来源：用户上传的《曦光庄园》美术 Skill ZIP；原路径 `.agents/skills/xiguang-scene-art/assets/florist_original_concept.png`。
- 作者：用户提供的原创方向生成原画，未提供具名作者；不臆造署名。
- 授权：用户明确要求在本项目中使用、分层、构建并发布试玩；不是 CC0 声明，不将第三方参考截图作为可分发素材。
- 修改：游戏 `src/assets/scenes/florist/florist_original_concept.png` 与 ZIP 原文件逐字节相同；六张透明遮挡 PNG 仅裁切并写入 alpha，未重绘 RGB。叠回原图的像素一致性已验证。
- SHA-256：`3eb12dcd11994bae79eeda031a541a2db7684647e9a91b82dcefde858834a886`。
- 制作记录：`tools/prepare-florist-skill.py`、`src/assets/scenes/florist/SCENE_PLAN.md`、`SOURCE.json`。本轮没有引入外部图片、外部运行时链接、付费 API 或新 NPC。

## 全世界规划 · 玫瑰门庭主世界样板（2026-11-07）

- 本轮新增建筑、植物、纯地形三份原创生成源图，保留在 `src/assets/world/*-source.png`；实际尺寸、SHA-256、制作提示分别见 `atlas.json` 与 `GENERATION.json`。使用平台内置图像工具制作，未接入外部付费 API。没有复制用户提供的商业游戏/网页参考截图。
- 18个环境素材帧：住宅、温室花铺、糖果工坊、长椅、花拱门、喷泉；橡树、桦木、樱花、杉树、玫瑰、绣球、雏菊、向日葵、薰衣草、石块、花盆和三叶草。地面是独立纯地形层，场景物件不是合成背景里的复制品。
- 来源及使用：本项目本轮原创生成输出，按平台输出使用条款用于本项目；不冒称第三方CC0许可，不虚构具名作者。没有新增第三方下载素材；原项目既有 CC0/LPC 素材的作者和许可证记录继续保留。
- 技术处理：只规范透明度、选择树冠白底孔洞、图集切帧；完全透明像素RGB清零以压缩体积，可见RGB保持原图数值。三栋建筑窗灯由原图裁选暖色窗玻璃像素。原生成源文件未改写。少量植物细边仍需美术精修。
- 主角仍为项目原身份/服装；正面坐姿图集从已有 V6 原角色帧裁取并重排原腿部像素，不套用商业角色，也不以背向观景坐姿配正面长椅。没有宣称完成高细节新角色动画。
- `tools/pack-world-art.py` 可重建图集；`src/assets/world/SCENE_PLAN.md` 记录图层、碰撞与坐标；`ASSET_REQUESTS.json` 明确列出后续区域仍缺少的26类PNG。

## 正式新庄园与小屋首轮重制（2026-11-07）

新增 `src/assets/cottage/` 四张原创生成源PNG及42个道具/材质/状态裁片，原始文件、尺寸、SHA-256均保留在该目录`atlas.json`。来源是本轮平台内置图像工具的原创输出，未使用外部付费API、商业游戏截图或新增第三方下载素材；不虚构作者、不宣称CC0。原花铺附带的PNG与既有LPC/CC0作者许可保持原记录。

图片包括空房间建筑底板，独立床/沙发/柜/书架/壁炉/桌椅，以及原18种可布置物品、地毯、礼盒、空花圃、四种材质。`tools/prepare-cottage.py`只做alpha整理、裁片、原像素分层组合和材质连续边缘准备，不用简单图形模仿原画。帘架复用原生成秋千的雕花支撑，开合移动原帘布像素；烛台有无火焰状态；花架底座与真实收藏花束分层。六种花头来自本项目已有`world/botanical.png`原创图集。

运行资源使用逐像素验证的无损WebP，PNG与生成源仍在源码；处理方式与图层在`src/assets/cottage/SCENE_PLAN.md`记录。新门庭花圃复用这些木质种植箱，四块花圃映射原存档`plots[0..3]`；三棵树映射原`magic[0..2]`，不重复发放旧奖励。新图均在当前Workbox发行图内，没有运行时外链。

## 月光糖果工坊 · 场景连接修正（2026-11-07）

`src/assets/candy-atelier/`新增三张原创生成源PNG：空工坊建筑、八件独立工坊道具、九种糖果/铜碗/开合礼盒。来源为本轮平台内置图像工具输出，未下载第三方素材、未调用外部付费API，不盗用商业游戏画面，也不宣称CC0。源图尺寸和SHA-256、各裁片坐标在`atlas.json`；图像用于本项目，遵循平台输出使用条款。`tools/prepare-candy-atelier.py`仅做透明度整理、清除邻格溢出的不连通残片、裁切与无损WebP转换，可见主体像素保留。新增运行图为1张空房间、8件道具、12件物品及4张礼盒换色裁片，均保存在项目本地并纳入离线发行图。原项目既有作者与许可记录继续有效。

## 十二种可用鲜花（2026-11-07）

新增`src/assets/flowers/`两张原创生成源PNG及9个独立透明花卉裁片：郁金香、雏菊、绣球、芍药、鸢尾、波斯菊、百合、星花、铃兰。玫瑰、薰衣草和向日葵复用本项目已有`cottage/flower-*`源像素。新源图来自本轮内置图像工具，没有下载第三方素材、使用商业游戏截图或外部收费API，不宣称CC0。原始尺寸、SHA-256和逐帧裁片坐标保存在`flowers/atlas.json`，原有美术许可记录继续有效。

`tools/prepare-flowers.py`只执行分格裁切、alpha规范化、透明RGB清零及无损WebP转换，逐像素验证RGBA相等，不以几何绘图替代花朵。实际场景、图鉴、花铺图标和小屋花瓶均使用这些本地原图。花束仅合成原有包装纸与真实花朵像素；PNG原件保留。

## 白天主世界统一样板（2026-11-13）

`src/assets/daylight/`四张源PNG为本轮内置图像工具的原创输出：晨光纯地形、分离树干/树冠与低矮植物、小曦原服装16帧、小猫12帧。设计参考本项目已获用户认可的原花铺/角色，未采样商业游戏截图，没有第三方下载或外部付费API，不声明CC0；按平台输出使用条款用于本项目。原始尺寸、SHA-256与裁片坐标见`atlas.json`，四张源PNG原样保留。

`tools/prepare-daylight.py`只做alpha整理、原像素裁切、人物/猫咪最近邻归一化与无损WebP编码。9张运行资源均为本地导入，逐像素验证编码结果；不使用几何图形重画主体。现有用户花铺原画、LPC与CC0资源继续保留各自来源/完整作者/许可；没有把旧素材重新许可为本轮生成素材。

## 白天主世界加载优化（2026-11-13）

原`world/architecture.png`、`botanical.png`及`architecture-light.png`保留，运行改为无损WebP。没有缩小尺寸、减少颜色或重新绘制。`tools/pack-world-webp.py`逐像素检查完整RGBA一致，来源哈希与体积记录在`src/assets/world/transport.json`；现有来源与许可保持原样。三项合计减少1,238,757字节，不新增外部素材。

## 2026-11-13 · 小曦七套服装与场景一致性

- 名称：可可秋日、玫瑰奶霜、林间来信、草莓蝴蝶结、月眠珍珠、晨雾花笺四方向行走图集；七套衣服的正/背面坐姿。
- 作者/来源：本项目使用内置图像生成编辑工具，以已经认可的 `src/assets/daylight/xiaoxi-source.png` 为角色身份参考，按原有 `ADVENTURE.outfits` 的服装描述及配色制作；不是第三方游戏截图或素材下载。无外部来源URL，不宣称CC0。
- 本地原始文件：`src/assets/daylight/xiaoxi-{cocoa,rose,wild,berry,pearl,mist,seated}-source.png`；来源、尺寸与SHA-256逐项记入同目录 `character-atlas.json`。
- 修改：`tools/prepare-character-costumes.py`仅透明底清理、原画单元切帧、统一脚底与比例、最近邻像素缩放及PNG/无损WebP导出；WebP解码逐像素RGBA相等检查。没有以矩形、几何身体或自动重着色代替服装原画。
- 使用/许可记录：原创生成资源随本项目在GitHub公开源码及网页游戏中使用和分发，受生成服务适用条款约束，无第三方署名或付费资产要求；此记录不将生成内容重新授予CC0。

## 2026-11-14 · 用户原画极光花海

- 素材：`src/assets/aurora-original/user-original.jpg`，本会话用户提供并明确要求用于游戏的原创极光花海。实际文件为720×1280 JPEG，保留附件原始字节；同名PNG为其解码副本，不冒充额外高清源图。
- 作者/来源/许可：用户提供的原创作品；来源为本会话附件，无运行时外链。依据用户在本轮明确授权用于其《曦光庄园》项目公开预览与本地资源分发；不自行授予CC0。
- 修改：`scene.webp`为RGB校验相同的无损副本；`light-0..5.webp`和`stars.webp`只提取原有光幕/恒星像素与透明度，形状位置不变；两块`flower-*.webp`取自原图前景花簇。
- 局部修补：`foreground-repair-source.png`由内置图像生成编辑工具参考用户原图制作，仅其两个小蒙版区域作为移动花簇后的背景修补。原图的女孩、长椅、山脉、极光和整体花海不使用生成替代图。生成资源受服务适用条款约束，不宣称CC0，无第三方游戏素材。
- 制作记录：`tools/prepare-aurora-original.py`与同目录`atlas.json`保存原图及修补源图SHA-256、所有原图像素坐标、锚点和处理方式。图集均本地存储；未使用付费第三方素材或外部图片API。

## 2026-11-14 · 极光渐现/消散的夜景底图

- `src/assets/aurora-original/night-repair-source.png`：内置图像生成编辑工具基于用户原图制作的无极光夜空修补源图；仅用于软蒙版内的天空，不替代原画主体。
- `night-scene.webp`：`tools/prepare-aurora-night.py`将局部夜空修补合成到原图的极光区域；原月亮和紧凑白色星点受保护，y≥610的全部像素与上传图一致。原画文件和完整舒展画面未改变。处理方式、源图SHA-256与尺寸记录于`night-atlas.json`。
- 许可：用户在本会话授权原图用于该项目；局部生成编辑资源受生成服务适用条款约束，不宣称CC0，不含第三方游戏截图或外链运行资源。

## 2026-11-14 · 自由装修与流星雨

- 小屋继续使用 `src/assets/cottage/room.webp` 干净房壳及该目录原有透明高清家具；未重新绘制或降低美术分辨率。床、沙发、书桌、衣柜、书柜、壁炉、地毯改为可移动实例。墙饰使用同目录原有花枝纹理。原素材来源及许可沿用上面的记录。
- `src/assets/meteor-light/original-atlas.png`：本轮原创 AI 辅助生成的透明光效原件，非第三方商业游戏素材。制作日期 2026-11-14。项目原创建作使用，无外部素材署名条件。
- 同目录 9 个 WebP：对原创光效原件进行透明裁切、无损编码；分别为冰蓝、珍珠暖白、金紫曦光的拖尾、头部和星尘。裁切与 SHA-256 见 `manifest.json`。原件未覆盖，运行资源全部本地打包，未依赖图片外链。
- `public/home-stars-review/`：390×844 / 375×667 真实 Phaser 运行截图及正常速度录屏。`before-*` 来自保留的 `03e66eb` 发行版，非美术原画。

## 2026-11-14 · 林间秘密花园 / 完整版第一阶段

本轮没有引入新的第三方游戏素材，没有复制具体动画的场景、人物或独特设计。

- `src/assets/forest-garden/originals/`：7 张本项目原创 PNG（AI 辅助绘制与定向修图），包含乡野森林庭院、去除烘焙秋千/鱼的干净背景、四时段光照和透明幼苗/叶片素材。作者为曦光庄园项目原创制作，未引入第三方署名或再分发许可条件。原件尺寸、SHA-256 详见 `SOURCE.json`。
- 4 张全分辨率运行背景：887×1774，无损 WebP，已校验解码 RGB 与对应 PNG 逐像素一致。没有用重复地砖、矩形和多边形重新画景观。
- 4 张 1024×1024 前景图集：对各时段原画进行技术裁切与透明遮罩，包含古树、草丛、花拱门和六块花圃前沿。原始 RGB 保留；碰撞多边形仅用于逻辑，不绘制成场景。
- `props.webp` / `props.json`：原画中的秋千绳索/木座、前沿和两条鱼的透明裁切，加上原创幼苗、花瓣、叶片以及局部水面片段。干净背景已去除静态座椅、绳索和鱼，避免重复叠影。
- 小猫、七套人物服装、成熟花朵及微光复用项目已有本地素材，原来源和许可记录不变。
- `public/forest-garden-review/` 为真实游戏截图；修改前来自保留的 `0701f29` 对应发行图，人物、视口、时间和花圃状态一致。原画没有冒充实机截图。


## 2026-11-15 玩家身份与小猫素材

角色制作使用 Universal LPC 的**美术文件**，没有引入其 GPL 生成器代码。上游仓库与锁定版本：
https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/tree/04140673ec02906f8233523639733c83690df750 。
逐项作者、原素材 URL、所选许可证及修改说明见 [CREDITS.json](src/assets/identity/CREDITS.json)；原始 PNG、定义 JSON 与 SHA-256 均随源码保存。不能把 LPC 或 OpenGameArt 整个平台视为 CC0。

| 部件 | 所选许可证 | 作者（完整名单见上述 JSON） |
|---|---|---|
| body | OGA-BY 3.0 | bluecarrot16, Evert, TheraHedwig, Benjamin K. Smith (BenCreating), MuffinElZangano, Durrani, Pierre Vigier (pvigier), Eliza Wyatt (ElizaWy), Matthew Krohn (makrohn), Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| head | OGA-BY 3.0 | bluecarrot16, Benjamin K. Smith (BenCreating), Stephen Challener (Redshrike) |
| brow-thin | OGA-BY 3.0 | ElizaWy |
| brow-thick | OGA-BY 3.0 | ElizaWy |
| short | CC-BY-SA 3.0 | JaidynReiman, Joe White, Manuel Riecke (MrBeast) |
| medium | CC0 | bluecarrot16 |
| long | CC-BY-SA 3.0 | JaidynReiman, Manuel Riecke (MrBeast) |
| curly | OGA-BY 3.0 | ElizaWy |
| ponytail | OGA-BY 3.0 | JaidynReiman, ElizaWy, bluecarrot16 |
| ponytail-rear | OGA-BY 3.0 | JaidynReiman, ElizaWy, bluecarrot16 |
| twintails | CC-BY-SA 3.0 | Emilio J. Sanchez-Sierra, bluecarrot16 |
| fringe | CC-BY-SA 3.0 | JaidynReiman, Manuel Riecke (MrBeast) |
| shirt | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| tshirt | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| knit | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| sweater | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| jacket | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| vest | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| jeans | OGA-BY 3.0 | bluecarrot16, JaidynReiman, ElizaWy, Joe White, Matthew Krohn (makrohn), Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| casual | OGA-BY 3.0 | bluecarrot16, JaidynReiman, ElizaWy, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| casual | OGA-BY 3.0 | bluecarrot16, JaidynReiman, ElizaWy, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| wide | OGA-BY 3.0 | Nila122, JaidynReiman, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| wide | OGA-BY 3.0 | Nila122, JaidynReiman, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| cargo | OGA-BY 3.0 | ElizaWy, JaidynReiman, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| shorts | OGA-BY 3.0 | ElizaWy, JaidynReiman, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| longskirt | OGA-BY 3.0 | bluecarrot16, Matthew Krohn (makrohn), Lanea Zimmerman (Sharm) |
| shortskirt | OGA-BY 3.0 | bluecarrot16, Pierre Vigier (pvigier), Johannes Sjölund (wulax), Ahmad3366, JaidynReiman |
| sneakers | OGA-BY 3.0 | ElizaWy, JaidynReiman |
| leather | OGA-BY 3.0 | JaidynReiman, bluecarrot16, Johannes Sjölund (wulax) |
| leather | OGA-BY 3.0 | JaidynReiman, Joe White, Johannes Sjölund (wulax) |
| canvas | CC-BY-SA 3.0 | bluecarrot16, JaidynReiman, Thane Brimhall (pennomi), laetissima, Matthew Krohn (makrohn) |
| boots | OGA-BY 3.0 | ElizaWy, JaidynReiman, Stephen Challener (Redshrike), Johannes Sjölund (wulax) |
| glasses | CC-BY-SA 3.0 | bluecarrot16, Thane Brimhall (pennomi), laetissima |
| hat | OGA-BY 3.0 | bluecarrot16, JaidynReiman |
| scarf | CC-BY-SA 3.0 | Nila122, JaidynReiman, Johannes Sjölund (wulax), Stephen Challener (Redshrike) |
| backpack | CC-BY-SA 3.0 | Benjamin K. Smith (BenCreating), macmanmatty |
| hood | OGA-BY 3.0 | Johannes Sjölund (wulax), JaidynReiman |
| hairclip | OGA-BY 3.0+ | JaidynReiman |

本项目的组合角色衍生图集以 **CC-BY-SA 4.0** 提供，许可证副本位于 `src/assets/identity/licenses/`；原始 CC-BY-SA 3.0 素材仍按其原许可保留，衍生版本依其适用的后续版本条款使用 4.0。其他 OGA-BY、CC-BY、CC0 部件的作者及其许可同样随图集保留。源图的裁切、动作帧选择、脚点对齐、调色、格纹变体、衣裤延长、坐姿适配与小配饰锚点见 `atlas.json` 和 `tools/prepare-identity-art.py`。没有宣称把所有第三方原作改为本项目原创。

七种小猫由本轮图像生成工具原创制作，非下载的商业游戏角色，亦不宣称为 CC0。保留原始 20 姿态 PNG 与哈希于 `originals/cats/`，运行图集为 `cats/*.webp`（坐下、睡觉、伸展、四向走路）；处理脚本只做透明边缘清理、分帧、统一脚点和像素缩放。项圈/蝴蝶结复用上述有署名的围巾/发带局部，铃铛复用项目原有 atelier 图集。

极光原画只在原人物占据的区域进行局部去人修补：保留图像生成的修补母图、三个精确补丁矩形、原始/结果哈希于 `aurora-repair.json` 和 `originals/aurora-person-repair.png`。原天空、极光、山脉和花海未重绘；原长椅木条裁成 `aurora-bench-front.webp`，实时角色在其后显示。去人底图是原场景的衍生版本，不是新摄影素材。

本轮全部新增文件清单、体积及校验：[ASSET_INVENTORY.json](src/assets/identity/ASSET_INVENTORY.json)。运行时不访问外部素材网站。原始制作 PNG、许可证与测试截图不进入游戏离线包。
