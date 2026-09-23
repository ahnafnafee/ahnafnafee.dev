'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { canAttend, SequenceScenario, SYNTHETIC_HISTORIES } from './model'

import { useState } from 'react'

const scenarioOptions = (['short', 'long', 'unknown'] as const).map((value) => ({
  value,
  label: SYNTHETIC_HISTORIES[value].label
}))

export const BasketWalkthrough: React.FunctionComponent = () => {
  const [scenario, setScenario] = useState<SequenceScenario>('short')
  const example = SYNTHETIC_HISTORIES[scenario]
  const positions = example.baskets.map((_, index) => index)

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Invented titles and histories
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>What can the encoder see?</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Select a synthetic rating history. The future positive basket is never input to the model. This walkthrough
          contains no real user record and does not calculate recommendation quality.
        </p>
      </div>
      <ChoiceGroup
        ariaLabel='Choose a synthetic rating history'
        options={scenarioOptions}
        value={scenario}
        onChange={setScenario}
      />
      <div aria-live='polite' className='grid gap-4 lg:grid-cols-2'>
        <div className='border-border bg-card min-w-0 rounded-xl border p-4'>
          <h5 className='text-card-foreground m-0 text-sm font-semibold'>At the forecast origin</h5>
          <p className='text-muted-foreground mt-1 mb-4 text-xs leading-5'>{example.description}</p>
          {example.baskets.length ? (
            <ol className='m-0 space-y-2 p-0'>
              {example.baskets.map((basket, index) => (
                <li
                  key={`${scenario}-${index}`}
                  className='border-border bg-muted/40 flex gap-3 rounded-lg border px-3 py-2 text-sm'
                >
                  <span className='shrink-0 font-mono text-xs font-bold text-blue-600 dark:text-blue-300'>
                    t{index + 1}
                  </span>
                  <span className='text-card-foreground'>{basket.join(' + ')}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className='text-muted-foreground m-0 text-sm'>No usable train-known basket remains.</p>
          )}
          <div className='mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm'>
            <span className='font-semibold text-amber-700 dark:text-amber-300'>Future target, hidden from input:</span>{' '}
            <span className='text-card-foreground'>{example.futureTarget}</span>
          </div>
          <p className='text-card-foreground mt-4 mb-0 text-sm font-semibold'>
            Route: {example.baskets.length ? 'sequence model' : 'recent popularity fallback'}
          </p>
        </div>
        <div className='border-border bg-card min-w-0 rounded-xl border p-4'>
          <h5 className='text-card-foreground m-0 text-sm font-semibold'>Causal attention access</h5>
          <p className='text-muted-foreground mt-1 mb-3 text-xs leading-5'>
            A row may read its own basket and earlier baskets. It cannot read a later one.
          </p>
          {positions.length ? (
            <div className='max-w-full overflow-x-auto'>
              <table
                className='m-0 w-auto border-separate border-spacing-1 text-center text-xs'
                aria-label='Causal attention mask'
              >
                <thead>
                  <tr>
                    <th className='p-1' scope='col'>
                      Read
                    </th>
                    {positions.map((position) => (
                      <th key={position} className='min-w-8 p-1 font-mono' scope='col'>
                        t{position + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positions.map((row) => (
                    <tr key={row}>
                      <th className='p-1 font-mono' scope='row'>
                        t{row + 1}
                      </th>
                      {positions.map((column) => {
                        const allowed = canAttend(row, column)
                        return (
                          <td
                            key={column}
                            aria-label={`t${row + 1} ${allowed ? 'can' : 'cannot'} read t${column + 1}`}
                            className={`min-w-8 rounded-md p-2 font-semibold ${allowed ? 'bg-blue-500/20 text-blue-700 dark:text-blue-200' : 'bg-muted text-muted-foreground'}`}
                          >
                            {allowed ? '✓' : '×'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-muted-foreground m-0 text-sm'>No sequence positions remain to score.</p>
          )}
        </div>
      </div>
      <p className='text-muted-foreground m-0 text-xs leading-5'>
        Items sharing a timestamp make one unordered basket. An unknown input item is removed from the history, while an
        unknown future target remains a miss in the offline metric.
      </p>
    </div>
  )
}
