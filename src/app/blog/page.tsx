import { BlogPageClient } from '@/components/blog/BlogPageClient'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContents } from '@/services'
import { isDev } from '@/libs/constants/environmentState'
import { getNewestBlog } from '@/libs/sorters'
import type { Blog, PageViewResponse } from 'me'
import type { Metadata } from 'next'
import readingTime from 'reading-time'

export const metadata: Metadata = {
  title: 'Blog - Ahnaf An Nafee',
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
  openGraph: {
    title: 'Blog - Ahnaf An Nafee',
    description: "You'll find a collection of my thoughts and musings on a variety of topics.",
    url: 'https://www.ahnafnafee.dev/blog',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: 'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-blog.png?tr=w-1200,h-630',
        width: 1200,
        height: 600,
        alt: 'Blog - Ahnaf An Nafee - Thoughts on AI, 3D Graphics, and Technology'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Ahnaf An Nafee',
    description: "You'll find a collection of my thoughts and musings on a variety of topics.",
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [
      'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-blog.png?tr=w-1200,h-630'
    ]
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

  const baseURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahnafnafee.dev'
  const blogs: Blog[] = []

  const requests = response.map(async (r) => {
    try {
      const res = await fetch(`${baseURL}/api/pageviews?slug=${r.header.slug}`)
      const data: PageViewResponse = await res.json()
      const est_read = readingTime(r.content).text
      const views = data.view ?? 0

      return { ...r.header, views, est_read } as Blog
    } catch {
      // Fallback if pageviews API fails
      const est_read = readingTime(r.content).text
      return { ...r.header, views: 0, est_read } as Blog
    }
  })

  const settles = await Promise.allSettled(requests)

  settles.forEach((settle) => {
    if (settle.status === 'fulfilled') {
      blogs.push(settle.value)
    }
  })

  return blogs.sort(getNewestBlog)
}

export default async function BlogPage() {
  const allBlogs = await getBlogData()

  return (
    <AppLayoutPage>
      <BlogPageClient allBlogs={allBlogs} />
    </AppLayoutPage>
  )
}
