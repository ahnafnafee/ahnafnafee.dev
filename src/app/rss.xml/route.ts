import { NextResponse } from 'next/server'
import { getContents } from '@/services/content'
import type { Blog } from 'me'

const SITE_URL = 'https://www.ahnafnafee.dev'
const SITE_TITLE = 'Ahnaf An Nafee'
const SITE_DESCRIPTION = 'Software Engineer & Game Developer. Building scalable applications and immersive experiences.'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const posts = await getContents<Blog>('/blog')

    // Sort by published date (newest first)
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.header.published)
      const dateB = new Date(b.header.published)
      return dateB.getTime() - dateA.getTime()
    })

    const items = sortedPosts
      .map((post) => {
        const pubDate = new Date(post.header.published).toUTCString()
        const url = `${SITE_URL}/blog/${post.header.slug}`

        return `
    <item>
      <title>${escapeXml(post.header.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.header.summary)}</description>
      <author>${escapeXml(post.header.author_name)}</author>
      ${post.header.topics.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
      })
      .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200'
      }
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new NextResponse('Failed to generate RSS feed', { status: 500 })
  }
}
