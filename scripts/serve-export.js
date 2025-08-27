const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;
const outDir = path.join(process.cwd(), 'out');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(outDir, req.url === '/' ? 'index.html' : req.url);
  
  // Handle trailing slashes by looking for index.html
  if (req.url.endsWith('/') && req.url !== '/') {
    filePath = path.join(outDir, req.url, 'index.html');
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Try adding .html extension
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    } else {
      // Try looking for index.html in directory
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
    }
  }

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`🚀 Static export server running at http://localhost:${port}`);
  console.log(`📁 Serving files from: ${outDir}`);
  console.log('📝 Open http://localhost:3001 in your browser to test the export');
});