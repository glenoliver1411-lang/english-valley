import gzip,sys
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
root=Path(sys.argv[1]).resolve()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
 def end_headers(self):
  self.send_header('Cache-Control','public, max-age=3600' if '/assets/' in self.path else 'no-cache')
  super().end_headers()
 def send_head(self):
  p=Path(self.translate_path(self.path))
  if p.is_dir():p=p/'index.html'
  if p.is_file() and p.suffix in ['.js','.css','.html','.json'] and 'gzip' in self.headers.get('Accept-Encoding',''):
   from io import BytesIO
   data=gzip.compress(p.read_bytes(),compresslevel=6);self.send_response(200);self.send_header('Content-Type',self.guess_type(str(p)));self.send_header('Content-Encoding','gzip');self.send_header('Content-Length',str(len(data)));self.end_headers();return BytesIO(data)
  return super().send_head()
ThreadingHTTPServer(('0.0.0.0',4173),Handler).serve_forever()
