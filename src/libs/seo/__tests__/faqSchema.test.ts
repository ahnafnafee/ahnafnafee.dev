import { describe, it, expect } from 'vitest'
import { buildFaqJsonLd } from '../faqSchema'

describe('buildFaqJsonLd', () => {
  it('builds a FAQPage with the supplied questions', () => {
    const result = buildFaqJsonLd([
      { q: 'What is OCR?', a: 'Optical character recognition.' },
      { q: 'Why local LLMs?', a: 'Privacy and offline access.' }
    ])

    expect(result['@context']).toBe('https://schema.org')
    expect(result['@type']).toBe('FAQPage')
    expect(result.mainEntity).toHaveLength(2)
  })

  it('shapes each item as a Question with an accepted Answer', () => {
    const result = buildFaqJsonLd([{ q: 'Q?', a: 'A.' }])
    const item = result.mainEntity[0]

    expect(item['@type']).toBe('Question')
    expect(item.name).toBe('Q?')
    expect(item.acceptedAnswer['@type']).toBe('Answer')
    expect(item.acceptedAnswer.text).toBe('A.')
  })

  it('returns an empty mainEntity for an empty input array', () => {
    const result = buildFaqJsonLd([])
    expect(result.mainEntity).toEqual([])
  })
})
