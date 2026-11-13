"""Lossless transport optimization only. All source PNGs remain untouched."""
from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib
p=Path(__file__).resolve().parents[1]/'src/assets/world';rows=[]
for name in ['architecture','botanical','architecture-light']:
 source=p/(name+'.png');target=p/(name+'.webp');im=Image.open(source);im.save(target,lossless=True,method=6,exact=True)
 assert np.array_equal(np.array(im),np.array(Image.open(target)))
 rows.append(dict(source=source.name,output=target.name,sourceBytes=source.stat().st_size,bytes=target.stat().st_size,width=im.width,height=im.height,sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),rgbaIdentical=True))
(p/'transport.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
