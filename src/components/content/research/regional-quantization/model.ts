import frame180 from './frame180.json'

/** Measured block map exported from the report's frame-180 reconstruction. */
export const FRAME = frame180

/** Report Figure 3 traces this cockpit block from source to encoder coordinates. */
export const MARKED_BLOCK = { column: 24, row: 5 } as const

export type OffsetBand = 'finer' | 'unchanged' | 'coarser'

export const bandOf = (offset: number): OffsetBand => (offset < 0 ? 'finer' : offset === 0 ? 'unchanged' : 'coarser')

export const offsetAt = (column: number, row: number) => FRAME.deltas[row * FRAME.columns + column]

export const countBands = (deltas: readonly number[]) =>
  deltas.reduce<Record<OffsetBand, number>>(
    (counts, offset) => {
      counts[bandOf(offset)] += 1
      return counts
    },
    { finer: 0, unchanged: 0, coarser: 0 }
  )

const clip = (value: number) => Math.max(-12, Math.min(12, value))

/**
 * Block offset for one protection value, following the report's equations:
 * w = b + (w_high - b) p, d = clip(round(-6 log2(w / mean)), q = min(d + s, 12).
 * shortcut: the mean weight comes from the frame's mean protection at the central background
 * weight, ignoring the edge falloff, so mid-range values are approximate.
 */
export const offsetForProtection = (protection: number) => {
  const { importantWeight: high, backgroundWeight: low, meanProtection, budgetShift } = FRAME
  const weight = low + (high - low) * protection
  const meanWeight = low + (high - low) * meanProtection
  const initial = clip(Math.round(-6 * Math.log2(weight / meanWeight)))
  return { weight, meanWeight, initial, final: Math.min(initial + budgetShift, 12) }
}

export type RegionKey = 'road' | 'cockpit' | 'hazard'

/** Matched replay, 288 scored frames. Supplement RESULTS.md and report Figure 4. */
export const REPLAY = {
  frames: 288,
  mbps: { fixed: 15.263222, regional: 15.033178 },
  bitChangePercent: -1.51,
  regions: [
    { key: 'road', label: 'Road', eye: 'Left', views: 288, mseReduction: 16.2515, ssimDiff: 0.011667 },
    { key: 'road', label: 'Road', eye: 'Right', views: 288, mseReduction: 15.595, ssimDiff: 0.010766 },
    { key: 'cockpit', label: 'Cockpit', eye: 'Left', views: 288, mseReduction: 15.5337, ssimDiff: 0.013257 },
    { key: 'cockpit', label: 'Cockpit', eye: 'Right', views: 288, mseReduction: 15.1952, ssimDiff: 0.012591 },
    { key: 'hazard', label: 'Hazards', eye: 'Left', views: 210, mseReduction: 15.6433, ssimDiff: 0.012582 },
    { key: 'hazard', label: 'Hazards', eye: 'Right', views: 220, mseReduction: 15.935, ssimDiff: 0.01286 }
  ],
  wholeEye: [
    { eye: 'Left', mseReduction: -22.0661, ssimDiff: -0.009508 },
    { eye: 'Right', mseReduction: -21.6212, ssimDiff: -0.010028 }
  ]
} as const

export type RiderId = 'P101' | 'P102' | 'P103' | 'P104' | 'P105'

type ConditionValues = {
  clarity: number
  smoothness: number
  imi: number
  fms: readonly [number, number]
  seconds: number
  mbps: number
  p95Ms: number
  longestFrameMs: number
}

export type Rider = {
  id: RiderId
  firstRide: 'fixed' | 'regional'
  mapAppliedPercent: number
  clearerChoice: string
  nextSessionChoice: string
  fixed: ConditionValues
  regional: ConditionValues
}

