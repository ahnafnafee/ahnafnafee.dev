const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 3001
const outDir = path.join(process.cwd(), 'out')
const root = path.resolve(outDir)

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
}

// True iff `target` resolves to a path inside (or equal to) `root`. Guards
// against URL-driven path traversal — `req.url` may be `/../../etc/passwd`.
function isInsideRoot(target) {
  return target === root || target.startsWith(root + path.sep)
}

// Resolve the request path to an actual file inside `outDir`. Returns null
// if no candidate exists or if any candidate escapes the root.
function resolveFile(filePath) {
  if (!isInsideRoot(filePath)) return null
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath
  } catch {
    return null
  }
  const html = filePath + '.html'
  if (isInsideRoot(html) && fs.existsSync(html)) return html
  const indexInDir = path.join(filePath, 'index.html')
  if (isInsideRoot(indexInDir) && fs.existsSync(indexInDir)) return indexInDir
  return null
}

const server = http.createServer((req, res) => {
  let requestedPath
  try {
    const raw = (req.url ?? '/').split('?')[0].split('#')[0]
    requestedPath = decodeURIComponent(raw)
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  const trailingSlash = requestedPath.endsWith('/') && requestedPath !== '/'
  const initial = path.resolve(path.join(root, requestedPath === '/' ? 'index.html' : requestedPath))

  if (!isInsideRoot(initial)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  const filePath = trailingSlash ? path.join(initial, 'index.html') : initial
  const resolved = resolveFile(filePath)
  if (!resolved) {
    res.writeHead(404)
    res.end('File not found')
    return
  }

  const extname = path.extname(resolved)
  const contentType = mimeTypes[extname] || 'application/octet-stream'

  fs.readFile(resolved, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Server error')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })
})

server.listen(port, () => {
  console.log(`🚀 Static export server running at http://localhost:${port}`)
  console.log(`📁 Serving files from: ${outDir}`)
  console.log('📝 Open http://localhost:3001 in your browser to test the export')
})
