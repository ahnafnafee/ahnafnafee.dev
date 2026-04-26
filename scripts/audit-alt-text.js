// Scans MDX content for <ContentImage> / <img> alts that look weak
// (empty, generic placeholders, filename-shaped, "click here" patterns, very short).
// Report-only — does not modify files. Run with `yarn audit:alt-text`.

const fs = require('fs')
const path = require('path')

const ROOTS = [path.join(__dirname, '..', 'src', 'data', 'blog'), path.join(__dirname, '..', 'src', 'data', 'portfolio')]
const WEAK_PATTERNS = [
  /^image$/i,
  /^photo$/i,
  /^screenshot$/i,
  /^picture$/i,
  /^thumbnail$/i,
  /^illustration$/i,
  /^icon$/i,
  /^logo$/i,
  /^banner$/i,
  /^cover$/i,
  /click here/i,
  /\.(png|jpg|jpeg|gif|svg|webp)$/i // looks like a filename
]

function findMdx(root, acc = []) {
  if (!fs.existsSync(root)) return acc
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name)
    if (entry.isDirectory()) findMdx(full, acc)
    else if (entry.isFile() && entry.name.endsWith('.mdx')) acc.push(full)
  }
  return acc
}

function* extractAlts(content) {
  // <ContentImage ... alt="..." /> or <ContentImage ... alt='...'>
  // Also covers raw <img alt="...">
  const re = /<(ContentImage|img)\b([^>]*)>/g
  let m
  while ((m = re.exec(content))) {
    const tag = m[1]
    const attrs = m[2]
    const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/)
    const lineNum = content.slice(0, m.index).split('\n').length
    yield {
      tag,
      alt: altMatch ? (altMatch[1] ?? altMatch[2] ?? altMatch[3] ?? '') : null,
      hasAlt: !!altMatch,
      line: lineNum,
      raw: m[0].slice(0, 120)
    }
  }
}

function classify(alt) {
  if (alt === null) return 'MISSING'
  if (!alt.trim()) return 'EMPTY'
  if (alt.trim().length < 10) return 'TOO_SHORT'
  for (const p of WEAK_PATTERNS) {
    if (p.test(alt.trim())) return 'WEAK'
  }
  return 'OK'
}

const findings = { MISSING: [], EMPTY: [], TOO_SHORT: [], WEAK: [] }
let totalImages = 0

for (const root of ROOTS) {
  for (const file of findMdx(root)) {
    const content = fs.readFileSync(file, 'utf8')
    for (const img of extractAlts(content)) {
      totalImages += 1
      const verdict = classify(img.alt)
      if (verdict !== 'OK') {
        findings[verdict].push({
          file: path.relative(process.cwd(), file),
          tag: img.tag,
          line: img.line,
          alt: img.alt,
          raw: img.raw
        })
      }
    }
  }
}

const totalIssues =
  findings.MISSING.length + findings.EMPTY.length + findings.TOO_SHORT.length + findings.WEAK.length

console.log(`[audit-alt-text] Scanned ${totalImages} image tags across MDX content`)
console.log(`[audit-alt-text] Found ${totalIssues} potential issue(s)\n`)

const sections = [
  ['MISSING', 'No alt attribute at all (likely fails next/image type-check, but raw <img> may slip through)'],
  ['EMPTY', 'Empty alt — only valid for purely decorative images'],
  ['TOO_SHORT', 'Alt under 10 chars — usually not descriptive enough for screen readers / image search'],
  ['WEAK', 'Generic ("image", "screenshot") or filename-shaped alt — describe content instead']
]

for (const [key, label] of sections) {
  const list = findings[key]
  if (list.length === 0) continue
  console.log(`\n## ${key} (${list.length})`)
  console.log(`   ${label}`)
  for (const f of list) {
    console.log(`   ${f.file}:${f.line}  alt=${JSON.stringify(f.alt)}`)
  }
}

if (totalIssues === 0) {
  console.log('\n[audit-alt-text] OK — no weak alts found.')
}
process.exit(0)
