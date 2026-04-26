import { getContentBySlug } from '@/services'
import { UnstyledLink } from '@/UI/links'
import type { Blog } from 'me'

type RelatedPostsProps = {
  slugs: string[]
  limit?: number
}

export async function RelatedPosts({ slugs, limit = 3 }: RelatedPostsProps) {
  if (!slugs || slugs.length === 0) return null

  const results = await Promise.allSettled(
    slugs.slice(0, limit).map((slug) => getContentBySlug<Blog>('/blog', slug))
  )

  const posts = results
    .filter((r): r is PromiseFulfilledResult<{ header: Blog; content: string }> => r.status === 'fulfilled')
    .map((r) => r.value.header)

  if (posts.length === 0) return null

  return (
    <section className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-800'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Related Posts</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <UnstyledLink
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group block rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:border-purple-400 dark:hover:border-purple-500 transition-colors'
          >
            <p className='text-xs font-bold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-2'>
              {new Date(post.published).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-2 group-hover:text-purple-600 transition-colors line-clamp-2'>
              {post.title}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3'>{post.summary}</p>
          </UnstyledLink>
        ))}
      </div>
    </section>
  )
}
