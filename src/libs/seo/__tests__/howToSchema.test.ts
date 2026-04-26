import { describe, it, expect } from 'vitest'
import { buildHowToJsonLd } from '../howToSchema'

describe('buildHowToJsonLd', () => {
  const baseInput = {
    name: 'Build a local OCR pipeline',
    steps: [
      { name: 'Install dependencies', text: 'Run pip install ...' },
      { name: 'Configure layout detection', text: 'Edit config.yaml ...' }
    ]
  }

  it('builds a HowTo with the supplied steps in order', () => {
    const result = buildHowToJsonLd(baseInput)

    expect(result['@context']).toBe('https://schema.org')
    expect(result['@type']).toBe('HowTo')
    expect(result.name).toBe(baseInput.name)
    expect(result.step).toHaveLength(2)
  })

  it('numbers steps via 1-based position', () => {
    const result = buildHowToJsonLd(baseInput)
    expect(result.step[0].position).toBe(1)
    expect(result.step[1].position).toBe(2)
  })

  it('marks each step with @type HowToStep', () => {
    const result = buildHowToJsonLd(baseInput)
    for (const step of result.step) {
      expect(step['@type']).toBe('HowToStep')
    }
  })

  it('omits optional fields when not provided', () => {
    const result = buildHowToJsonLd(baseInput)
    expect('description' in result).toBe(false)
    expect('totalTime' in result).toBe(false)
    expect('image' in result).toBe(false)
  })

  it('includes optional fields when provided', () => {
    const result = buildHowToJsonLd({
      ...baseInput,
      description: 'Set up a privacy-first OCR pipeline',
      totalTime: 'PT30M',
      image: 'https://example.com/cover.png'
    })

    expect(result.description).toBe('Set up a privacy-first OCR pipeline')
    expect(result.totalTime).toBe('PT30M')
    expect(result.image).toBe('https://example.com/cover.png')
  })

  it('includes step image and url only when present', () => {
    const result = buildHowToJsonLd({
      name: 'Demo',
      steps: [
        { name: 'Plain step', text: 'Do nothing' },
        {
          name: 'Rich step',
          text: 'Read these docs',
          url: 'https://example.com/docs',
          image: 'https://example.com/diagram.png'
        }
      ]
    })

    expect('url' in result.step[0]).toBe(false)
    expect('image' in result.step[0]).toBe(false)
    expect(result.step[1].url).toBe('https://example.com/docs')
    expect(result.step[1].image).toBe('https://example.com/diagram.png')
  })
})
