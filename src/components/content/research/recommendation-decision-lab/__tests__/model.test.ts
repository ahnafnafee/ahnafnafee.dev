import { resolveRoute } from '../model'

import { describe, expect, it } from 'vitest'

describe('resolveRoute', () => {
  it('opens personalization only for known history, an approved gate, and an available challenger', () => {
    expect(resolveRoute('signals', true, false).useChallenger).toBe(true)
    expect(resolveRoute('signals', false, false).useChallenger).toBe(false)
    expect(resolveRoute('signals', true, true).useChallenger).toBe(false)
    expect(resolveRoute('new', true, false)).toEqual({
      useChallenger: false,
      reason: 'No prior items: use the popularity baseline.'
    })
  })
})
