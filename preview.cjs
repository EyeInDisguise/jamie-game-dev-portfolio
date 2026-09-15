const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
http.createServer((req,res)=>{
  const requested = decodeURIComponent(req.url.split('?')[0]);
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\//, '');
  const candidate = path.resolve(root, relative);
  const safe = candidate.startsWith(path.resolve(root) + path.sep);
  let file = safe ? candidate : path.join(root, '404.html');
  if (safe && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    res.statusCode = 404;
    file = path.join(root, '404.html');
  }
  const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8';
  res.setHeader('Content-Type', type);
  fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
