const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
};

// Clean-URL fallbacks (mirrors netlify.toml redirects)
const CLEAN_URLS = {
  '/login': '/login.html',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Root → index
  if (urlPath === '/') urlPath = '/index.html';

  // Clean-URL fallback
  if (CLEAN_URLS[urlPath]) urlPath = CLEAN_URLS[urlPath];

  // If no extension, try adding .html
  if (!path.extname(urlPath)) urlPath = urlPath + '.html';

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: serve index.html for unknown routes
      fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
