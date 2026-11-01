# V5 素材来源与授权

核实和下载始于2026-10-31，交付于2026-11-01。没有付费图片生成、收费素材、商业游戏截取、第三方字体或运行时图片外链。

## 本轮实际纳入的新外部源图

### karsiori — FREE Pixel Art Flower Pack

- 作者：karsiori。
- 来源：https://karsiori.itch.io/free-pixel-art-flower-pack
- 具体授权：**CC0 1.0 Universal**。作者发布页的License info明确允许个人、商业项目使用，并在Asset license栏标明Creative Commons Zero v1.0 Universal。
- 再分发／修改：CC0允许修改、公开源码与素材再分发。本项目仍保留作者、URL、原文件名和哈希。
- 选择：15张PNG，包含11种花形、2种灌木、2种盆栽；没有把整包146个文件都放进游戏。
- 原件：`src/assets/v5/originals/`。逐项来源和SHA-256见`src/assets/v5/SOURCE.json`。
- 修改：保留原生像素簇和轮廓，重新统一花叶色阶，替换高饱和绿／紫为庄园的蓝绿、粉和淡紫；按不同距离、大小、朝向和群落组合进本地图集。原件不覆盖。

| 图集帧 | 原目录 / 选择颜色 | 用途 |
| --- | --- | --- |
| `flower-cosmos` | Flower 2 / TEAL | 中近景的分枝花与叶 |
| `flower-rose` | Flower 8 / PINK | 有层叠花瓣的玫瑰 |
| `flower-lily` | Flower 9 / PURPLE | 长叶与不同瓣形 |
| `flower-daisy` | Flower 11 / PINK | 低矮花簇 |
| `flower-lupin` | Flower 13 / PURPLE | 高低错落的穗状花 |
| `flower-tulip` | Flower 10 / PINK | 杯状花与修长叶 |
| `flower-bell` | Flower 6 / PURPLE | 下垂／簇状花形 |
| `flower-aster` | Flower 7 / PURPLE | 近景多瓣花 |
| `flower-chamomile` | FLower 5 / PINK | 独立细茎花 |
| `flower-low-pink` | Flower 3 / PINK | 远处和路缘的低矮花簇 |
| `flower-low-blue` | Flower 4 / TEAL | 远处低矮花簇 |
| `flower-bush-rose` | Bush 2 / PINK | 密集花灌木 |
| `flower-bush-leaf` | Bush 1 (No Flowers) / GREEN | 叶簇与近景植物基底 |
| `flower-pot-fern` | Flower Pot 1 / GREEN | 工坊中的盆栽 |
| `flower-pot-lily` | Flower Pot 4 / WHITE | 工坊中的花盆 |

### karsiori — FREE Pixel Art Mountains Tileset and Backgrounds

- 来源：https://karsiori.itch.io/free-pixel-art-mountains-tileset-and-backgrounds
- 授权：**CC0 1.0 Universal**，具体许可已经在旧[ASSET_CREDITS.md](ASSET_CREDITS.md)核实。
- 新选择：`Backgrounds/Mountains 1.png`、`Backgrounds/Mountains 2.png`，裁取顶部256像素为两张森林层。记录原下载哈希及发布裁图哈希。
- 继续采用：原有Mountains 3／4、Tree 1／2、Rock 3、Grass 1。它们此前已采用，原名与许可见旧记录。岩面改为不同裁取、距离、雾和色阶的组合；完整原生像素源图没有被当成简单多边形代替。
- 本地派生：`mountain-rock.png`、`mountain-forest-1.png`、`mountain-forest-2.png`、`mountain-forest-3.png`；树、岸石和草叶打入`atelier.png`。

CC0法律文本保存在`src/assets/v5/CC0-1.0.txt`，没有给未知来源的图片套用CC0。

## 本轮原创资源

`tools/build-v5-art.py`离线绘制主小屋、暖房、主地图糖果屋、小屋入口、床、壁炉、沙发、衣柜、书柜、书桌、地毯、12件家具、糖果陈列柜、工作台、烤炉、礼盒、搅拌盆、工具、9款糖果、7套衣服陈列图等。

这些是本轮原创程序像素绘图，最终以PNG图集发布，不是调用图片生成服务，也没有从其他商业游戏临摹或截取角色。完整92帧清单见[V5_ASSET_INVENTORY.md](V5_ASSET_INVENTORY.md)。项目原角色身份、行走动画、音乐和剧情资源继续保留；未另行改变仓库代码许可。

## 查看但未采用的候选

- [ChrisPpop — Night Sky - Pixel Art Background](https://chrisppop.itch.io/night-sky-pixel-art-background)：具体PNG包为CC0并可免费下载；已查看。其山形和云层较简化，不适合本轮提高山体细节的目标，没有收入工程。收费Aseprite包未购买。
- [Riclmbr — Cute Pixel Decor](https://riclmbr.itch.io/cute-pixel-decor-1000-interior-exterior-pixel-art-objects)、[aRdaonur — Cozy Cafe](https://ardaonur.itch.io/cozy-cafe-pixel-assets)：具体页虽写CC0，但获取包需要付费。本轮未购买、未下载或整合。

极光、流星与烟花继续采用项目已有原创代码；NOAA自然现象和SLYNYRD空间关系教程的历史参考记录保留，没有复制其图片、视频或付费素材。
