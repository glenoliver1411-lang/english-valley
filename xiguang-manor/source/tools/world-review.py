"""Package real-game evidence and the clearly labelled world planning diagram.
Only lossless screenshot encoding: no game/concept image compositing.
"""
from pathlib import Path
import json, hashlib, html, shutil
import numpy as np
from PIL import Image

project=Path(__file__).resolve().parents[1]
root=project/'public/world-region-review';root.mkdir(parents=True,exist_ok=True)
def screenshot(source,target):
 im=Image.open(project/source).convert('RGB');p=root/target;p.parent.mkdir(parents=True,exist_ok=True);im.save(p,lossless=True,method=6)
 assert np.array_equal(np.asarray(im),np.asarray(Image.open(p).convert('RGB'))),'Screenshots must keep every displayed pixel'
screenshot('verification/world-review/before/day.png','before/day.webp')
for name in ['day','overview','clean','bench','night','small','small-overview']:
 screenshot('verification/world-final-visual/chromium-'+name+'.png','after/'+name+'.webp')
for name in ['behind-house','front-house']:
 screenshot('verification/world-journey/chromium-'+name+'.png','after/'+name+'.webp')
shutil.copy2(project/'docs/world/world-layout.svg',root/'world-layout.svg')
shutil.copy2(project/'src/assets/world/ASSET_REQUESTS.json',root/'asset-requests.json')
shutil.copy2(project/'docs/world/WORLD_PLAN.md',root/'WORLD_PLAN.md')
reports={}
for engine in ['chromium','webkit']:
 reports[engine]={}
 for key,file in [('offline',f'verification/world-offline/{engine}.json'),('legacyOffline',f'verification/play-results/{engine}-offline.json'),('navigation',f'verification/world-journey/{engine}.json'),('visual',f'verification/world-final-visual/{engine}.json')]:
  d=json.loads((project/file).read_text());assert not d['errors'];reports[engine][key]=d
  if 'cache' in d:assert d['cache']['version']=='world-garden-20261107-1' and d['cache']['complete']
 p=project/f'verification/world-solo-profile/{engine}.json'
 if p.exists():reports[engine]['isolatedProductionProfile']=json.loads(p.read_text())
