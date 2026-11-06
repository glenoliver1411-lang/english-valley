"""Stage only this game's static build/source into its existing GitHub checkout.
Retain the two previously deployed asset graphs, so cached HTML never points
at a file deleted by the next publish. Does not commit, push or change saves.
Usage: python tools/stage-release.py /path/to/english-valley [--preview experience-preview]
"""
from pathlib import Path
import shutil,subprocess,sys,argparse,re
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
for item in dist.iterdir():
 if item.is_dir():shutil.copytree(item,site/item.name,dirs_exist_ok=True)
 else:shutil.copy2(item,site/item.name)
source=base/'source';source.mkdir(exist_ok=True)
for directory in ['src','tests','public','tools']:
 target=source/directory
 if target.exists():shutil.rmtree(target)
 shutil.copytree(project/directory,target,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
for name in ['package.json','package-lock.json','vite.config.js','index.html','aurora.html','.gitignore','.env.pwa-preview']:
 shutil.copy2(project/name,source/name)
for item in project.glob('*.md'):shutil.copy2(item,source/item.name)
(site/'.nojekyll').touch()
print('Staged '+str(site)+' and complete source; existing production retained for preview mode.')
