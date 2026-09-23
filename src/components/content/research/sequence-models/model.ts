/** Aggregate results from the verified Study B test, not demo output. */
export const STUDY_B = {
  users: 961,
  ndcg: [
    { id: 'popularity', label: 'Recent popularity', value: 0.049606, color: '#3B82F6' },
    { id: 'mean', label: 'Mean encoder', value: 0.039466, color: '#94A3B8' },
    { id: 'gru', label: 'GRU', value: 0.036919, color: '#F59E0B' },
    { id: 'transformer', label: 'Transformer', value: 0.050921, color: '#8B5CF6' }
  ],
  primaryDifference: 0.014002,
  primaryInterval: [0.008097, 0.020201] as const,
  popularityGap: 0.001315,
  order: {
    gru: [
      { label: 'Original basket order', value: 0.03976 },
      { label: 'Permuted baskets', value: 0.039823 }
    ],
    transformer: [
      { label: 'Original basket order', value: 0.046206 },
      { label: 'Permuted baskets', value: 0.05226 },
      { label: 'No learned positions', value: 0.050369 }
    ]
  },
  forwardMs: {
    cpu: { gru: 2.799, transformer: 1.736 },
    cuda: { gru: 4.968, transformer: 3.679 }
  }
} as const

export type SequenceScenario = 'short' | 'long' | 'unknown'

type SyntheticHistory = {
  label: string
  description: string
  baskets: readonly (readonly string[])[]
  futureTarget: string
}

export const SYNTHETIC_HISTORIES: Record<SequenceScenario, SyntheticHistory> = {
  short: {
    label: 'Two baskets',
    description: 'Two usable positive-rating timestamps remain before the forecast origin.',
    baskets: [['Atlas Drift', 'Comet Circuit'], ['Signal Runner']],
    futureTarget: 'Lantern Vale'
  },
  long: {
    label: 'Five baskets',
    description: 'The model keeps the baskets in timestamp order, without ordering items inside a tied basket.',
    baskets: [
      ['Hollow Harbor'],
      ['The Glass Grove', 'Lantern Vale'],
      ['Comet Circuit'],
      ['Signal Runner'],
      ['Orbit of Ash']
    ],
    futureTarget: 'Tide and Timber'
  },
  unknown: {
    label: 'Unknown-only',
    description: 'Earlier ratings exist, but none of their items belong to the training vocabulary.',
    baskets: [],
    futureTarget: 'Lantern Vale'
  }
}

export const canAttend = (queryPosition: number, historyPosition: number) => historyPosition <= queryPosition
