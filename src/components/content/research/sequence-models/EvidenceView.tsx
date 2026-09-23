'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { STUDY_B } from './model'

import { useState } from 'react'

type Device = keyof typeof STUDY_B.forwardMs

const format = (value: number) => value.toFixed(6)

export const EvidenceView: React.FunctionComponent = () => {
  const [device, setDevice] = useState<Device>('cpu')
  const cost = STUDY_B.forwardMs[device]

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Held-out MovieLens 1M test
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>The baseline nearly closes the gap</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Validation selected the model settings. Three trained seeds are averaged for each neural family. All methods
          rank the same train-known catalog for {STUDY_B.users} eligible users.
        </p>
      </div>

      <div className='border-border bg-card space-y-4 rounded-xl border p-4 sm:p-5'>
        {STUDY_B.ndcg.map((row) => (
          <div key={row.id}>
            <div className='mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm'>
              <span className='text-card-foreground font-medium'>{row.label}</span>
              <span className='text-card-foreground font-mono tabular-nums'>{format(row.value)}</span>
            </div>
            <div className='bg-muted h-3 overflow-hidden rounded-full' aria-hidden='true'>
              <div
                className='h-full rounded-full'
                style={{ width: `${(row.value / 0.055) * 100}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        ))}
        <p className='text-muted-foreground m-0 text-xs'>NDCG@10. Bars start at zero and share a 0 to 0.055 scale.</p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='border-border bg-card rounded-xl border p-4'>
          <p className='text-muted-foreground m-0 text-xs'>Transformer minus GRU</p>
          <p className='text-card-foreground mt-1 mb-1 font-mono text-xl font-semibold tabular-nums'>
            +{format(STUDY_B.primaryDifference)}
          </p>
          <p className='text-muted-foreground m-0 text-xs leading-5'>
            Paired user 95% interval: [{format(STUDY_B.primaryInterval[0])}, {format(STUDY_B.primaryInterval[1])}]
          </p>
        </div>
        <div className='border-border bg-card rounded-xl border p-4'>
          <p className='text-muted-foreground m-0 text-xs'>Transformer minus recent popularity</p>
          <p className='text-card-foreground mt-1 mb-1 font-mono text-xl font-semibold tabular-nums'>
            +{format(STUDY_B.popularityGap)}
          </p>
          <p className='text-muted-foreground m-0 text-xs leading-5'>
            Descriptive gap; no predeclared interval for this contrast.
          </p>
        </div>
      </div>

      <div className='border-border bg-card rounded-xl border p-4 sm:p-5'>
        <div className='mb-4'>
          <h4 className='text-card-foreground m-0 text-sm font-semibold'>Local batch-one forward time</h4>
          <p className='text-muted-foreground mt-1 mb-0 text-xs leading-5'>
            Median process-level p50 across five fresh processes. Encoder and full item logits only.
          </p>
        </div>
        <ChoiceGroup
          ariaLabel='Choose profiling device'
          options={[
            { value: 'cpu', label: 'CPU' },
            { value: 'cuda', label: 'CUDA' }
          ]}
          value={device}
          onChange={setDevice}
        />
        <div aria-live='polite' className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div className='bg-muted/40 rounded-lg p-3'>
            <p className='text-muted-foreground m-0 text-xs'>GRU</p>
            <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
              {cost.gru.toFixed(3)} ms
            </p>
          </div>
          <div className='bg-muted/40 rounded-lg p-3'>
            <p className='text-muted-foreground m-0 text-xs'>Transformer</p>
            <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
              {cost.transformer.toFixed(3)} ms
            </p>
          </div>
        </div>
      </div>
      <p className='text-muted-foreground m-0 text-xs leading-5'>
        These offline rating-recovery scores are not exposure-adjusted relevance or online lift. Forward time excludes
        candidate filtering, sorting, transport, and service overhead.
      </p>
    </div>
  )
}
