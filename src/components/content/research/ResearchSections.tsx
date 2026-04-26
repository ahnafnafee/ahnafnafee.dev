import { ResearchItem } from './ResearchItem'

import type { Research } from 'me'

type ResearchSectionsProps = {
  posts: Research[]
}

type SectionKey = NonNullable<Research['section']>

const SECTION_LABELS: Record<SectionKey, string> = {
  'top-tier': 'Top-Tier Venues',
  conferences: 'Conferences',
  journals: 'Journals',
  workshops: 'Workshops',
  others: 'Others'
}

const SECTION_ORDER: SectionKey[] = ['top-tier', 'conferences', 'journals', 'workshops', 'others']

export const ResearchSections: React.FunctionComponent<ResearchSectionsProps> = ({ posts }) => {
  if (posts.length === 0) return null

  const grouped = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    items: posts.filter((p) => (p.section ?? 'others') === key)
  })).filter((group) => group.items.length > 0)

  return (
    <div className='flex flex-col gap-10 pb-8'>
      {grouped.map((group, groupIdx) => (
        <section key={group.key}>
          <h2 className='text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800'>
            {group.label}
          </h2>
          <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
            {group.items.map((post, i) => (
              <ResearchItem key={post.slug} {...post} priority={groupIdx === 0 && i === 0} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
