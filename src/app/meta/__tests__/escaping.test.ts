import { getContentBySlug } from '@/services/content'

import { GET as blog } from '../blog/route'
import { GET as portfolio } from '../portfolio/route'

import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/services/content', () => ({ getContentBySlug: vi.fn() }))

describe.each([
  ['blog', blog],
  ['portfolio', portfolio]
] as const)('%s metadata output encoding', (section, handler) => {
  it('keeps hostile field values inside their intended text, attribute and script contexts', async () => {
    const hostile = '\"><img src=x onerror=alert(1)></script><script>alert(2)</script>'
    const header = {
      slug: hostile,
      title: hostile,
      summary: hostile,
      author_name: hostile,
      published: hostile,
      date: hostile,
      image: hostile,
      stack: [hostile],
      topics: [hostile]
    }
    vi.mocked(getContentBySlug).mockResolvedValue({ content: '', header })
    const response = await handler(new NextRequest(`https://example.test/meta/${section}?slug=known-post`))
    expect(response.status).toBe(200)
    const document = new DOMParser().parseFromString(await response.text(), 'text/html')
    expect(document.querySelectorAll('script')).toHaveLength(1)
    expect(document.querySelector('img')).toBeNull()
    expect(document.querySelector('title')?.textContent).toBe(`${hostile} | Ahnaf An Nafee`)
    const canonical = `https://www.ahnafnafee.dev/${section}/${encodeURIComponent(hostile)}`
    expect(document.querySelector('link[rel=canonical]')?.getAttribute('href')).toBe(canonical)
    expect(document.querySelector('script')?.textContent).toContain(JSON.stringify(canonical))
    expect(document.querySelector('meta[name=description]')?.getAttribute('content')).toBe(hostile)
  })
})
