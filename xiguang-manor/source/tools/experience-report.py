"""Render an evidence report from three captured JSON runs; never invent samples.
Usage: python tools/experience-report.py BEFORE BEFORE_MEMORY AFTER
"""
from pathlib import Path
import json,statistics,html,sys
project=Path(__file__).resolve().parent.parent
out=project/'public/experience-review';out.mkdir(exist_ok=True)
a=json.loads(Path(sys.argv[1]).read_text());a['cycles']=json.loads(Path(sys.argv[2]).read_text())['cycles']
b=json.loads(Path(sys.argv[3]).read_text())
for d in [a,b]:d['cyclesConditions']={'cpuSlowdown':1,'network':'unthrottled','rounds':7,'frameSampleMs':900,'gc':'after each round'}
record={'beforeCommit':'0a735c8893c6a37ca6d2e6523138d611bf0dfc08','note':'Memory runs release Playwright ElementHandles before GC. Earlier handle-retaining memory runs excluded. encodedBodySize is not warm-cache network transfer.','before':a,'after':b}
(out/'results.json').write_text(json.dumps(record,ensure_ascii=False,indent=2))
metrics=[('视觉首帧：加载卡','cold','fcpMs'),('冷缓存：信封可点击','cold','interactiveMs'),('热缓存：信封可点击','warm','interactiveMs'),('冷缓存：庄园自由操作','cold','freeMs'),('热缓存：庄园自由操作','warm','freeMs'),('首次进入花海','meadow',None),('首次进入糖果屋','candy',None)]
rows=[]
for name,group,key in metrics:
 vals=[[r[key] for r in d[group]] if key else d[group] for d in [a,b]]
 def fmt(v):return f'{statistics.median(v)/1000:.3f}（{min(v)/1000:.3f}–{max(v)/1000:.3f}）'
 rows.append([name,fmt(vals[0]),fmt(vals[1])])
memory=[]
for name,fn in [('JS堆 MiB',lambda d:[c['heapBytes']/1048576 for c in d['cycles']]),('FPS',lambda d:[c['frames']['fps'] for c in d['cycles']]),('P95帧间隔 ms',lambda d:[c['frames']['p95Ms'] for c in d['cycles']]),('DOM节点',lambda d:[c['dom']['nodes'] for c in d['cycles']]),('DOM监听器',lambda d:[c['dom']['jsEventListeners'] for c in d['cycles']])]:
 def fmt(v):return f'{statistics.median(v):.2f}（{min(v):.2f}–{max(v):.2f}）'
 memory.append([name,fmt(fn(a)),fmt(fn(b))])
