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

// Resolve a candidate file path that's guaranteed to live under `root`.
// Returns the absolute path of an existing regular file, or null otherwise.
// Containment is enforced via `path.relative` (the CodeQL-recognized barrier
// for js/path-injection): a value is in-tree iff its relative path doesn't
// climb out and isn't itself absolute.
function safeResolveFile(candidate) {
  const abs = path.resolve(candidate)
  const rel = path.relative(root, abs)
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs
  } catch {
    return null
  }
  return null
}

const server = http.createServer((req, res) => {
  let urlPath
  try {
    const raw = (req.url ?? '/').split('?')[0].split('#')[0]
    urlPath = decodeURIComponent(raw)
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  // Reject explicit traversal segments before any path operations. Keeps the
  // taint flow shallow and makes the safeResolveFile barrier the only sink
  // CodeQL has to reason about.
  if (urlPath.split(/[/\\]/).some((seg) => seg === '..')) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  const trailingSlash = urlPath.endsWith('/') && urlPath !== '/'
  const base = urlPath === '/' ? 'index.html' : urlPath
  const candidate = path.join(root, base)

  // Try a small fixed set of candidates in order. `safeResolveFile` re-checks
  // containment for each (defense in depth — covers the case where any
  // future change introduces additional path manipulation).
  const candidates = trailingSlash
    ? [path.join(candidate, 'index.html')]
    : [candidate, candidate + '.html', path.join(candidate, 'index.html')]

  let resolved = null
  for (const c of candidates) {
    resolved = safeResolveFile(c)
    if (resolved) break
  }

  if (!resolved) {
    res.writeHead(404)
    res.end('Not found')
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
