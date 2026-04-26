import { describe, expect, it } from 'vitest'
import { dateFormat, dateStringToISO } from '../dateFormat'

describe('dateFormat', () => {
  it('formats with the en-GB default (DD Month YYYY)', () => {
    const out = dateFormat('05/05/2024')
    // en-GB full date — accept either dotted or comma variants depending on ICU build
    expect(out).toMatch(/Sunday, 5 May 2024|Sunday 5 May 2024/)
  })

  it('honors a custom locale', () => {
    const out = dateFormat('05/05/2024', 'en-US')
    expect(out).toMatch(/May 5, 2024/)
  })

  it('honors custom DateTimeFormatOptions', () => {
    const out = dateFormat('05/05/2024', 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    expect(out).toBe('May 5, 2024')
  })
})

describe('dateStringToISO', () => {
  it('converts MM/DD/YYYY to an ISO date string', () => {
    const iso = dateStringToISO('05/05/2024')
    expect(iso).toMatch(/^2024-05-05T/)
    expect(iso.endsWith('Z')).toBe(true)
  })

  it('handles already-ISO input', () => {
    const iso = dateStringToISO('2024-05-05')
    expect(iso).toMatch(/^2024-05-05T/)
  })
})
