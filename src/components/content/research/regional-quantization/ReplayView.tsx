'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { REPLAY } from './model'

import { useState } from 'react'

type Metric = 'mse' | 'ssim'

const SCALE: Record<Metric, { min: number; max: number }> = {
  mse: { min: -25, max: 20 },
  ssim: { min: -0.012, max: 0.015 }
}

const format = (metric: Metric, value: number) =>
  metric === 'mse' ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` : `${value > 0 ? '+' : ''}${value.toFixed(4)}`

const DivergingBar: React.FunctionComponent<{ metric: Metric; value: number }> = ({ metric, value }) => {
  const { min, max } = SCALE[metric]
  const zero = (-min / (max - min)) * 100
  const width = (Math.abs(value) / (max - min)) * 100
  return (
    <div className='bg-muted relative h-3 overflow-hidden rounded-full' aria-hidden='true'>
      <div className='bg-foreground/40 absolute inset-y-0 w-px' style={{ left: `${zero}%` }} />
      <div
        className='absolute inset-y-0 rounded-full'
        style={{
          left: value >= 0 ? `${zero}%` : `${zero - width}%`,
          width: `${width}%`,
          backgroundColor: value >= 0 ? '#2563EB' : '#F97316'
        }}
      />
    </div>
  )
}

export const ReplayView: React.FunctionComponent = () => {
  const [metric, setMetric] = useState<Metric>('mse')
  const key = metric === 'mse' ? 'mseReduction' : 'ssimDiff'

  const rows = [
    ...REPLAY.regions.map((region) => ({
      label: `${region.label}, ${region.eye.toLowerCase()} eye`,
      detail: `${region.views} frames`,
      value: region[key]
    })),
    ...REPLAY.wholeEye.map((whole) => ({
      label: `Whole ${whole.eye.toLowerCase()} eye`,
      detail: `${REPLAY.frames} frames`,
      value: whole[key]
    }))
  ]

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Matched replay, same source frames
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>Detail moves to the task regions</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Both encodings received exactly the same {REPLAY.frames} scored frames of a scripted ride, so any difference
          comes from the encoder. Blue bars favor regional quantization; orange bars favor fixed foveation alone.
        </p>
      </div>

      <ChoiceGroup
        ariaLabel='Choose fidelity metric'
        options={[
          { value: 'mse', label: 'Color error reduction' },
          { value: 'ssim', label: 'Structural similarity change' }
        ]}
        value={metric}
        onChange={setMetric}
      />

      <div aria-live='polite' className='border-border bg-card space-y-4 rounded-xl border p-4 sm:p-5'>
        {rows.map((row, index) => (
          <div key={row.label} className={index === REPLAY.regions.length ? 'border-border border-t pt-4' : ''}>
            <div className='mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm'>
              <span className='text-card-foreground font-medium'>
                {row.label} <span className='text-muted-foreground text-xs font-normal'>{row.detail}</span>
              </span>
              <span className='text-card-foreground font-mono tabular-nums'>{format(metric, row.value)}</span>
            </div>
            <DivergingBar metric={metric} value={row.value} />
          </div>
        ))}
        <p className='text-muted-foreground m-0 text-xs leading-5'>
          {metric === 'mse'
            ? 'Percent reduction in mean squared RGB error, regional versus fixed foveation. Positive means less error.'
            : 'Regional minus fixed single-scale SSIM on luma. One means a perfect match to the encoder input.'}{' '}
          Bars share a zero line.
        </p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='border-border bg-card rounded-xl border p-4'>
          <p className='text-muted-foreground m-0 text-xs'>Encoded rate, fixed foveation</p>
          <p className='text-card-foreground mt-1 mb-0 font-mono text-xl font-semibold tabular-nums'>
            {REPLAY.mbps.fixed.toFixed(2)} Mbps
          </p>
        </div>
        <div className='border-border bg-card rounded-xl border p-4'>
          <p className='text-muted-foreground m-0 text-xs'>Encoded rate, regional</p>
          <p className='text-card-foreground mt-1 mb-0 font-mono text-xl font-semibold tabular-nums'>
            {REPLAY.mbps.regional.toFixed(2)} Mbps{' '}
            <span className='text-muted-foreground text-sm font-normal'>({REPLAY.bitChangePercent}%)</span>
          </p>
        </div>
      </div>
      <p className='text-muted-foreground m-0 text-xs leading-5'>
        The regional settings were selected on this same replay, so these numbers describe one tuned operating point.
        The encoder spent its budget on the road, cockpit and hazards and gave up fidelity elsewhere, which is why the
        whole-eye scores fall.
      </p>
    </div>
  )
}
