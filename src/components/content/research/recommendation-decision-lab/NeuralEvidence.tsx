'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { NEURAL_EVIDENCE } from './model'

import { useState } from 'react'

type Period = keyof typeof NEURAL_EVIDENCE

const options = [
  { value: 'validation', label: 'Validation' },
  { value: 'test', label: 'Studied test period' }
] as const

const score = (value: number) => value.toFixed(6)

export const NeuralEvidence: React.FunctionComponent = () => {
  const [period, setPeriod] = useState<Period>('validation')
  const evidence = NEURAL_EVIDENCE[period]

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Neural retrieval extension
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>A challenger held in shadow</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          A trained history and item tower scored the full train-known catalog. Validation selected a 40% neural blend,
          then compared it with the active co-review hybrid. The neural route did not earn promotion.
        </p>
      </div>
      <ChoiceGroup ariaLabel='Choose evaluation period' options={[...options]} value={period} onChange={setPeriod} />
      <div aria-live='polite' className='space-y-4'>
        <div className='border-border bg-card rounded-xl border p-4'>
          <div className='mb-4 flex flex-wrap items-baseline justify-between gap-2'>
            <p className='text-card-foreground m-0 text-sm font-semibold'>{evidence.label}</p>
            <p className='text-muted-foreground m-0 text-xs tabular-nums'>
              {evidence.requests.toLocaleString()} eligible requests · NDCG@10
            </p>
          </div>
          <div className='space-y-4'>
            {(
              [
                ['Recent popularity', evidence.popularity, '#3B82F6'],
                ['Co-review hybrid · active', evidence.hybrid, '#8B5CF6'],
                ['Neural blend · shadow', evidence.neural, '#F59E0B']
              ] as const
            ).map(([label, value, color]) => (
              <div key={label}>
                <div className='mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm'>
                  <span className='text-card-foreground font-medium'>{label}</span>
                  <span className='text-card-foreground font-mono tabular-nums'>{score(value)}</span>
                </div>
                <div className='bg-muted h-3 overflow-hidden rounded-full' aria-hidden='true'>
                  <div
                    className='h-full rounded-full'
                    style={{ width: `${(value / 0.012) * 100}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className='text-muted-foreground mt-3 mb-0 text-xs'>Bars start at zero and share a 0 to 0.012 scale.</p>
        </div>
        <div className='border-border bg-muted/50 rounded-xl border px-4 py-3'>
          <p className='text-card-foreground m-0 text-sm font-semibold'>Gate decision: keep the hybrid active</p>
          <p className='text-muted-foreground mt-1 mb-0 text-sm leading-6'>
            Neural minus hybrid, paired user-cluster 95% interval: [{score(evidence.intervalAgainstHybrid[0])},{' '}
            {score(evidence.intervalAgainstHybrid[1])}]. The interval includes zero.
          </p>
        </div>
      </div>
      <p className='text-muted-foreground m-0 text-xs leading-5'>
        The unblended tower reached 0.001411 on validation. This extension was designed after the category test period
        had been studied, so its test view is exploratory. Switching periods changes the displayed measurements; it does
        not rerun a model or alter the saved routing decision.
      </p>
    </div>
  )
}
