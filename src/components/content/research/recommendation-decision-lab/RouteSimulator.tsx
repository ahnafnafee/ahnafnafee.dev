'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { Profile, PROFILES } from './model'

import { useState } from 'react'

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

const profileOptions = (['signals', 'stories', 'new'] as const).map((value) => ({
  value,
  label: PROFILES[value].label
}))

export const RouteSimulator: React.FunctionComponent = () => {
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
    <div className='space-y-5'>
      <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
        Synthetic titles and histories
      </p>
      <ChoiceGroup
        ariaLabel='Choose invented visitor history'
        options={profileOptions}
        value={profile}
        onChange={setProfile}
      />
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
        This walkthrough uses invented items and precomputed toy rankings. Gate and failure controls illustrate routing
        behavior; they do not run the private model or change the Amazon test results.
      </p>
    </div>
  )
}
