export type Profile = 'signals' | 'stories' | 'new'

type SyntheticProfile = {
  label: string
  history: string[]
  baseline: string[]
  challenger: string[]
}

export const EVIDENCE = {
  requests: 35_905,
  unseenTargets: 12_305,
  baseline: 0.008007,
  challenger: 0.008681,
  difference: 0.000674,
  interval: [0.00004, 0.001338] as const
}

export const NEURAL_EVIDENCE = {
  validation: {
    label: 'Validation',
    requests: 33_993,
    popularity: 0.010715,
    hybrid: 0.011969,
    neural: 0.011774,
    intervalAgainstHybrid: [-0.000985, 0.000611] as const
  },
  test: {
    label: 'Previously studied test period',
    requests: 35_905,
    popularity: 0.008007,
    hybrid: 0.008681,
    neural: 0.008357,
    intervalAgainstHybrid: [-0.001014, 0.000304] as const
  }
} as const

export const PROFILES: Record<Profile, SyntheticProfile> = {
  signals: {
    label: 'Signals',
    history: ['Atlas Drift', 'Comet Circuit'],
    baseline: ['The Glass Grove', 'Hollow Harbor', 'Lantern Vale', 'Signal Runner', 'Tide and Timber'],
    challenger: ['Signal Runner', 'Orbit of Ash', 'Hollow Harbor', 'The Glass Grove', 'Lantern Vale']
  },
  stories: {
    label: 'Stories',
    history: ['The Glass Grove', 'Lantern Vale'],
    baseline: ['Atlas Drift', 'Comet Circuit', 'Hollow Harbor', 'Signal Runner', 'Tide and Timber'],
    challenger: ['Tide and Timber', 'Runebound', 'Hollow Harbor', 'Atlas Drift', 'Comet Circuit']
  },
  new: {
    label: 'New visitor',
    history: [],
    baseline: ['Atlas Drift', 'The Glass Grove', 'Comet Circuit', 'Hollow Harbor', 'Lantern Vale'],
    challenger: []
  }
}

export type RouteDecision = {
  useChallenger: boolean
  reason: string
}

export function resolveRoute(profile: Profile, gateOpen: boolean, challengerUnavailable: boolean): RouteDecision {
  if (PROFILES[profile].history.length === 0) {
    return { useChallenger: false, reason: 'No prior items: use the popularity baseline.' }
  }
  if (challengerUnavailable) {
    return { useChallenger: false, reason: 'Challenger unavailable: return the baseline.' }
  }
  if (!gateOpen) {
    return { useChallenger: false, reason: 'Validation gate closed: keep the baseline active.' }
  }
  return { useChallenger: true, reason: 'Validation gate approved: use the challenger.' }
}
