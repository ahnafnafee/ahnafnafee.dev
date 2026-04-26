'use client'

import { ResearchList } from '@/components/content/research'
import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero } from '@/UI/templates'
import { useSearchResearch } from '@/hooks'
import type { Research } from 'me'

type ResearchPageClientProps = {
  allResearch: Array<Research>
}

export function ResearchPageClient({ allResearch }: ResearchPageClientProps) {
  const search = useSearchResearch(allResearch)

  return (
    <>
      <Hero
        title='Research'
        description='Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.'
      />
      <Searchbar
        placeholder='Search research...'
        value={search.query}
        onChange={search.handleChange}
        className='mb-0'
      />
      <div className='flex flex-col gap-8 pb-24'>
        {search.query.length > 0 ? (
          search.filteredResearch.length > 0 ? (
            <ResearchList posts={search.filteredResearch} />
          ) : (
            <EmptyResult />
          )
        ) : (
          <ResearchList posts={allResearch} />
        )}
      </div>
    </>
  )
}
