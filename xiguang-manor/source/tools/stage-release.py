"""Stage only this game's static build/source into its existing GitHub checkout.
Retain the two previously deployed asset graphs, so cached HTML never points
at a file deleted by the next publish. Does not commit, push or change saves.
Usage: python tools/stage-release.py /path/to/english-valley
"""
from pathlib import Path
import shutil,subprocess,sys
project=Path(__file__).resolve().parent.parent
repo=Path(sys.argv[1]).resolve();site=repo/'xiguang-manor';dist=project/'dist'
assert (repo/'.git').exists() and (site/'index.html').exists() and (dist/'index.html').exists()
assets=site/'assets';assets.mkdir(exist_ok=True)
# Use the deployed branch, even when staging from an isolated work branch.
for revision in ['origin/main','origin/main^']:
 for path in subprocess.check_output(['git','ls-tree','-r','--name-only',revision,'--','xiguang-manor/assets'],cwd=repo,text=True).splitlines():
  target=repo/path
  if not target.exists():target.write_bytes(subprocess.check_output(['git','show',f'{revision}:{path}'],cwd=repo))
# Never remove the older content-hashed files when installing a new graph.
for item in dist.iterdir():
 if item.is_dir():shutil.copytree(item,site/item.name,dirs_exist_ok=True)
 else:shutil.copy2(item,site/item.name)
source=site/'source';source.mkdir(exist_ok=True)
for directory in ['src','tests','public','tools']:
 target=source/directory
 if target.exists():shutil.rmtree(target)
 shutil.copytree(project/directory,target)
for name in ['package.json','package-lock.json','vite.config.js','index.html','aurora.html','.gitignore']:
 shutil.copy2(project/name,source/name)
for item in project.glob('*.md'):shutil.copy2(item,source/item.name)
(site/'.nojekyll').touch()
print('Staged only xiguang-manor; retained cached releases and copied complete source.')
