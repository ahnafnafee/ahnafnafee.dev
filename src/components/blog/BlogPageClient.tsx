'use client'

import { BlogList } from '@/components/content'
import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero } from '@/UI/templates'
import { twclsx } from '@/libs/twclsx'
import { useSearchBlog } from '@/hooks'
import type { Blog } from 'me'
import { useMemo } from 'react'
import { getMostPopularBlog } from '@/libs/sorters'

type BlogPageClientProps = {
  allBlogs: Array<Blog>
}

export function BlogPageClient({ allBlogs }: BlogPageClientProps) {
  const search = useSearchBlog(allBlogs)
  const mostViewdBlogs = useMemo(() => allBlogs.slice(0).sort(getMostPopularBlog).slice(0, 2), [allBlogs])

  return (
    <>
      <Hero
        title='Blog'
        description="You'll find a collection of my thoughts and musings on a variety of topics. I write about everything from current events to personal experiences, and I always strive to share my honest opinions. Keep in mind that my views are my own and do not necessarily reflect those of any other person or organization."
      />

      <Searchbar onChange={search.handleChange} value={search.query} />

      {allBlogs.length > 0 && search.query.length === 0 ? (
        <div className={twclsx('flex flex-col', 'gap-24')}>
          <BlogList
            displayViews
            posts={mostViewdBlogs}
            title='Most Viewed'
            description='Hey, I thought you might be interested in checking out my most-viewed post. Feel free to give it a read.'
          />

          <BlogList
            posts={allBlogs}
            displayViews
            title='All Post'
            description="It looks like you're interested in my posts. You're welcome to take a look and read them, and they're sorted by date so you can easily find the newest ones."
          />
        </div>
      ) : null}

      {search.query.length > 0 && (
        <>
          {search.filteredBlog.length > 0 ? (
            <BlogList
              description="I've found some possible results for your search."
              displayViews
              posts={search.filteredBlog}
              title='Search Post'
            />
          ) : (
            <EmptyResult />
          )}
        </>
      )}
    </>
  )
}
