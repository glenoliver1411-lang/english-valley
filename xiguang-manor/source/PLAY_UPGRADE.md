# 生活玩法独立预览 · 2026-11-06

试玩：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/play-preview/?v=play-20261106-1>

本轮只发布 `play-preview/`，已验证的 `experience-preview/` 和正式根目录不变。源代码位于仓库原 `xiguang-manor/source/`。开发分支 `gameplay/living-manor`；回退标签 `before-gameplay-20261106`。

## 怎么玩

- 主地图「在庄园里走走」→「晚风花海」采花；每次采花进入真实库存，种植收获也入库。花朵图鉴只记录发现，不随出售减少。
- 「晚风花铺」可直接进入，也能从花海／花园进入。走近柜台、包装台、花柜可互动，或用室内快捷按钮。单朵出售，选满三朵并选择包装，花束可卖、收藏或放入小屋花瓶。没有顾客 NPC。
- 花铺「家具与装饰」或小屋「布置小屋→新装饰」购买六件新家具。旧十二件仍免费。永久拥有后可摆放、转向、收起；空间不足先收起一件。灯、投影、窗帘和花柜可开关，沙发与落地花藤秋千可以坐下。
- 主地图「本局背包」或池塘入口开始遗迹。先用「提灯照影」，点击宝箱后走近并解扣；移动会中断开箱。用「月影穿行」通过藤蔓，按显示顺序触摸星纹机关，使本层藤蔓退去并关闭危险地纹。三层路线与宝箱位置按本局种子生成；「月影星盘」指向未开宝箱。
- 危险地纹有安静、预警、亮起三个阶段。灯火紧张度满时返回庄园，入口附近可以缓和紧张。无体力费和入场费。完整三层以约 5–8 分钟为设计目标，不设强制计时。
- 在永久「藏珍手记」点花冠、胸针、守夜灯、猫铃可分别装备／卸下。角色身上有真实图像；守夜灯照亮身边并减轻地纹伤害，猫铃让猫跟随。旧版已选中的这类宝物在第一次迁移时保留装备状态。

## 撤离与存档规则

1. 箱子里的宝物及所附糖果先进入临时背包；不会立即进入永久库存。
2. 点击「本局战利品→走向出口并安全撤离」会实际走向入口石阶；深入时须先解机关或使用穿行技能返回。也可在第三层解锁深处出口。到达真实出口后全部安全入库。
3. 灯火失稳或确认「放弃本局」才按失败结算。本局先抽取 30%–70% 的保留概率，再对每件战利品独立抽取；结算显示实际留下与丢失的物品。小背包可能全部留下或全部丢失，并非保证留下固定比例。
4. 永久宝物、已买家具、服装和已装备物品不参与损失。一局只结算一次；刷新不能再次开同一宝箱或重复领结算。
5. 「暂存休息」、保存退出、刷新或关页保留同一局，之后继续，不自动撤离或洗掉战利品。
6. 新交易／拾取／结算采用同一次 `localStorage` 写入；失败则撤回整笔变动，遗迹无法保存时暂停并提供重试。耐久交易建立会话检查点，「不保存本次」不能回滚已售／已买／已结算内容。

继续使用 `xiguang-manor-v1` 单存档；仅新增 `play.version=1` 子字段，不建立角色或第二套进度。旧图鉴不会凭空变成可卖库存。导出／导入 JSON 支持新增字段，版本不支持的文件会拒绝导入。预览与旧版在同一域名共用原存档；建议先在庄园手记导出备份，并避免同时用旧版和新版写档，旧版无法理解新增玩法字段。

## 资源和文件

新增原创图集 41 帧，清单和来源见 [ASSET_CREDITS.md](ASSET_CREDITS.md)；没有新的第三方素材或运行时外链。

- 配置与交易：`src/play-config.js`、`play-model.js`、`save.js`、`backup-model.js`、`session-model.js`、`session-ui.js`。
- 花铺：`florist-scene.js`、`florist-ui.js`、`play-assets.js`、`play.css`。
- 遗迹：`expedition-model.js`、`expedition-art.js`、`expedition-ui.js`、`ruins-scene.js`、`ruins-navigation.js`、`adventure-ui.js`、`soundscape.js`。
- 家具与装备接入：`home-config.js`、`home-ui.js`、`home-art.js`、`equipment-layer.js`、`romantic-ui.js`、`romantic-scene.js`、`environment.js`、`lakeside-actors.js`、`candy-scene.js`、`aurora-page.js`、`game.js`、`main.js`。
- 资源制作和发布：`tools/build-play-art.py`、`.env.gameplay-preview`、`package.json`、`tools/stage-release.py`、`.gitignore`。
- 测试：`tests/play-economy.test.js`、`expedition.test.js`、`v5-art.test.js`、`play-florist-journey.mjs`、`play-home-journey.mjs`、`play-expedition-journey.mjs`、`play-offline-journey.mjs`；本地生产测试夹具 `tools/pwa-test-server.mjs` 仅增加可配置路径，不发布管理接口。

## 本地运行与检查

```sh
npm ci
npm run dev
npm test
MANOR_RELEASE=play-20261106-1 npm run build:play:preview
```

浏览器验证记录与实机截图位于 `public/play-review/`。详细结果见该目录 `validation.json`。遗迹深层机关／失败的开发验证使用固定手机视口和测试定位以缩短重复走路时间；生产离线验证没有游戏调试入口，真实触摸移动、开箱和撤离。

### 已完成的验收

| 检查 | 实际结果 |
| --- | --- |
| Node 回归与新玩法模型 | 92 项通过，0 失败；含失败写入整笔回滚、旧档迁移、结算幂等及 400 个种子的失败物品保护。 |
| Chromium / WebKit 遗迹 | 四装备可见、真实触摸开箱、同局刷新、一次撤离、解机关、下层保留临时包、真实危险触发失败、重启不重复发奖，均通过。 |
| 六件家具 | 用真实花铺按钮全部购买，收起旧免费家具后六件同时摆放；四开关与两坐姿及起身通过。 |
| Chromium / WebKit 生产断网 | 联网完整安装后关闭整个浏览器；同一用户目录离线启动，且服务器强制 503。首次进入花海／花铺／小屋／糖果屋／遗迹／极光均成功。售花、三花包装、购买摆放、烹糖、刷新续局和真实撤离均保存。 |
| 离线资源审计 | 两内核均报告 33 项发行资源，响应体合计 2,474,543 字节；另有 57 字节完整安装标记，缓存共 34 个条目。所有必需资源均命中，无缺失、无游戏脚本错误。 |
| 存档 | 断网关闭浏览器再启动，`play`、旧永久宝物、衣服、房间布局、猫名、口味、糖果、制作进度与音乐偏好一致；导出 JSON 包含新字段。 |

手机截图集：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/play-preview/play-review/>。

## 边界

本轮提供三种可复现的分层路线组合、随机箱位与定时危险区域，不增加恐怖敌人或巡逻 NPC。新增秋千是可放入小屋的独立落地家具，未增加庄园地图编辑器。花束目前在现有小屋花架展示一束，其余可收藏。测试中的 WebKit 是浏览器内核模拟，不代表已经在实体 iPhone 上安装；手机主屏幕安装及浏览器清理数据行为仍需真机验收。
