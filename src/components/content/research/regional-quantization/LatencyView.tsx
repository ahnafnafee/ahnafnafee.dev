'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { median, P95_DIFFERENCES, RECALCULATED_GAPS, RIDERS, type LatencyRecalculation } from './model'

import { useState } from 'react'

const RANGE = 6

const position = (value: number) => ((value + RANGE) / (2 * RANGE)) * 100

const signed = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)} ms`

export const LatencyView: React.FunctionComponent = () => {
  const [mode, setMode] = useState<LatencyRecalculation>('recorded')

  // Riders the paper did not recalculate keep their recorded value, shown faded.
  const points = RIDERS.map(({ id }) => {
    const recorded = P95_DIFFERENCES[id]
    if (mode === 'recorded') return { id, value: recorded, faded: false, label: signed(recorded) }
    if (id !== 'P101' && id !== 'P102') return { id, value: recorded, faded: true, label: 'recorded only' }
    const value = RECALCULATED_GAPS[id][mode]
    return { id, value, faded: false, label: value === undefined ? 'not reported' : signed(value) }
  })

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>Software delay, p95</p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>
          Slower for two riders, faster for three
        </h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Each point is one rider&apos;s regional minus fixed difference in 95th-percentile software delay. The median
          across all five is {signed(median(Object.values(P95_DIFFERENCES)))}. For the two increases, the slow events
          spent longer waiting after video decoding. Remove a stage from every event to see how much of the gap remains.
        </p>
      </div>

      <ChoiceGroup
        ariaLabel='Choose delay calculation'
        options={[
          { value: 'recorded', label: 'As recorded' },
          { value: 'withoutQueue', label: 'Without decoder queue' },
          { value: 'withoutGame', label: 'Without game time' }
        ]}
        value={mode}
        onChange={setMode}
      />

      <div aria-live='polite' className='border-border bg-card space-y-3 rounded-xl border p-4 sm:p-5'>
        {points.map((point) => (
          <div key={point.id} className='grid grid-cols-[3rem_1fr_6.5rem] items-center gap-3 text-sm'>
            <span className='text-card-foreground font-medium'>{point.id}</span>
            <div className='bg-muted relative h-6 rounded-full' aria-hidden='true'>
              <div className='bg-foreground/40 absolute inset-y-0 w-px' style={{ left: '50%' }} />
              {point.value !== undefined && (
                <span
                  className='absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white dark:ring-gray-900'
                  style={{
                    left: `${position(point.value)}%`,
                    backgroundColor: point.value > 0 ? '#F97316' : '#2563EB',
                    opacity: point.faded ? 0.3 : 1
                  }}
                />
              )}
            </div>
            <span className='text-card-foreground text-right font-mono text-xs tabular-nums'>{point.label}</span>
          </div>
        ))}
        <div className='text-muted-foreground grid grid-cols-[3rem_1fr_6.5rem] gap-3 text-xs'>
          <span />
          <span className='flex justify-between'>
            <span>−6 ms, regional faster</span>
            <span>+6 ms, regional slower</span>
          </span>
          <span />
        </div>
      </div>

      <div className='border-border bg-muted/40 rounded-xl border p-4'>
        <p className='text-card-foreground m-0 text-sm font-semibold'>How to read the recalculation</p>
        <p className='text-muted-foreground mt-1 mb-0 text-sm leading-6'>
          The paper recalculated only the two increases. Removing a stage changes which events fall in the slowest 5%,
          so the reductions show where the gap concentrated but do not split it between stages. Five riders with one
          ride per condition cannot establish that regional encoding preserves latency on a later ride.
        </p>
      </div>
    </div>
  )
}
