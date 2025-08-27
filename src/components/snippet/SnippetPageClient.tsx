'use client'

import { SnippetList } from '@/components/content/snippet'
import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero } from '@/UI/templates'
import { useSearchSnippet } from '@/hooks'
import type { Snippet } from 'me'

type SnippetPageClientProps = {
  snippets: Array<Snippet>
}

export function SnippetPageClient({ snippets = [] }: SnippetPageClientProps) {
  const search = useSearchSnippet(snippets)

  return (
    <>
      <Hero
        title='Snippet'
        description='A collection of helpful snippets to help you, including myself to spin up the development. Remember, Do Not Repeat Yourself.'
      />
      <Searchbar onChange={search.handleChange} value={search.query} />

      {snippets.length > 0 && search.query === '' ? (
        <SnippetList
          snippets={snippets}
          title='Explore Them'
          description="I've put a collection of snippets that are available on my site. These snippets were created by me, as well as some awesome contributors on GitHub."
        />
      ) : null}

      {search.query !== '' && search.filteredSnippet.length > 0 && (
        <SnippetList
          snippets={search.filteredSnippet}
          title='Search Snippet'
          description="I've found some possible results for your search."
        />
      )}

      {search.query !== '' && search.filteredSnippet.length === 0 && <EmptyResult />}
    </>
  )
}
