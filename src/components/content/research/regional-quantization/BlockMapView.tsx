'use client'

import { ChoiceGroup } from '@/components/content/interactive'

import { bandOf, countBands, FRAME, MARKED_BLOCK, offsetAt, offsetForProtection, type OffsetBand } from './model'

import { useMemo, useState } from 'react'

type Highlight = 'all' | OffsetBand

const fillFor = (offset: number) =>
  offset < 0 ? '#2563EB' : offset === 0 ? '#94A3B8' : offset < 12 ? '#FB923C' : '#FED7AA'

const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`)

const describe = (offset: number) =>
  offset < 0 ? 'finer precision' : offset === 0 ? 'no regional change' : 'coarser precision'

export const BlockMapView: React.FunctionComponent = () => {
  const [highlight, setHighlight] = useState<Highlight>('all')
  const [selected, setSelected] = useState<{ column: number; row: number }>(MARKED_BLOCK)
  const [protection, setProtection] = useState(1)
  const counts = useMemo(() => countBands(FRAME.deltas), [])
  const formula = offsetForProtection(protection)
  const selectedOffset = offsetAt(selected.column, selected.row)
  const eye = selected.column < FRAME.columns / 2 ? 'left' : 'right'

  const selectFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - box.left) / box.width) * FRAME.columns)
    const row = Math.floor(((event.clientY - box.top) / box.height) * FRAME.rows)
    if (column >= 0 && column < FRAME.columns && row >= 0 && row < FRAME.rows) setSelected({ column, row })
  }

  const moveWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key]
    if (!step) return
    event.preventDefault()
    setSelected(({ column, row }) => ({
      column: Math.min(FRAME.columns - 1, Math.max(0, column + step[0])),
      row: Math.min(FRAME.rows - 1, Math.max(0, row + step[1]))
    }))
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
          Measured map, replay frame 180
        </p>
        <h4 className='text-card-foreground mt-1 mb-2 text-lg font-semibold'>Where the encoder asked for detail</h4>
        <p className='text-muted-foreground m-0 text-sm leading-6'>
          Each cell is one {FRAME.blockPixels}×{FRAME.blockPixels}-pixel encoder block of the stereo frame after fixed
          foveation, {FRAME.columns} columns by {FRAME.rows} rows. The value is the requested change to the quantization
          parameter (QP). A negative offset asks for finer precision; a positive offset gives bits away. Point at a
          block, or focus the map and use the arrow keys.
        </p>
      </div>

      <ChoiceGroup
        ariaLabel='Highlight offset band'
        options={[
          { value: 'all', label: 'All blocks' },
          { value: 'finer', label: `Finer (${counts.finer})` },
          { value: 'unchanged', label: `Zero (${counts.unchanged})` },
          { value: 'coarser', label: `Coarser (${counts.coarser})` }
        ]}
        value={highlight}
        onChange={setHighlight}
      />

      <div className='border-border bg-card rounded-xl border p-3 sm:p-4'>
        <div className='text-muted-foreground mb-2 grid grid-cols-2 text-center text-xs font-bold tracking-wide uppercase'>
          <span>Left eye</span>
          <span>Right eye</span>
        </div>
        <div
          tabIndex={0}
          role='group'
          aria-label='Block map. Use the arrow keys to move between blocks.'
          onKeyDown={moveWithKeyboard}
          className='rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
        >
          <svg
            viewBox={`0 0 ${FRAME.columns} ${FRAME.rows}`}
            className='block h-auto w-full cursor-crosshair'
            shapeRendering='crispEdges'
            aria-hidden='true'
            onPointerMove={selectFromPointer}
            onPointerDown={selectFromPointer}
          >
            {FRAME.deltas.map((offset, index) => (
              <rect
                key={index}
                x={index % FRAME.columns}
                y={Math.floor(index / FRAME.columns)}
                width={1}
                height={1}
                fill={fillFor(offset)}
                opacity={highlight === 'all' || bandOf(offset) === highlight ? 1 : 0.12}
              />
            ))}
            <line
              x1={FRAME.columns / 2}
              y1={0}
              x2={FRAME.columns / 2}
              y2={FRAME.rows}
              stroke='white'
              strokeWidth={0.3}
            />
            <rect
              x={MARKED_BLOCK.column - 0.4}
              y={MARKED_BLOCK.row - 0.4}
              width={1.8}
              height={1.8}
              fill='none'
              stroke='#A855F7'
              strokeWidth={0.35}
              shapeRendering='geometricPrecision'
            />
            <rect
              x={selected.column - 0.15}
              y={selected.row - 0.15}
              width={1.3}
              height={1.3}
              fill='none'
              stroke='#FACC15'
              strokeWidth={0.35}
              shapeRendering='geometricPrecision'
            />
          </svg>
        </div>
        <div className='text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs'>
          {[
            ['#2563EB', '−3 finer'],
            ['#94A3B8', '0'],
            ['#FB923C', '+1 to +9'],
            ['#FED7AA', '+12 coarsest']
          ].map(([color, label]) => (
            <span key={label} className='inline-flex items-center gap-1.5'>
              <span className='inline-block h-3 w-3 rounded-sm' style={{ backgroundColor: color }} aria-hidden='true' />
              {label}
            </span>
          ))}
          <span className='inline-flex items-center gap-1.5'>
            <span
              className='inline-block h-3 w-3 rounded-sm border-2'
              style={{ borderColor: '#A855F7' }}
              aria-hidden='true'
            />
            cockpit block traced in the paper
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <span
              className='inline-block h-3 w-3 rounded-sm border-2'
              style={{ borderColor: '#FACC15' }}
              aria-hidden='true'
            />
            selected block
          </span>
        </div>
        <p aria-live='polite' className='text-card-foreground bg-muted/40 mt-3 mb-0 rounded-lg p-3 text-sm'>
          Column {selected.column}, row {selected.row} ({eye} eye): offset{' '}
          <span className='font-mono font-semibold'>{signed(selectedOffset)}</span>, {describe(selectedOffset)}.
          {selected.column === MARKED_BLOCK.column &&
            selected.row === MARKED_BLOCK.row &&
            ' This is the cockpit block the paper traces from the game view into the encoder map.'}
        </p>
      </div>

      <div className='border-border bg-card rounded-xl border p-4 sm:p-5'>
        <h4 className='text-card-foreground m-0 text-sm font-semibold'>From protection to offset</h4>
        <p className='text-muted-foreground mt-1 mb-4 text-xs leading-5'>
          Protection is how much a block is covered by a road, cockpit or hazard rectangle, from 0 to 1. The block
          weight rises from the background weight ({FRAME.backgroundWeight}) to the foreground weight (
          {FRAME.importantWeight}). Its offset is −6·log₂(weight ÷ mean weight), rounded and clipped to ±12, then
          shifted by +{FRAME.budgetShift} to keep the frame within its rate budget.
        </p>
        <label className='text-card-foreground block text-sm font-medium' htmlFor='rq-protection'>
          Block protection: <span className='font-mono'>{protection.toFixed(2)}</span>
        </label>
        <input
          id='rq-protection'
          type='range'
          min={0}
          max={1}
          step={0.05}
          value={protection}
          onChange={(event) => setProtection(Number(event.target.value))}
          className='mt-2 w-full accent-purple-600'
        />
        <div aria-live='polite' className='mt-4 grid grid-cols-3 gap-3'>
          {[
            ['Block weight', formula.weight.toFixed(1)],
            ['Before shift', signed(formula.initial)],
            ['Requested offset', signed(formula.final)]
          ].map(([label, value]) => (
            <div key={label} className='bg-muted/40 rounded-lg p-3'>
              <p className='text-muted-foreground m-0 text-xs'>{label}</p>
              <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>{value}</p>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground mt-3 mb-0 text-xs leading-5'>
          Mean weight ≈ {formula.meanWeight.toFixed(1)}, from this frame&apos;s mean protection. The calculator ignores
          the background falloff toward the image edge, so values between the two extremes are approximate. Full
          protection gives −3 and none gives +12, which matches the measured map.
        </p>
      </div>
    </div>
  )
}