/** Five paired riders. Report Figures 5, 8 and 9 and Tables 2 and 3. */
export const RIDERS: readonly Rider[] = [
  {
    id: 'P101',
    firstRide: 'fixed',
    mapAppliedPercent: 99.75,
    clearerChoice: 'No difference',
    nextSessionChoice: 'No preference',
    fixed: {
      clarity: 5,
      smoothness: 4,
      imi: 5.71,
      fms: [0, 14],
      seconds: 169,
      mbps: 15.51,
      p95Ms: 64.22,
      longestFrameMs: 110.3
    },
    regional: {
      clarity: 5,
      smoothness: 5,
      imi: 5.29,
      fms: [1, 13],
      seconds: 178,
      mbps: 15.48,
      p95Ms: 69.03,
      longestFrameMs: 119.4
    }
  },
  {
    id: 'P102',
    firstRide: 'regional',
    mapAppliedPercent: 99.7,
    clearerChoice: 'Fixed foveation',
    nextSessionChoice: 'Could not compare',
    fixed: {
      clarity: 4,
      smoothness: 4,
      imi: 3.86,
      fms: [0, 1],
      seconds: 318,
      mbps: 15.49,
      p95Ms: 63.74,
      longestFrameMs: 265.2
    },
    regional: {
      clarity: 5,
      smoothness: 6,
      imi: 4.43,
      fms: [1, 2],
      seconds: 322,
      mbps: 15.52,
      p95Ms: 67.67,
      longestFrameMs: 310.0
    }
  },
  {
    id: 'P103',
    firstRide: 'fixed',
    mapAppliedPercent: 97.53,
    clearerChoice: 'No difference',
    nextSessionChoice: 'No preference',
    fixed: {
      clarity: 6,
      smoothness: 7,
      imi: 3.57,
      fms: [0, 9],
      seconds: 325,
      mbps: 14.97,
      p95Ms: 73.95,
      longestFrameMs: 367.7
    },
    regional: {
      clarity: 7,
      smoothness: 7,
      imi: 5.29,
      fms: [0, 3],
      seconds: 419,
      mbps: 15.54,
      p95Ms: 69.78,
      longestFrameMs: 1291.8
    }
  },
  {
    id: 'P104',
    firstRide: 'regional',
    mapAppliedPercent: 99.23,
    clearerChoice: 'No difference',
    nextSessionChoice: 'No preference',
    fixed: {
      clarity: 7,
      smoothness: 7,
      imi: 7,
      fms: [0, 0],
      seconds: 220,
      mbps: 15.23,
      p95Ms: 76.29,
      longestFrameMs: 149.7
    },
    regional: {
      clarity: 7,
      smoothness: 7,
      imi: 7,
      fms: [0, 0],
      seconds: 179,
      mbps: 14.76,
      p95Ms: 76.22,
      longestFrameMs: 79.7
    }
  },
  {
    id: 'P105',
    firstRide: 'fixed',
    mapAppliedPercent: 99.9,
    clearerChoice: 'Could not compare',
    nextSessionChoice: 'Regional',
    fixed: {
      clarity: 7,
      smoothness: 7,
      imi: 7,
      fms: [0, 13],
      seconds: 218,
      mbps: 15.44,
      p95Ms: 68.5,
      longestFrameMs: 90.0
    },
    regional: {
      clarity: 7,
      smoothness: 7,
      imi: 7,
      fms: [5, 11],
      seconds: 230,
      mbps: 15.47,
      p95Ms: 64.24,
      longestFrameMs: 101.9
    }
  }
]

/** Regional minus fixed p95 software delay as reported, rounded to 0.01 ms. */
export const P95_DIFFERENCES: Record<RiderId, number> = {
  P101: 4.81,
  P102: 3.93,
  P103: -4.16,
  P104: -0.07,
  P105: -4.25
}

export type LatencyRecalculation = 'recorded' | 'withoutQueue' | 'withoutGame'

/** Report section 6.6: each recalculation re-ranks events, so the reductions do not add. */
export const RECALCULATED_GAPS: Record<'P101' | 'P102', Partial<Record<LatencyRecalculation, number>>> = {
  P101: { recorded: 4.81, withoutQueue: 0.39 },
  P102: { recorded: 3.93, withoutQueue: 1.22, withoutGame: 1.46 }
}

export const median = (values: readonly number[]) => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