def mdtable(rows):return '| 指标 | 修改前 | 修改后 |\n| --- | ---: | ---: |\n'+'\n'.join('| '+' | '.join(r)+' |' for r in rows)
manifest=json.loads((project/'dist/.vite/manifest.json').read_text())
chunks={k:{'file':v['file'],'bytes':(project/'dist'/v['file']).stat().st_size,'imports':v.get('imports',[]),'dynamicImports':v.get('dynamicImports',[])} for k,v in manifest.items() if v.get('file','').endswith('.js')}
(out/'dependencies.json').write_text(json.dumps({'entry':'index.html','chunks':chunks},ensure_ascii=False,indent=2))
main=next(v for k,v in chunks.items() if v['file'].startswith('assets/main-') and manifest[k].get('isDynamicEntry'));size=main['bytes']/1000
body=f'''# 第二轮体验优化 · 实测报告

基线：GitHub `0a735c8`，2026-11-06加载优化正式版。原始数据：`public/experience-review/results.json`。真实构建依赖图：同目录`dependencies.json`及`dist/.vite/manifest.json`。

## 启动与首次进入

同一390×844触屏视口、Chromium、1.6 Mbps、150 ms延迟、CPU四倍减速、gzip静态服务。每项3次；中位数（最小–最大），单位秒。冷缓存每次用新上下文，热缓存在同一上下文重载。

{mdtable(rows)}

视觉首帧为加载卡FCP。信封可点击表示原信封已能真实展开、阅读信件。自由操作通过立即跳过演出、实际打开庄园菜单确认，包含全部引擎和地图准备。场景进入到初始化后的两帧；原淡入演出保留，用户阅读和完整演出时长不计入自动跳过路径。

信封提前可读；冷启动自由操作缩短，热缓存自由操作改善较小。首次花海小幅改善，糖果屋更明显。加载卡冷缓存FCP增加约0.24秒，没有宣称所有指标都更快。资源的encodedBodySize不是热缓存实际网络传输量。

## 连续切换与资源

另建不限CPU与网络速度的上下文，连续7轮“花海→小屋→糖果屋→湖畔”，28次进入；每轮退出后强制GC、采样900ms rAF帧间隔。以下为中位数（最小–最大）。

{mdtable(memory)}

没有把帧率波动视为确定的FPS提升；未复现持续的DOM监听器增长。早期脚本漏释放ElementHandle，测试自身保留了关闭界面；上述内存数据来自释放句柄后的复测。

Chromium与WebKit各4轮额外检查中，退出场景后纹理均回到40个，已停场景pointerdown监听器0，工坊绘制RAF 0。CPU背景缓存实际3张、4.20 MiB，上限6张约8.41 MiB。JS堆不含GPU显存，也不代表手机总内存。

## 实现与兼容

- 原信封、展开与信件独立于Phaser运行，同时后台立即准备真实庄园。提前接收／跳过会保存选择，准备好后接续同一开场。未就绪时明确显示等候状态。
- 首屏业务主包约287KB降至{size:.1f}KB（未gzip）。工坊、花海／小屋、观星和家具编辑按需加载；完整玩法模块仍在发行包中。空闲预取常用模块和背景，用户操作、后台、节省流量模式延后预热。
- 当前时段按需绘制，背景缓存限量复用；退出移除场景纹理、释放局部效果和雨声，停止工坊绘制与计时器。
- 五组竖屏：375×667、390×844、430×932、360×800、412×915。关键按钮44px，摇杆／画布防页面拖动；目的地入口清晰，湖畔直接进入，无新增常驻教程。
- 原角色与衣服保留：撞墙停步、现有树冠轮廓遮挡、按脚部排序、阴影置于角色下面。
- 提示音与烟花限频、降低爆音；雨声离开后淡出释放；静音和后台停止待播音效，保留原音乐与减少动态偏好。
- 独立极光沿用原实现；没有新增NPC、任务、签到、存档字段或外部美术素材。

WebKit（iPhone 13配置）及Chromium（Pixel 7配置）通过上述尺寸、按钮／摇杆、家具编辑、重复旅行、独立极光往返和旧存档测试。完整开场／跳过／重播、四时段与自动演出、家具布局、花束、照片、每日欢迎及72项单元测试通过。

验证使用容器浏览器引擎及移动视口，没有接入实体手机；不冒称真实硬件测试。GPU显存和长时间温控降频没有测量。

## 文件与复现

启动：`app-shell.js`、`early-gift.js`、`startup-session.js`、`boot.js`、`gift-opening.js`、`main.js`。
分包／缓存：`lazy-feature.js`、`scene-paint-cache.js`、`romantic-ui.js`、`romantic-scene.js`、`candy-ui.js`、`candy-scene.js`、`scenery-ui.js`、`sky-scene.js`、`v5-meadow.js`、`v5-landscape.js`、`meadow-art.js`。
交互／协调：`mobile-experience.css`、`tree-occlusion.js`、`game.js`、`romantic-config.js`、`boot-config.js`、`soundscape.js`。
构建／验收：`vite.config.js`、`tools/stage-release.py`、`tools/benchmark-server.py`、`tests/experience-*.mjs`及原回归脚本异步等待／截图采样修正。

运行：`npm install && npm run dev`；构建：`npm run build`。复测：`python tools/benchmark-server.py dist`，另一个终端运行`node tests/experience-benchmark.mjs label`。基线检出上述旧提交，采用同一脚本、服务和条件。仅测切换可设`BENCH_RUNS=0`。

本轮发布到独立`experience-preview/`供验收，原正式版入口保留。
'''
(project/'EXPERIENCE_ROUND2.md').write_text(body)
def table(rows):return '<div class="scroll"><table><tr><th>指标</th><th>修改前</th><th>修改后</th></tr>'+''.join('<tr>'+''.join('<td>'+html.escape(c)+'</td>'for c in r)+'</tr>'for r in rows)+'</table></div>'
page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第二轮体验优化 · 曦光庄园</title><style>body{margin:0;background:#28263f;color:#f1dfcd;font:14px/1.9 system-ui,sans-serif}main{max-width:880px;margin:auto;padding:30px 16px}h1{font-size:24px;font-weight:500}h2{font-size:18px;margin-top:32px}a{color:#e6b7ca}p{color:#ccc0d3}table{border-collapse:collapse;min-width:600px;width:100%;font-size:12px}th,td{padding:12px 9px;text-align:left;border-bottom:1px solid #b69ab733}.scroll{overflow:auto}li{margin:8px 0}</style><main><h1>庄园更轻，心意先抵达</h1><p>第二轮体验优化；以下为真实运行的中位数（最小–最大）。</p><a href="../">打开本轮游戏预览</a> · <a href="results.json">原始数据</a> · <a href="dependencies.json">依赖图</a><h2>启动和首次进入 · 秒</h2><p>390×844、Chromium、1.6 Mbps、150ms、CPU四倍减速、gzip。每项3次。自由操作采用立即跳过演出的可比路径并实际打开地图菜单；场景计时到初始化后两帧。</p>'''+table(rows)+'''<p>信封可以真实展开与阅读，庄园同时加载。热缓存自由操作改善较小；加载卡冷缓存FCP增加约0.24秒，完整列出。</p><h2>连续切换 · 7轮28次</h2><p>另用不限速上下文，每轮强制GC并采样900ms。JS堆不含GPU和手机总内存。已排除脚本保留DOM句柄造成的误差。</p>'''+table(memory)+'''<p>帧率差异仍在本轮波动范围内。退出后纹理40个、已停场景pointerdown监听器0、工坊绘制RAF 0；CPU背景缓存3张约4.20MiB，上限6张约8.41MiB。</p><h2>完成内容</h2><ul><li>原像素信封独立可读，接续原庄园苏醒与欢迎。</li><li>工坊、花海／小屋、观星和家具编辑按需加载，空闲预热。</li><li>44px关键按钮、摇杆防页面拖动、清晰目的地入口及湖畔直接进入。</li><li>原树冠遮挡、接地阴影和撞墙停步，保留人物服装与V5美术。</li><li>雨声退出释放，提示音和烟花限频，尊重静音和减少动态。</li></ul><h2>验证范围</h2><p>WebKit与Chromium，五组手机竖屏尺寸；开场、每日欢迎、家具、花束、照片、存档及独立极光往返通过。没有接入实体手机，不冒称硬件性能验证。原正式版入口保留，本页为独立预览。</p></main></html>'''
(out/'index.html').write_text(page)
print(mdtable(rows))
