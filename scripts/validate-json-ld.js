// Walks the build output for prerendered HTML and validates every
// <script type="application/ld+json"> block: must parse, must have @context,
// must have @type or @graph. Exits 1 on any failure.
//
// Run after `yarn build` (uses .next/server/app) or `yarn export` (uses out/).
// Override target dir with --dir=<path>.

const fs = require('fs')
const path = require('path')

const argDir = (process.argv.find((a) => a.startsWith('--dir=')) || '').replace('--dir=', '')
const candidateDirs = argDir
  ? [argDir]
  : [path.join(process.cwd(), 'out'), path.join(process.cwd(), '.next', 'server', 'app')]

function findHtmlFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findHtmlFiles(full, acc)
    else if (entry.isFile() && entry.name.endsWith('.html')) acc.push(full)
  }
  return acc
}

function extractJsonLdBlocks(html) {
  const blocks = []
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  let match
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1])
  }
  return blocks
}

function validateBlock(raw, file, idx) {
  const errors = []
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    errors.push(`Invalid JSON: ${e.message}`)
    return { errors, parsed: null }
  }

  const objects = Array.isArray(parsed) ? parsed : [parsed]
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') {
      errors.push('Block is not an object')
      continue
    }
    if (!obj['@context']) errors.push('Missing @context')
    if (!obj['@type'] && !obj['@graph']) {
      errors.push('Missing both @type and @graph (need at least one)')
    }
    if (obj['@graph'] && !Array.isArray(obj['@graph'])) {
      errors.push('@graph must be an array')
    }
    if (obj['@graph']) {
      obj['@graph'].forEach((node, i) => {
        if (!node['@type']) errors.push(`@graph[${i}] missing @type`)
      })
    }
  }

  return { errors, parsed }
}

let target = null
for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    target = dir
    break
  }
}

if (!target) {
  console.error('[validate-json-ld] No build output found. Run `yarn build` or `yarn export` first.')
  console.error('Searched:', candidateDirs.join(', '))
  process.exit(1)
}

console.log(`[validate-json-ld] Scanning ${target}`)
const files = findHtmlFiles(target)
console.log(`[validate-json-ld] Found ${files.length} HTML files`)

let totalBlocks = 0
let totalErrors = 0
const failuresByFile = []

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
  const blocks = extractJsonLdBlocks(html)
  const fileErrors = []
  blocks.forEach((block, idx) => {
    totalBlocks += 1
    const { errors } = validateBlock(block, file, idx)
    if (errors.length) {
      fileErrors.push({ idx, errors })
      totalErrors += errors.length
    }
  })
  if (fileErrors.length) {
    failuresByFile.push({ file: path.relative(process.cwd(), file), errors: fileErrors })
  }
}

if (failuresByFile.length === 0) {
  console.log(`[validate-json-ld] OK — ${totalBlocks} JSON-LD blocks across ${files.length} files`)
  process.exit(0)
}

console.error(`[validate-json-ld] FAIL — ${totalErrors} error(s) in ${failuresByFile.length} file(s)`)
for (const failure of failuresByFile) {
  console.error(`\n${failure.file}`)
  for (const e of failure.errors) {
    console.error(`  block #${e.idx + 1}:`)
    for (const msg of e.errors) console.error(`    - ${msg}`)
  }
}
process.exit(1)
