"""Stage only this game's static build/source into its existing GitHub checkout.
Retain the two previously deployed asset graphs, so cached HTML never points
at a file deleted by the next publish. Does not commit, push or change saves.
Usage: python tools/stage-release.py /path/to/english-valley [--preview experience-preview]
"""
from pathlib import Path
import shutil,subprocess,sys,argparse,re,json
project=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('repository');parser.add_argument('--preview');args=parser.parse_args()
repo=Path(args.repository).resolve();base=repo/'xiguang-manor';dist=project/'dist'
assert not args.preview or re.fullmatch(r'[a-z0-9-]{1,40}',args.preview)
site=base/args.preview if args.preview else base
assert (repo/'.git').exists() and (base/'index.html').exists() and (dist/'index.html').exists()
assets=site/'assets';assets.mkdir(parents=True,exist_ok=True)
# Use the deployed branch, even when staging from an isolated work branch.
for revision in ([] if args.preview else ['origin/main','origin/main^']):
 for path in subprocess.check_output(['git','ls-tree','-r','--name-only',revision,'--','xiguang-manor/assets'],cwd=repo,text=True).splitlines():
  target=repo/path
  if not target.exists():target.write_bytes(subprocess.check_output(['git','show',f'{revision}:{path}'],cwd=repo))
# Never remove the older content-hashed files when installing a new graph.
if args.preview in ('play-preview','v6-art-preview','reference-art-preview','florist-original-preview','florist-skill-preview'):
 # This new preview needs the playable graph and this round's evidence, not
 # copies of every historical art review. Existing hashed files remain safe.
 release=json.loads((dist/'offline-release.json').read_text())
 for name in [*[a['url'] for a in release['assets']],'offline-release.json','sw.js']:
  target=site/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dist/name,target)
 review={'v6-art-preview':'v6-review','play-preview':'play-review','reference-art-preview':'reference-review','florist-original-preview':'florist-review','florist-skill-preview':'florist-skill-review'}[args.preview]
 shutil.copytree(dist/review,site/review,dirs_exist_ok=True)
else:
 for item in dist.iterdir():
  if item.is_dir():shutil.copytree(item,site/item.name,dirs_exist_ok=True)
  else:shutil.copy2(item,site/item.name)
source=base/'source';source.mkdir(exist_ok=True)
if source.resolve()!=project:
 for directory in ['src','tests','public','tools']:
  target=source/directory
  if target.exists():shutil.rmtree(target)
  shutil.copytree(project/directory,target,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
 for name in ['package.json','package-lock.json','vite.config.js','index.html','aurora.html','.gitignore','.env.pwa-preview','.env.gameplay-preview','.env.art-preview','.env.reference-preview','.env.florist-preview','.env.florist-skill-preview']:
  shutil.copy2(project/name,source/name)
 for item in project.glob('*.md'):shutil.copy2(item,source/item.name)
(site/'.nojekyll').touch()
print('Staged '+str(site)+' and complete source; existing production retained for preview mode.')
