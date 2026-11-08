import { GET as blog } from '../blog/route'
import { GET as portfolio } from '../portfolio/route'

import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

describe.each([
  ['blog', blog, 'local-llm-pdf-ocr'],
  ['portfolio', portfolio, 'songmirror']
] as const)('%s metadata', (section, handler, knownSlug) => {
  it('preserves canonical metadata and the redirect for a known document', async () => {
    const response = await handler(new NextRequest(`https://example.test/meta/${section}?slug=${knownSlug}`))
    expect(response.status).toBe(200)
    const html = await response.text()
    const document = new DOMParser().parseFromString(html, 'text/html')
    expect(document.querySelector('link[rel=canonical]')?.getAttribute('href')).toBe(
      `https://www.ahnafnafee.dev/${section}/${knownSlug}`
    )
    expect(document.querySelectorAll('script')).toHaveLength(1)
    expect(document.querySelector('script')?.textContent).toContain(
      `window.location.href = "https://www.ahnafnafee.dev/${section}/${knownSlug}"`
    )
  })

  it.each(['\"><script>alert(1)</script>/../../', 'a\";alert(1);a=\"/../', 'nested\\\\..\\\\', '%2e%2e%2f'])(
    'rejects malicious normalized aliases (%s)',
    async (prefix) => {
      const slug = encodeURIComponent(prefix + knownSlug)
      const response = await handler(new NextRequest(`https://example.test/meta/${section}?slug=${slug}`))
      expect(response.status).toBe(404)
      expect(await response.text()).not.toContain('<script>')
    }
  )

  it('keeps the missing-parameter response', async () => {
    const response = await handler(new NextRequest(`https://example.test/meta/${section}`))
    expect(response.status).toBe(400)
  })
})
