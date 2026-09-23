'use client'

import { useState } from 'react'

type View = 'evidence' | 'routing'
type Profile = 'signals' | 'stories' | 'new'

const EVIDENCE = {
  requests: 35_905,
  unseenTargets: 12_305,
  baseline: 0.008007,
  challenger: 0.008681,
  difference: 0.000674,
  interval: [0.00004, 0.001338] as const
}

type SyntheticProfile = {
  label: string
  history: string[]
  baseline: string[]
  challenger: string[]
}

const PROFILES: Record<Profile, SyntheticProfile> = {
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

const MAX_SCORE = 0.012
const formatScore = (value: number) => value.toFixed(6)

type RankingProps = {
  label: string
  caption: string
  items: string[]
  selected?: boolean
}

const Ranking: React.FunctionComponent<RankingProps> = ({ label, caption, items, selected = false }) => (
  <div
    className={`bg-card text-card-foreground min-w-0 rounded-xl border p-4 transition-colors ${selected ? 'border-purple-500 ring-1 ring-purple-500/30' : 'border-border'}`}
  >
    <div className='border-border mb-3 flex flex-wrap items-start justify-between gap-2 border-b pb-3'>
      <div>
        <h4 className='text-card-foreground m-0 text-sm font-semibold'>{label}</h4>
        <p className='text-muted-foreground m-0 text-xs'>{caption}</p>
      </div>
      {selected && (
        <span className='rounded-full bg-purple-600 px-2 py-0.5 text-[11px] font-semibold text-white'>
          Returned list
        </span>
      )}
    </div>
    {items.length > 0 ? (
      <ol className='divide-border m-0 list-none divide-y p-0'>
        {items.map((item, index) => (
          <li
            key={item}
            className='text-card-foreground flex items-start gap-3 py-2 text-sm leading-5 first:pt-0 last:pb-0'
          >
            <span className='text-muted-foreground w-5 shrink-0 text-right font-mono text-xs'>{index + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ) : (
      <p className='text-muted-foreground m-0 text-sm leading-6'>No personalized list for this request.</p>
    )}
  </div>
)

export const RecommendationDecisionLab: React.FunctionComponent = () => {
  const [view, setView] = useState<View>('evidence')
  const [profile, setProfile] = useState<Profile>('signals')
  const [gateOpen, setGateOpen] = useState(false)
  const [simulateFailure, setSimulateFailure] = useState(false)

  const scenario = PROFILES[profile]
  const canUseChallenger = scenario.history.length > 0 && gateOpen && !simulateFailure
  const fallbackReason =
    scenario.history.length === 0
      ? 'No prior items: use the popularity baseline.'
      : simulateFailure
        ? 'Challenger unavailable: return the baseline.'
        : gateOpen
          ? 'Validation gate approved: use the challenger.'
          : 'Validation gate closed: keep the baseline active.'

  return (
    <section
      aria-label='Interactive recommendation evidence and routing demonstration'
      className='not-prose border-border bg-card text-card-foreground my-9 overflow-hidden rounded-2xl border shadow-sm'
    >
      <div className='border-border border-b px-5 py-5 sm:px-7'>
        <p className='m-0 text-xs font-bold tracking-[0.16em] text-purple-700 uppercase dark:text-purple-300'>
          Explore the decision
        </p>
        <h3 className='text-card-foreground mt-1 mb-2 text-xl font-bold sm:text-2xl'>Evidence first, then routing</h3>
        <p className='text-muted-foreground m-0 max-w-2xl text-sm leading-6'>
          Inspect the held-out scores or trace a request through a synthetic fallback scenario. The two views are
          separate: demo controls do not change the measured results.
        </p>
        <div className='mt-5 grid grid-cols-2 gap-2 sm:flex' aria-label='Explore decision lab views'>
          {(
            [
              ['evidence', 'Measured evidence'],
              ['routing', 'Route simulator']
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type='button'
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-3 sm:text-sm ${view === key ? 'border-purple-600 bg-purple-600 text-white' : 'border-border bg-background text-foreground hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'evidence' ? (
        <div className='bg-muted/20 space-y-5 p-5 sm:p-7'>
          <div>
            <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
              Held-out category · full catalog
            </p>
            <h4 className='text-card-foreground mt-1 mb-4 text-lg font-semibold'>Musical Instruments</h4>
            <div className='space-y-4'>
              {(
                [
                  ['Recent popularity', EVIDENCE.baseline, '#3B82F6'],
                  ['Personalized hybrid', EVIDENCE.challenger, '#8B5CF6']
                ] as const
              ).map(([label, value, barColor]) => (
                <div key={label}>
                  <div className='mb-1 flex items-baseline justify-between gap-3 text-sm'>
                    <span className='text-card-foreground font-medium'>{label}</span>
                    <span className='text-card-foreground font-mono tabular-nums'>{formatScore(value)} NDCG@10</span>
                  </div>
                  <div
                    aria-hidden='true'
                    className='overflow-hidden rounded-full'
                    style={{ height: 12, backgroundColor: 'var(--muted)' }}
                  >
                    <div
                      className='rounded-full'
                      style={{ width: `${(value / MAX_SCORE) * 100}%`, height: '100%', backgroundColor: barColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className='text-muted-foreground mt-2 mb-0 text-xs'>
              Bars start at zero and share a 0 to 0.012 NDCG@10 scale.
            </p>
            <div className='mt-5 grid gap-3 sm:grid-cols-3'>
              <div className='border-border bg-card rounded-lg border p-3'>
                <p className='text-muted-foreground m-0 text-xs'>Eligible requests</p>
                <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
                  {EVIDENCE.requests.toLocaleString()}
                </p>
              </div>
              <div className='border-border bg-card rounded-lg border p-3'>
                <p className='text-muted-foreground m-0 text-xs'>Targets unseen in training</p>
                <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
                  {EVIDENCE.unseenTargets.toLocaleString()}
                </p>
              </div>
              <div className='border-border bg-card rounded-lg border p-3'>
                <p className='text-muted-foreground m-0 text-xs'>Paired difference</p>
                <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
                  +{formatScore(EVIDENCE.difference)}
                </p>
              </div>
            </div>
            <p className='text-muted-foreground mt-4 mb-0 text-sm leading-6'>
              User-cluster 95% interval for the paired difference: [{formatScore(EVIDENCE.interval[0])},{' '}
              {formatScore(EVIDENCE.interval[1])}]. These are offline review-retrieval scores from one temporal split,
              not online engagement or causal lift.
            </p>
          </div>
        </div>
      ) : (
        <div className='bg-muted/20 space-y-5 p-5 sm:p-7'>
          <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
            Synthetic titles and histories
          </p>
          <div className='flex flex-wrap gap-2' aria-label='Choose invented visitor history'>
            {(['signals', 'stories', 'new'] as const).map((key) => (
              <button
                key={key}
                type='button'
                aria-pressed={profile === key}
                onClick={() => setProfile(key)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${profile === key ? 'border-blue-500 bg-blue-500 font-semibold text-white' : 'border-border bg-card text-card-foreground hover:border-blue-500'}`}
              >
                {PROFILES[key].label}
              </button>
            ))}
          </div>
          <p className='text-muted-foreground m-0 text-sm leading-6'>
            <span className='text-card-foreground font-semibold'>Prior items:</span>{' '}
            {scenario.history.length > 0 ? scenario.history.join(', ') : 'none yet'}
          </p>
          <div className='flex flex-wrap gap-3'>
            <button
              type='button'
              aria-pressed={gateOpen}
              onClick={() => setGateOpen((value) => !value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${gateOpen ? 'border-purple-500 bg-purple-600 text-white' : 'border-border bg-card text-card-foreground hover:border-purple-500'}`}
            >
              Validation gate: {gateOpen ? 'approved' : 'closed'}
            </button>
            <button
              type='button'
              aria-pressed={simulateFailure}
              onClick={() => setSimulateFailure((value) => !value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${simulateFailure ? 'border-amber-500 bg-amber-500 text-gray-950' : 'border-border bg-card text-card-foreground hover:border-amber-500'}`}
            >
              Challenger: {simulateFailure ? 'unavailable' : 'available'}
            </button>
          </div>
          <div aria-live='polite' className='border-border bg-card rounded-xl border px-4 py-3'>
            <p className='text-card-foreground m-0 text-sm font-semibold'>
              {canUseChallenger ? 'Personalized route active' : 'Popularity route active'}
            </p>
            <p className='text-muted-foreground mt-1 mb-0 text-sm'>{fallbackReason}</p>
          </div>
          <div className='grid gap-3 md:grid-cols-2'>
            <Ranking label='Baseline' caption='popularity' items={scenario.baseline} selected={!canUseChallenger} />
            <Ranking
              label='Shadow challenger'
              caption='personalized'
              items={simulateFailure ? [] : scenario.challenger}
              selected={canUseChallenger}
            />
          </div>
          <p className='text-muted-foreground m-0 text-xs leading-5'>
            This walkthrough uses invented items and precomputed toy rankings. Gate and failure controls illustrate
            routing behavior; they do not run the private model or change the Amazon test results.
          </p>
        </div>
      )}
    </section>
  )
}