reports['notes']='Real browser mobile emulation. Earlier visual sampling included concurrent automation load; isolatedProductionProfile is a separate final production probe, never a physical iPhone result.'
(root/'validation.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
assets=json.loads((project/'src/assets/world/atlas.json').read_text())
assets['files']=[{'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for p in sorted((project/'src/assets/world').glob('*.png'))]
(root/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
style='''*{box-sizing:border-box}body{margin:0;background:#252b30;color:#f1e6d2;font:15px/1.85 system-ui,sans-serif}main{max-width:1000px;padding:28px 18px 70px;margin:auto}h1{font:500 29px/1.6 serif}h2{font-size:20px;font-weight:500;margin:35px 0 12px}p{color:#c7c4b7}a{color:#e8c596}img{width:100%;display:block;height:auto}figure{margin:0}figcaption{color:#c7c4b7;font-size:12px;padding:8px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.portrait{max-width:430px;margin:20px auto}.tabs{display:none;gap:8px;margin:12px 0}button,.pill{min-height:44px;padding:9px 16px;border:1px solid #ab9a84;border-radius:9px;color:#f1e6d2;background:#3b4144;font:inherit}button[aria-pressed=true]{background:#d3b28c;color:#302e33}details{padding:15px;background:#34383c;border-radius:10px;margin:14px 0}summary{min-height:44px;cursor:pointer}.note{font-size:13px}code{overflow-wrap:anywhere}td,th{text-align:left;border-bottom:1px solid #59615a;padding:10px;vertical-align:top}.table{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}.stamp{letter-spacing:.15em;color:#c3b09d;font-size:11px}@media(max-width:600px){.pair{grid-template-columns:1fr}.tabs{display:flex}.compare[data-side=after] figure:first-child,.compare[data-side=before] figure:last-child{display:none}h1{font-size:25px}}'''
head=lambda title:f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><style>{style}</style></head><body><main>'
foot='</main></body></html>'
page=head('曦光庄园 · 世界重制首区实机验收')+'''<span class="stamp">XIGUANG MANOR · ROSE COURT</span><h1>从一张原画，走向一整个世界</h1><p>本轮完成全世界审计、布局与素材规范，并把「玫瑰门庭」做成真实可走、可遮挡、可进出建筑的主世界样板。全地图尚未完成重制。</p><p><a class="pill" href="../?visit=world&amp;light=dawn&amp;v=world-garden-20261107-1">手机试玩门庭</a>　<a href="plan.html">全世界规划与素材缺口</a>　<a href="validation.json">浏览器验证数据</a></p>
<h2>同一手机视口 · 实际游戏对比</h2><p>390×844、DPR 2，同一继承存档与清晨条件。新旧区域布局与相机位置不同，不伪称同一机位。全部图片来自真实 Phaser 游戏；未使用概念图代替实机。</p><div class="tabs"><button data-side="before" aria-pressed="false">旧主地图</button><button data-side="after" aria-pressed="true">新门庭样板</button></div><div class="pair compare" data-side="after"><figure><figcaption>旧庄园 · 清晨实机</figcaption><a href="before/day.webp"><img src="before/day.webp" alt="旧主地图清晨游戏截图"></a></figure><figure><figcaption>玫瑰门庭 · 清晨实机</figcaption><a href="after/day.webp"><img src="after/day.webp" alt="新门庭清晨游戏截图"></a></figure></div>
<h2>一片完整可走的门庭</h2><p>35个独立物件、18个环境素材帧、独立地形与碰撞，按脚底Y排序遮挡。房门接回已完成的高清花铺、现有小屋与工坊；花径接回原花园、花海和湖畔。花朵采入实际库存，进花铺可以出售与包装。</p><figure class="portrait"><a href="after/clean.webp"><img loading="lazy" src="after/clean.webp" alt="隐藏UI后的完整门庭实机全景"></a><figcaption>游戏内「看全门庭」与隐藏界面。全景保留画幅比例，上下留白；跟随模式铺满视野。</figcaption></figure>
<h2>坐下与夜间窗灯</h2><div class="pair"><figure><a href="after/bench.webp"><img loading="lazy" src="after/bench.webp" alt="原角色正面坐在真实长椅上"></a><figcaption>坐姿保留原脸部和衣服；起身按钮移开角色位置，不再遮住身体。</figcaption></figure><figure><a href="after/night.webp"><img loading="lazy" src="after/night.webp" alt="新门庭夜间材质光照与温室暖窗"></a><figcaption>地形、建筑、植物、阴影与窗灯分别过渡；仍缺专门重绘的夜景地形。</figcaption></figure></div>
<h2>建筑前后 · 真正的遮挡</h2><div class="pair"><figure><a href="after/behind-house.webp"><img loading="lazy" src="after/behind-house.webp" alt="人物走到小屋后面被屋顶遮住"></a><figcaption>屋后：人物被建筑遮住，碰撞仍按实际地面占地计算。</figcaption></figure><figure><a href="after/front-house.webp"><img loading="lazy" src="after/front-house.webp" alt="人物绕到房屋前方"></a><figcaption>屋前：角色正常显示，脚下是贴地接触影。</figcaption></figure></div>
<h2>375×667 小屏幕</h2><figure class="portrait"><a href="after/small-overview.webp"><img loading="lazy" src="after/small-overview.webp" alt="375乘667真实浏览器视口的门庭全景"></a></figure>
<details open><summary>当前完成度与明确差距</summary><p>已完成世界规划和门庭样板，旧场景玩法已接通。森林、花谷、湖岸、风车果园、山顶、高清室内和遗迹三层仍按规划待重制；没有空入口冒充已完成区域。</p><p>人物仍是原32×40动画，植物细边仍需精修。门庭暂用晴天地形，四时段是材质/阴影/窗灯预览，并非四套专门重绘的景色；雨雪和全世界无缝地形过渡还需素材。</p><p>已通过模拟 Chromium/WebKit 的真实操作、完全断网重开与旧玩法回归。真机iPhone的长时性能仍待验收；无头云端帧率不能当作手机帧率。详细数据见<a href="validation.json">验证记录</a>。</p></details><details><summary>资源来源、离线和文件</summary><p>新增素材是本轮原创生成PNG，制作提示与哈希有记录；没有复用用户截图中的商业素材，没有运行时外部图片链接。图集仅做alpha准备、切帧与透明像素清理；可见像素不重画。<a href="assets.json">实际资源清单</a>。</p><p>原单存档 <code>xiguang-manor-v1</code> 与全部库存保留；新区域只另记位置偏好，不是第二套游戏进度。新图与所有懒加载模块进入原 Workbox 离线缓存。正式版和既有预览没有覆盖。</p><p><a href="https://github.com/glenoliver1411-lang/english-valley/blob/main/xiguang-manor/source/WORLD_REMASTER_STAGE1.md">修改报告</a> · <a href="https://github.com/glenoliver1411-lang/english-valley/tree/art/world-garden-sample/xiguang-manor/source">独立开发分支源码</a></p></details>'''+'''<script>document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelector('.compare').dataset.side=b.dataset.side;document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});</script>'''+foot
(root/'index.html').write_text(page)
requests=json.loads((project/'src/assets/world/ASSET_REQUESTS.json').read_text())['requests']
rows=''.join('<tr><td>'+html.escape(x['region'])+'</td><td><code>'+html.escape(x['file'])+'</code><br>'+('×'.join(map(str,x['recommendedPixels'])))+'</td><td>'+html.escape(x['requirements'])+'</td></tr>'for x in requests)
plan=head('曦光庄园 · 全世界美术规划')+'''<span class="stamp">WORLD PLAN · NOT A GAME SCREENSHOT</span><h1>全世界重制规划 · 第一阶段</h1><p>目标仍是重制整个庄园。本轮门庭用于验证可复用制作方式，不把项目缩成只有一个区域。</p><p><a href="../?visit=world&amp;light=dawn&amp;v=world-garden-20261107-1">试玩门庭</a> · <a href="index.html">查看真实实机对比</a> · <a href="https://github.com/glenoliver1411-lang/english-valley/blob/main/xiguang-manor/source/docs/world/WORLD_PLAN.md">完整源码规划</a></p><h2>总体连接示意</h2><p>下面是规划图，不是已经制作好的世界地图或游戏截图。森林、果园、山顶仍待制作；紫色入口接回现有玩法。</p><a href="world-layout.svg"><img src="world-layout.svg" alt="全世界区域连接规划图，非实机截图"></a>
<h2>统一制作规范</h2><p>3/4俯视；奶油金、雾紫、暖木与鼠尾草绿；光从左上照来，阴影向右下。新建筑约300～500世界单位高，保留小曦原角色身份，后续需专门制作高细节动作图集。所有图片等比缩放，保持清晰像素边缘。</p><p>地形、道路/岸线、阴影、可碰撞物件、脚底Y排序、屋顶/树冠前景、稀疏动态与UI分层。每件可互动对象有稳定ID、图片帧、脚底占地、可达站位和动作；不能靠图片猜碰撞。</p><p>户外区域验收后逐步做边缘预加载和无缝连接。室内、遗迹楼层、抬头观星与独立极光保留出入口。纯地形层加独立物件，不拼接完整房间原画当大地图。</p>
<h2>按区域执行</h2><ol><li>玫瑰门庭：本轮样板，可行走与采花，接通所有主要既有入口。</li><li>花谷、晨露森林：花簇与生长、树干/树冠、溪流与桥。</li><li>湖畔、栈桥与远山：可走岸线、局部倒影和分层远景。</li><li>风车果园与山顶：风车叶片、收获果树、山路和观日平台。</li><li>晚风花铺：保留已认可原画；二楼需补干净背景和遮挡后再开放。</li><li>小屋及糖果工坊：无家具底板、精细家具/工具图集与使用帧，保留全部交易及布置。</li><li>遗迹三层：墙地材质、机关危险帧、宝箱开合与出口，原随机/临时背包/结算不变。</li></ol>
<h2>仍缺少的26类正式PNG</h2><p>以下全部标记为待制作，不以粗糙几何占位替代。人物、昼夜专用变体及可无缝过渡的地形也是正式缺口。</p><div class="table"><table><thead><tr><th>区域</th><th>文件与建议尺寸</th><th>要求</th></tr></thead><tbody>'''+rows+'''</tbody></table></div><p><a href="asset-requests.json">下载机器可读素材需求清单</a></p><h2>存档与手机保护</h2><p>保留单存档和旧坐标，新增世界位置只作单独偏好记录；不存第二套货币/物品。家具保留室内局部坐标，正式迁移前以版本和稳定门口ID映射。地图按片区加载，图集低于手机常见2048纹理上限，反复进入复用；减少动态时关闭装饰性运动，保持核心画面清晰。</p><p>每个阶段都要实际手机视口截图和触屏/碰撞/遮挡/出入口/断网重开验收。当前仍未宣称全地图达到原画完成度。</p>'''+foot
(root/'plan.html').write_text(plan)
print('Prepared mobile review and world plan; lossless screenshots verified.')
