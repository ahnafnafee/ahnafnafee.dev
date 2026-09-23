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
