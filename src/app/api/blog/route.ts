import { NextRequest, NextResponse } from 'next/server'
import { getContents, getContentBySlug } from '@/services/content'
import type { Blog } from 'me'

const SITE_URL = 'https://www.ahnafnafee.dev'
const SITE_NAME = 'Ahnaf An Nafee'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const format = searchParams.get('format')

    // Single blog request
    if (slug) {
      try {
        const post = await getContentBySlug<Blog>('/blog', slug)

        // Return as markdown
        if (format === 'markdown' || format === 'md') {
          const markdown = `# ${post.header.title}

> ${post.header.summary}

**Published:** ${post.header.published}${post.header.est_read ? ` | **Read time:** ${post.header.est_read}` : ''}
**Tags:** ${post.header.topics.join(', ')}
**URL:** ${SITE_URL}/blog/${post.header.slug}

---

${post.content}`

          return new NextResponse(markdown, {
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Cache-Control': 'public, max-age=300, s-maxage=600',
              'Access-Control-Allow-Origin': '*'
            }
          })
        }

        // Return as JSON
        const response = {
          title: post.header.title,
          slug: post.header.slug,
          summary: post.header.summary,
          published: post.header.published,
          author: post.header.author_name,
          topics: post.header.topics,
          keywords: post.header.keywords,
          thumbnail: post.header.thumbnail,
          url: `${SITE_URL}/blog/${post.header.slug}`,
          content: post.content
        }

        return NextResponse.json(response, {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=600',
            'Access-Control-Allow-Origin': '*'
          }
        })
      } catch {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
    }

    // List all blogs
    const posts = await getContents<Blog>('/blog')

    // Sort by published date (newest first)
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.header.published)
      const dateB = new Date(b.header.published)
      return dateB.getTime() - dateA.getTime()
    })

    const response = {
      site: SITE_NAME,
      url: SITE_URL,
      description: 'Software Engineer & Game Developer. Building scalable applications and immersive experiences.',
      blogs: sortedPosts.map((post) => ({
        title: post.header.title,
        slug: post.header.slug,
        summary: post.header.summary,
        published: post.header.published,
        author: post.header.author_name,
        topics: post.header.topics,
        featured: post.header.featured,
        thumbnail: post.header.thumbnail,
        url: `${SITE_URL}/blog/${post.header.slug}`,
        markdownUrl: `${SITE_URL}/api/blog?slug=${post.header.slug}&format=md`
      }))
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Failed to fetch blog data:', error)
    return NextResponse.json({ error: 'Failed to fetch blog data' }, { status: 500 })
  }
}
