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
