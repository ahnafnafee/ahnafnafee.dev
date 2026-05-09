'use client'

import { PRButton } from '@/components/content'
import { GiscusComment, HeadingContent } from '@/components/content/blog'
import { Button } from '@/components/ui/button'

import { isDev } from '@/libs/constants/environmentState'
import { twclsx } from '@/libs/twclsx'

import type { Blog, PageViewResponse } from 'me'
import { useCallback, useEffect, useState } from 'react'
import { HiArrowUp } from 'react-icons/hi'

type BlogPostClientProps = {
  header: Blog
  children: React.ReactNode
}

export function BlogPostClient({ header, children }: BlogPostClientProps) {
  const [postViews, setPostViews] = useState<number>(0)
  const toTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const baseURL = isDev ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahnafnafee.dev')
    // Per-tab dedup so a page reload doesn't double-count. Production-only —
    // local dev never increments to keep the counter clean.
    const sessionKey = `pv-seen-${header.slug}`
    const shouldIncrement = !isDev && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(sessionKey)
    ;(async () => {
      try {
        const res = await fetch(
          `${baseURL}/api/pageviews?slug=${encodeURIComponent(header.slug)}`,
          shouldIncrement ? { method: 'POST' } : undefined
        )
        const data: PageViewResponse = await res.json()
        setPostViews(data.view ?? 0)
        if (shouldIncrement) sessionStorage.setItem(sessionKey, '1')
      } catch {
        console.info('Could not retrieve page views')
      }
    })()
  }, [header.slug])

  return (
    <>
      <article className={twclsx('content-auto', 'flex flex-col', 'gap-8')}>
        <HeadingContent
          topics={header.topics}
          est_read={header.est_read}
          postViews={postViews}
          published={header.published}
          summary={header.summary}
          title={header.title}
          author_name={header.author_name}
          github_username={header.github_username}
          thumbnail={header.thumbnail}
        />

        <div
          className={twclsx('prose dark:prose-invert', 'md:prose-lg', 'prose-headings:scroll-mt-24', 'prose-img:my-4')}
        >
          {children}
        </div>
      </article>

      <GiscusComment />

      <div className='mt-2 flex flex-col space-y-2.5 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <PRButton path={`/blog/${header.slug}.mdx`} />

        <Button
          variant='ghost'
          size='sm'
          onClick={toTop}
          className='border-theme-500 max-w-max justify-start gap-1.5 rounded-none border-b-2 border-dashed px-0 py-1 hover:bg-transparent'
        >
          <HiArrowUp data-icon='inline-start' />
          <span>Back to top</span>
        </Button>
      </div>
    </>
  )
}
