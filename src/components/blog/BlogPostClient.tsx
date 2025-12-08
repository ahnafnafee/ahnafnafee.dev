'use client'

import { UnstyledButton } from '@/components/UI/buttons'
import { PRButton } from '@/components/content'
import { GiscusComment, HeadingContent } from '@/components/content/blog'
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
    // run only on client side
    if (typeof window !== 'undefined') {
      if (isDev) return
      ;(async () => {
        try {
          const baseURL = isDev
            ? 'http://localhost:3000'
            : (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahnafnafee.dev')
          const res = await fetch(`${baseURL}/api/pageviews?slug=${header.slug}`)
          const data: PageViewResponse = await res.json()
          const view = data.view ?? 0
          setPostViews(view)
        } catch {
          console.info('Could not retrieve page views')
        }
      })()
    }
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
        />



        <div
          className={twclsx('prose dark:prose-invert', 'md:prose-lg', 'prose-headings:scroll-mt-24', 'prose-img:my-4')}
        >
          {children}
        </div>
      </article>

      <GiscusComment />

      <div className='flex flex-col space-y-2.5 md:space-y-0 md:flex-row md:items-center md:justify-between mt-2'>
        <PRButton path={`/blog/${header.slug}.mdx`} />

        <UnstyledButton
          onClick={toTop}
          className='justify-start space-x-1.5 py-1 max-w-max border-b-2 border-dashed border-theme-500'
        >
          <HiArrowUp className='w-4 h-4' />
          <span>Back to top</span>
        </UnstyledButton>
      </div>
    </>
  )
}
