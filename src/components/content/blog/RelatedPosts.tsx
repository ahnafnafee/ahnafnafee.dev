import { UnstyledLink } from '@/components/site/links'

import { getContentBySlug } from '@/services'

import type { Blog } from 'me'

type RelatedPostsProps = {
  slugs: string[]
  limit?: number
}

export async function RelatedPosts({ slugs, limit = 3 }: RelatedPostsProps) {
  if (!slugs || slugs.length === 0) return null

  const results = await Promise.allSettled(slugs.slice(0, limit).map((slug) => getContentBySlug<Blog>('/blog', slug)))

  const posts = results
    .filter((r): r is PromiseFulfilledResult<{ header: Blog; content: string }> => r.status === 'fulfilled')
    .map((r) => r.value.header)

  if (posts.length === 0) return null

  return (
    <section className='mt-16 border-t border-gray-200 pt-8 dark:border-gray-800'>
      <h2 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>Related Posts</h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <UnstyledLink
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group block rounded-lg border border-gray-200 p-5 transition-colors hover:border-purple-400 dark:border-gray-800 dark:hover:border-purple-500'
          >
            <p className='mb-2 text-xs font-bold tracking-wide text-purple-600 uppercase dark:text-purple-400'>
              {new Date(post.published).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <h3 className='mb-2 line-clamp-2 text-base leading-snug font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-gray-100'>
              {post.title}
            </h3>
            <p className='line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400'>{post.summary}</p>
          </UnstyledLink>
        ))}
      </div>
    </section>
  )
}
