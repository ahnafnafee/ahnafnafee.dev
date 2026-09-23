import { CoverageFigure } from './CoverageFigure'
import { EVIDENCE } from './model'

const MAX_SCORE = 0.012
const formatScore = (value: number) => value.toFixed(6)

export const EvidenceView: React.FunctionComponent = () => (
  <div>
    <p className='text-muted-foreground m-0 text-xs font-bold tracking-wide uppercase'>
      Held-out category · full catalog
    </p>
    <h4 className='text-card-foreground mt-1 mb-4 text-lg font-semibold'>Musical Instruments</h4>
    <div className='space-y-4'>
      {(
        [
          ['Recent popularity', EVIDENCE.baseline, '#3B82F6'],
          ['Personalized hybrid', EVIDENCE.challenger, '#8B5CF6']
        ] as const
      ).map(([label, value, barColor]) => (
        <div key={label}>
          <div className='mb-1 flex items-baseline justify-between gap-3 text-sm'>
            <span className='text-card-foreground font-medium'>{label}</span>
            <span className='text-card-foreground font-mono tabular-nums'>{formatScore(value)} NDCG@10</span>
          </div>
          <div
            aria-hidden='true'
            className='overflow-hidden rounded-full'
            style={{ height: 12, backgroundColor: 'var(--muted)' }}
          >
            <div
              className='rounded-full'
              style={{ width: `${(value / MAX_SCORE) * 100}%`, height: '100%', backgroundColor: barColor }}
            />
          </div>
        </div>
      ))}
    </div>
    <p className='text-muted-foreground mt-2 mb-0 text-xs'>Bars start at zero and share a 0 to 0.012 NDCG@10 scale.</p>
    <div className='mt-5 grid gap-3 sm:grid-cols-3'>
      <div className='border-border bg-card rounded-lg border p-3'>
        <p className='text-muted-foreground m-0 text-xs'>Eligible requests</p>
        <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
          {EVIDENCE.requests.toLocaleString()}
        </p>
      </div>
      <div className='border-border bg-card rounded-lg border p-3'>
        <p className='text-muted-foreground m-0 text-xs'>Targets unseen in training</p>
        <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
          {EVIDENCE.unseenTargets.toLocaleString()}
        </p>
      </div>
      <div className='border-border bg-card rounded-lg border p-3'>
        <p className='text-muted-foreground m-0 text-xs'>Paired difference</p>
        <p className='text-card-foreground mt-1 mb-0 font-mono text-lg font-semibold tabular-nums'>
          +{formatScore(EVIDENCE.difference)}
        </p>
      </div>
    </div>
    <CoverageFigure />
    <p className='text-muted-foreground mt-4 mb-0 text-sm leading-6'>
      User-cluster 95% interval for the paired difference: [{formatScore(EVIDENCE.interval[0])},{' '}
      {formatScore(EVIDENCE.interval[1])}]. These are offline review-retrieval scores from one temporal split, not
      online engagement or causal lift.
    </p>
  </div>
)
