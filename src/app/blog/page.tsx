import { BlogPageClient } from '@/components/blog/BlogPageClient'
import { AppLayoutPage } from '@/components/legacy-ui/templates/AppLayoutPage'

import { getContents } from '@/services'

import { isDev } from '@/libs/constants/environmentState'
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { getNewestBlog } from '@/libs/sorters'

import type { Blog } from 'me'
import type { Metadata } from 'next'
import readingTime from 'reading-time'

const BLOG_URL = `${SITE_URL}/blog`
const BLOG_OG_IMAGE = 'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-blog.png?tr=w-1200,h-630'
const BLOG_OG_ALT = `Blog - ${SITE_NAME} - Thoughts on AI, 3D Graphics, and Technology`

export const metadata: Metadata = {
  title: `Blog - ${SITE_NAME}`,
  description:
    "You'll find a collection of my thoughts and musings on a variety of topics. I write about everything from current events to personal experiences, and I always strive to share my honest opinions. Keep in mind that my views are my own and do not necessarily reflect those of any other person or organization.",
  keywords: [
    'Ahnaf An Nafee',
    'ahnafnafee',
    'ahnafnafee.dev',
    'blog',
    'AI blog',
    '3D graphics blog',
    'technology blog'
  ],
  alternates: {
    canonical: BLOG_URL
  },
  openGraph: {
    title: `Blog - ${SITE_NAME}`,
    description: "You'll find a collection of my thoughts and musings on a variety of topics.",
    url: BLOG_URL,
    siteName: SITE_NAME,
    images: [{ url: BLOG_OG_IMAGE, width: 1200, height: 630, alt: BLOG_OG_ALT, type: 'image/png' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog - ${SITE_NAME}`,
    description: "You'll find a collection of my thoughts and musings on a variety of topics.",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: BLOG_OG_IMAGE, alt: BLOG_OG_ALT }]
  }
}

async function getBlogData() {
  const response = await getContents<Blog>('/blog')

  if (isDev) {
    return response
      .map((r) => ({
        ...r.header,
        est_read: readingTime(r.content).text
      }))
      .sort(getNewestBlog)
  }

  const slugs = response.map((r) => r.header.slug)

  // Single batched fetch instead of one request per post.
  let views: Record<string, number> = {}
  if (slugs.length > 0) {
    try {
      const res = await fetch(`${SITE_URL}/api/pageviews/batch?slugs=${encodeURIComponent(slugs.join(','))}`, {
        next: { revalidate: 300 }
      })
      if (res.ok) {
        views = (await res.json()) as Record<string, number>
      }
    } catch {
      // Fallback: leave views empty; per-post entries default to 0 below.
    }
  }

  return response
    .map(
      (r) =>
        ({
          ...r.header,
          est_read: readingTime(r.content).text,
          views: views[r.header.slug] ?? 0
        }) as Blog
    )
    .sort(getNewestBlog)
}

export default async function BlogPage() {
  const allBlogs = await getBlogData()

  const webpageId = `${BLOG_URL}#webpage`
  const breadcrumbId = `${BLOG_URL}#breadcrumb`

  // Single @graph: CollectionPage + BreadcrumbList. The explicit
  // primaryImageOfPage tells Google Images "the canonical image for /blog is
  // this branded card, not the post thumbnails rendered in BlogItem cards" —
  // which fixes the case where Google Images was attributing post-detail
  // thumbnails to the /blog URL instead of the post detail.
  const graphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': webpageId,
        url: BLOG_URL,
        name: `Blog - ${SITE_NAME}`,
        description: 'Thoughts on Artificial Intelligence, Computer Graphics, and Software Engineering.',
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: BLOG_OG_IMAGE,
          width: 1200,
          height: 630,
          caption: BLOG_OG_ALT
        },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: allBlogs.length,
          itemListElement: allBlogs.slice(0, 20).map((post, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/blog/${post.slug}`,
            name: post.title
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: BLOG_URL }
        ]
      }
    ]
  }

  return (
    <AppLayoutPage>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <BlogPageClient allBlogs={allBlogs} />
    </AppLayoutPage>
  )
}
