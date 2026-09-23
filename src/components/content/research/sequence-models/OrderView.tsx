'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { STUDY_B } from './model'

import { useState } from 'react'

type Family = keyof typeof STUDY_B.order

export const OrderView: React.FunctionComponent = () => {
  const [family, setFamily] = useState<Family>('transformer')
  const rows = STUDY_B.order[family]

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>Seed-11 diagnostic</p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>Did the original order help?</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          The order intervention retrained a model after permuting complete timestamp baskets. The target and training
          prefix count stayed fixed. Choose a family to compare its held-out scores.
        </p>
      </div>
      <ChoiceGroup
        ariaLabel='Choose sequence model for order diagnostic'
        options={[
          { value: 'transformer', label: 'Transformer' },
          { value: 'gru', label: 'GRU' }
        ]}
        value={family}
        onChange={setFamily}
      />
      <div aria-live='polite' className='border-border bg-card space-y-4 rounded-xl border p-4 sm:p-5'>
        {rows.map((row) => (
          <div key={row.label}>
            <div className='mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm'>
              <span className='text-card-foreground font-medium'>{row.label}</span>
              <span className='text-card-foreground font-mono tabular-nums'>{row.value.toFixed(6)}</span>
            </div>
            <div className='bg-muted h-3 overflow-hidden rounded-full' aria-hidden='true'>
              <div className='h-full rounded-full bg-purple-500' style={{ width: `${(row.value / 0.055) * 100}%` }} />
            </div>
          </div>
        ))}
        <p className='text-muted-foreground m-0 text-xs'>
          Held-out NDCG@10, zero-based bars on a common 0 to 0.055 scale.
        </p>
      </div>
      <div className='border-border bg-muted/40 rounded-xl border p-4'>
        <p className='text-card-foreground m-0 text-sm font-semibold'>What this diagnostic permits</p>
        <p className='text-muted-foreground mt-1 mb-0 text-sm leading-6'>
          Permuting baskets did not lower the score in either seed-11 run. That weakens a claim that the original
          chronological order explains the Transformer result. Retraining also changes optimization, and the no-position
          Transformer still has a causal mask, so this is not a causal proof that order is irrelevant.
        </p>
      </div>
    </div>
  )
}
