import { describe, it, expect } from 'vitest'
import { PERSON_ID, PERSON_REFERENCE, getPersonNode } from '../personSchema'

describe('personSchema', () => {
  it('exports a stable canonical @id URL', () => {
    expect(PERSON_ID).toBe('https://www.ahnafnafee.dev/#person')
  })

  it('PERSON_REFERENCE is a minimal Person node referencing PERSON_ID', () => {
    expect(PERSON_REFERENCE['@type']).toBe('Person')
    expect(PERSON_REFERENCE['@id']).toBe(PERSON_ID)
    expect(PERSON_REFERENCE.name).toBe('Ahnaf An Nafee')
  })

  describe('getPersonNode', () => {
    const node = getPersonNode()

    it('emits a Person with the canonical @id', () => {
      expect(node['@type']).toBe('Person')
      expect(node['@id']).toBe(PERSON_ID)
    })

    it('lists every social profile in sameAs (LinkedIn, GitHub, Scholar, ORCID)', () => {
      expect(node.sameAs).toEqual(expect.arrayContaining([
        expect.stringContaining('linkedin.com/in/ahnafnafee'),
        expect.stringContaining('github.com/ahnafnafee'),
        expect.stringContaining('scholar.google.com'),
        expect.stringContaining('orcid.org')
      ]))
    })

    it('declares occupation, employer, alma mater', () => {
      expect(node.jobTitle).toMatch(/PhD/i)
      expect(node.worksFor.name).toBe('George Mason University')
      expect(Array.isArray(node.alumniOf)).toBe(true)
      expect(node.alumniOf).toHaveLength(2)
    })

    it('exposes knowsAbout with research-relevant topics for AI Mode citation', () => {
      expect(node.knowsAbout.length).toBeGreaterThanOrEqual(20)
      expect(node.knowsAbout).toEqual(expect.arrayContaining([
        'Artificial Intelligence',
        '3D Computer Graphics',
        'Machine Learning for Graphics',
        'Generative AI'
      ]))
    })

    it('includes credentials (PhD + BS)', () => {
      expect(node.hasCredential).toHaveLength(2)
      expect(node.hasCredential[0].name).toMatch(/PhD/i)
      expect(node.hasCredential[1].name).toMatch(/BS/i)
    })

    it('serializes to valid JSON', () => {
      expect(() => JSON.stringify(node)).not.toThrow()
      const parsed = JSON.parse(JSON.stringify(node))
      expect(parsed['@type']).toBe('Person')
    })
  })
})
