'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { RIDERS, type RiderId } from './model'

import { useState } from 'react'

type Row = {
  label: string
  note: string
  fixed: string
  regional: string
}

export const RiderView: React.FunctionComponent = () => {
  const [riderId, setRiderId] = useState<RiderId>('P101')
  const rider = RIDERS.find((candidate) => candidate.id === riderId) ?? RIDERS[0]
  const { fixed, regional } = rider

  const rows: Row[] = [
    { label: 'Scene clarity while moving', note: '1 to 7', fixed: `${fixed.clarity}`, regional: `${regional.clarity}` },
    { label: 'Smoothness', note: '1 to 7', fixed: `${fixed.smoothness}`, regional: `${regional.smoothness}` },
    { label: 'Enjoyment (IMI)', note: '1 to 7', fixed: fixed.imi.toFixed(2), regional: regional.imi.toFixed(2) },
    {
      label: 'Sickness, before → after',
      note: '0 to 20',
      fixed: `${fixed.fms[0]} → ${fixed.fms[1]}`,
      regional: `${regional.fms[0]} → ${regional.fms[1]}`
    },
    { label: 'Ride time', note: 'seconds', fixed: `${fixed.seconds}`, regional: `${regional.seconds}` },
    {
      label: 'Median encoded video rate',
      note: 'Mbps',
      fixed: fixed.mbps.toFixed(2),
      regional: regional.mbps.toFixed(2)
    },
    { label: 'p95 software delay', note: 'ms', fixed: fixed.p95Ms.toFixed(2), regional: regional.p95Ms.toFixed(2) },
    {
      label: 'Longest application frame',
      note: 'ms',
      fixed: fixed.longestFrameMs.toFixed(1),
      regional: regional.longestFrameMs.toFixed(1)
    }
  ]

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Five riders, two rides each
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>What each rider reported</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Every rider pedaled the same course once with fixed foveation alone and once with regional quantization added,
          at their own pace and with their head free to turn. Questionnaires called the rides only &ldquo;Ride 1&rdquo;
          and &ldquo;Ride 2&rdquo;.
        </p>
      </div>

      <ChoiceGroup
        ariaLabel='Choose rider'
        options={RIDERS.map((candidate) => ({ value: candidate.id, label: candidate.id }))}
        value={riderId}
        onChange={setRiderId}
      />

      <div aria-live='polite' className='space-y-4'>
        <div className='border-border bg-card overflow-x-auto rounded-xl border'>
          <table className='w-full min-w-[420px] border-collapse text-sm'>
            <caption className='sr-only'>{rider.id} measurements under each condition</caption>
            <thead>
              <tr className='border-border text-muted-foreground border-b text-left text-xs'>
                <th scope='col' className='p-3 font-semibold'>
                  Measure
                </th>
                <th scope='col' className='p-3 text-right font-semibold'>
                  Fixed{rider.firstRide === 'fixed' ? ' (ride 1)' : ' (ride 2)'}
                </th>
                <th scope='col' className='p-3 text-right font-semibold'>
                  Regional{rider.firstRide === 'regional' ? ' (ride 1)' : ' (ride 2)'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className='border-border border-b last:border-b-0'>
                  <th scope='row' className='text-card-foreground p-3 text-left font-medium'>
                    {row.label} <span className='text-muted-foreground text-xs font-normal'>{row.note}</span>
                  </th>
                  <td className='text-card-foreground p-3 text-right font-mono tabular-nums'>{row.fixed}</td>
                  <td
                    className={`p-3 text-right font-mono tabular-nums ${row.fixed === row.regional ? 'text-card-foreground' : 'font-semibold text-purple-700 dark:text-purple-300'}`}
                  >
                    {row.regional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='grid gap-3 sm:grid-cols-3'>
          {[
            ['Clearer moving scene', rider.clearerChoice],
            ['Ride for another session', rider.nextSessionChoice],
            ['Frames encoded with the map', `${rider.mapAppliedPercent.toFixed(2)}%`]
          ].map(([label, value]) => (
            <div key={label} className='border-border bg-card rounded-xl border p-4'>
              <p className='text-muted-foreground m-0 text-xs'>{label}</p>
              <p className='text-card-foreground mt-1 mb-0 font-semibold'>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='border-border bg-muted/40 rounded-xl border p-4'>
        <p className='text-card-foreground m-0 text-sm font-semibold'>Across all five</p>
        <p className='text-muted-foreground mt-1 mb-0 text-sm leading-6'>
          Two riders rated the regional ride one point clearer and three gave equal scores. Asked directly, nobody chose
          regional as clearer: one chose fixed, three saw no difference and one could not compare. Three riders already
          gave the maximum clarity with fixed foveation, which leaves no room to show an increase. With one ride per
          condition, ride order and familiarity can also move these ratings.
        </p>
      </div>
    </div>
  )
}
