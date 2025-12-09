'use client'

import { BlogList } from '@/components/content'
import { EmptyResult } from '@/UI/common'
import { Searchbar } from '@/UI/inputs'
import { Hero } from '@/UI/templates'
import { useSearchBlog } from '@/hooks'
import type { Blog } from 'me'

type BlogPageClientProps = {
  allBlogs: Array<Blog>
}

export function BlogPageClient({ allBlogs }: BlogPageClientProps) {
  const search = useSearchBlog(allBlogs)

  return (
    <>
      <Hero 
        title='Blog' 
        description='Thoughts on Artificial Intelligence, Computer Graphics, and Software Engineering.' 
      />
      <Searchbar placeholder="Search blogs..." value={search.query} onChange={search.handleChange} />

      <div className='flex flex-col gap-8 pb-24'>
        {search.query.length > 0 ? (
          <>
            {search.filteredBlog.length > 0 ? (
              <BlogList
                displayViews
                posts={search.filteredBlog}
              />
            ) : (
              <EmptyResult />
            )}
          </>
        ) : (
          <BlogList
            displayViews
            posts={allBlogs}
          />
        )}
      </div>
    </>
  )
}
