'use client'

import { SectionHeading } from '@/components/content/research/SectionHeading'

import { twclsx } from '@/libs/twclsx'

import type { NewsItem } from '@/data/news'
import { useState } from 'react'

type Props = {
  items: NewsItem[]
  /** Items shown before the "show older" toggle reveals the rest. Default 3. */
  defaultVisible?: number
  /** Render the section's own `<h2>News</h2>`. Set false when the parent supplies a heading. */
  showHeading?: boolean
  /** Anchor target for cross-page links (e.g. `/research#news`). */
  id?: string
  className?: string
}

export const NewsTimeline: React.FunctionComponent<Props> = ({
  items,
  defaultVisible = 3,
  showHeading = true,
  id,
  className
}) => {
  // Defensive sort: descending by ISO. Stable so same-month entries preserve
  // authored order (CTO promotion above graduation in Jun 2022, etc).
  const sorted = [...items].sort((a, b) => b.iso.localeCompare(a.iso))
  const [expanded, setExpanded] = useState(false)
  const isLong = sorted.length > defaultVisible
  const visible = expanded || !isLong ? sorted : sorted.slice(0, defaultVisible)
  const hiddenCount = sorted.length - defaultVisible

  return (
    <section id={id} className={twclsx('mb-10 md:mb-12', className)}>
      {showHeading && <SectionHeading>News</SectionHeading>}
      <ul className='flex flex-col gap-3'>
        {visible.map((item, i) => (
          <li
            key={`${item.iso}-${i}`}
            className='grid grid-cols-[5.5rem_1fr] gap-3 text-sm leading-6 text-gray-700 md:gap-5 md:text-base md:leading-7 dark:text-gray-300'
          >
            <span className='shrink-0 pt-px text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm dark:text-gray-400'>
              {item.date}
            </span>
            <span>
              {item.emoji && <span className='mr-1.5'>{item.emoji}</span>}
              {item.body}
            </span>
          </li>
        ))}
      </ul>
      {isLong && (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className='mt-3 text-xs font-medium tracking-wide text-purple-600 uppercase hover:underline md:text-sm dark:text-purple-400'
        >
          {expanded ? 'Show less' : `Show older news (${hiddenCount} more)`}
        </button>
      )}
    </section>
  )
}
