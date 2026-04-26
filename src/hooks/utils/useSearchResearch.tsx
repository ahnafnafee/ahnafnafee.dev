import { toLowerCase } from '@/libs/string'

import type { Research } from 'me'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

// URL-synced search so /research?q=foo deep-links and the WebSite SearchAction
// schema can target /research?q={search_term_string}. Mirrors useSearchBlog —
// the URL is the single source of truth, no useState.
export const useSearchResearch = (papers: Research[]) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get('q') ?? ''

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      if (next) params.set('q', next)
      else params.delete('q')
      const qs = params.toString()
      router.replace(qs ? `/research?${qs}` : '/research', { scroll: false })
    },
    [router, searchParams]
  )

  const filteredResearch = useMemo<Research[]>(() => {
    if (!query || papers.length === 0) return []
    const q = toLowerCase(query)
    return papers.filter(
      (paper) =>
        toLowerCase(paper.title).includes(q) ||
        toLowerCase(paper.summary).includes(q) ||
        toLowerCase(paper.abstract).includes(q) ||
        paper.topics.some((t) => toLowerCase(t).includes(q)) ||
        paper.authors.some((a) => toLowerCase(a.name).includes(q))
    )
  }, [papers, query])

  return {
    query,
    handleChange,
    filteredResearch
  }
}
