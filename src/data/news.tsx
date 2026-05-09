import { UnstyledLink } from '@/components/site/links'

export type NewsItem = {
  /** Display label, e.g. 'Jan 2026' or 'Spring 2026'. */
  date: string
  /** ISO date used for stable descending sort. Use the canonical day if known, otherwise the 1st. */
  iso: string
  /** Optional emoji prefix. */
  emoji?: string
  /** Body content — JSX so entries can embed inline links / formatting. */
  body: React.ReactNode
}

// Authored newest-first as a courtesy; the timeline component re-sorts by `iso`
// so reordering or appending out-of-order is safe.
export const NEWS: NewsItem[] = [
  {
    date: 'Jan 2026',
    iso: '2026-01-15',
    emoji: '🎉',
    body: (
      <>
        Joined the{' '}
        <UnstyledLink href='https://craigyuyu.github.io/home/group.html' className='text-link'>
          DCXR Lab
        </UnstyledLink>{' '}
        at George Mason University, advised by Dr. Craig Yu.
      </>
    )
  },
  {
    date: 'Aug 2025',
    iso: '2025-08-25',
    emoji: '🎓',
    body: <>Started Ph.D. in Computer Science at George Mason University.</>
  },
  {
    date: 'Feb 2023',
    iso: '2023-02-01',
    emoji: '💼',
    body: <>Joined Mindex as a Software Engineer.</>
  },
  {
    date: 'Jun 2022',
    iso: '2022-06-15',
    emoji: '🚀',
    body: <>Promoted to Chief Technology Officer at Dynasty 11 Studios.</>
  },
  {
    date: 'Jun 2022',
    iso: '2022-06-10',
    emoji: '🎓',
    body: <>Graduated B.S. in Computer Science from Drexel University.</>
  }
]
