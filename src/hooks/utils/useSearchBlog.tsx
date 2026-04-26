import { toLowerCase } from '@/libs/string'

import type { Blog } from 'me'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

// Sync search state with the `?q=` URL param so the WebSite SearchAction
// schema (target: /blog?q={search_term_string}) actually works when Google
// or another agent dispatches a search.
//
// Both `query` and `filteredBlog` are derived directly from `searchParams` —
// no local useState. That keeps the URL as the single source of truth (deep
// links work, back/forward nav works) and avoids React's set-state-in-effect
// pitfalls.
export const useSearchBlog = (blogs: Blog[]) => {
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
      router.replace(qs ? `/blog?${qs}` : '/blog', { scroll: false })
    },
    [router, searchParams]
  )

  const filteredBlog = useMemo<Blog[]>(() => {
    if (!query || blogs.length === 0) return []
    const q = toLowerCase(query)
    return blogs.filter(
      (blog) =>
        toLowerCase(blog.title).includes(q) ||
        toLowerCase(blog.summary).includes(q) ||
        blog.topics.some((t) => toLowerCase(t).includes(q))
    )
  }, [blogs, query])

  return {
    query,
    handleChange,
    filteredBlog
  }
}
