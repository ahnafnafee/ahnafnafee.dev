import { serializeJsonForHtml } from '../serializeJson'

import { describe, expect, it } from 'vitest'

describe('serializeJsonForHtml', () => {
  it('preserves data while preventing HTML script termination', () => {
    const value = { url: '</script><script>alert(1)</script>', title: 'Quotes " and & symbols\u2028\u2029' }
    const serialized = serializeJsonForHtml(value)
    expect(serialized).not.toContain('<')
    expect(serialized).not.toMatch(/[\u2028\u2029]/)
    expect(JSON.parse(serialized)).toEqual(value)
    const document = new DOMParser().parseFromString(
      `<script type="application/ld+json">${serialized}</script>`,
      'text/html'
    )
    expect(document.querySelectorAll('script')).toHaveLength(1)
    expect(JSON.parse(document.querySelector('script')!.textContent!)).toEqual(value)
  })

  it('also safely encodes inline JavaScript string values', () => {
    const destination = 'https://example.test/\";</script><img src=x onerror=alert(1)>'
    const serialized = serializeJsonForHtml(destination)
    expect(serialized).not.toContain('</script>')
    expect(JSON.parse(serialized)).toBe(destination)
  })
})
