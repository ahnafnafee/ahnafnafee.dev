import { EVIDENCE } from './model'

const knownTargets = EVIDENCE.requests - EVIDENCE.unseenTargets
const knownPercent = (knownTargets / EVIDENCE.requests) * 100
const unseenPercent = 100 - knownPercent

export const CoverageFigure: React.FunctionComponent = () => (
  <figure className='border-border bg-card mt-5 rounded-lg border p-4'>
    <figcaption className='text-card-foreground text-sm font-semibold'>Where the catalog ends</figcaption>
    <p className='text-muted-foreground mt-1 mb-3 text-xs leading-5'>
      A ranker trained on the earlier catalog cannot retrieve a product it has never seen.
    </p>
    <div
      role='img'
      aria-label={`${knownTargets.toLocaleString()} requests (${knownPercent.toFixed(1)}%) targeted a known item; ${EVIDENCE.unseenTargets.toLocaleString()} requests (${unseenPercent.toFixed(1)}%) targeted an item absent from training.`}
      className='flex h-4 overflow-hidden rounded-full'
    >
      <span style={{ width: `${knownPercent.toFixed(1)}%`, backgroundColor: '#3B82F6' }} />
      <span style={{ width: `${unseenPercent.toFixed(1)}%`, backgroundColor: '#F59E0B' }} />
    </div>
    <div className='mt-3 grid gap-2 text-xs sm:grid-cols-2'>
      <div className='text-muted-foreground flex items-center gap-2'>
        <span
          aria-hidden='true'
          style={{ width: 10, height: 10, flexShrink: 0, borderRadius: '50%', backgroundColor: '#3B82F6' }}
        />
        <span>
          Known target: {knownTargets.toLocaleString()} ({knownPercent.toFixed(1)}%)
        </span>
      </div>
      <div className='text-muted-foreground flex items-center gap-2'>
        <span
          aria-hidden='true'
          style={{ width: 10, height: 10, flexShrink: 0, borderRadius: '50%', backgroundColor: '#F59E0B' }}
        />
        <span>
          Unseen target: {EVIDENCE.unseenTargets.toLocaleString()} ({unseenPercent.toFixed(1)}%)
        </span>
      </div>
    </div>
  </figure>
)
