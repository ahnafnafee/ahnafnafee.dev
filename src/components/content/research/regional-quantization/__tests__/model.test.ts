import {
  countBands,
  FRAME,
  MARKED_BLOCK,
  median,
  offsetAt,
  offsetForProtection,
  P95_DIFFERENCES,
  RIDERS
} from '../model'

import { describe, expect, it } from 'vitest'

describe('frame-180 block map', () => {
  it('holds the full 84 by 43 stereo map with the reported offset histogram', () => {
    expect(FRAME.deltas).toHaveLength(FRAME.columns * FRAME.rows)
    const histogram = FRAME.deltas.reduce<Record<number, number>>((acc, d) => ({ ...acc, [d]: (acc[d] ?? 0) + 1 }), {})
    expect(histogram).toEqual({ [-3]: 2276, 0: 4, 1: 4, 2: 2, 8: 29, 9: 3, 12: 1294 })
    expect(countBands(FRAME.deltas)).toEqual({ finer: 2276, unchanged: 4, coarser: 1332 })
  })

  it('requests -3 at the cockpit block traced in the report', () => {
    expect(offsetAt(MARKED_BLOCK.column, MARKED_BLOCK.row)).toBe(-3)
  })
})

describe('offsetForProtection', () => {
  it('reproduces the map extremes for full and zero protection', () => {
    expect(offsetForProtection(1).final).toBe(-3)
    expect(offsetForProtection(0).final).toBe(12)
  })

  it('never requests finer precision for a less protected block', () => {
    const finals = [0, 0.25, 0.5, 0.75, 1].map((p) => offsetForProtection(p).final)
    expect([...finals].sort((a, b) => b - a)).toEqual(finals)
  })
})

describe('rider data', () => {
  it('matches the reported p95 differences and their median', () => {
    for (const rider of RIDERS) {
      expect(rider.regional.p95Ms - rider.fixed.p95Ms).toBeCloseTo(P95_DIFFERENCES[rider.id], 1)
    }
    expect(median(Object.values(P95_DIFFERENCES))).toBe(-0.07)
  })
})
