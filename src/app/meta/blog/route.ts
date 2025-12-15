import { NextRequest, NextResponse } from 'next/server'
import { getContentBySlug } from '@/services/content'
import type { Blog } from 'me'
import { generateOgImage } from '@/libs/metapage'

const SITE_URL = 'https://www.ahnafnafee.dev'
const SITE_NAME = 'Ahnaf An Nafee'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function generateMetaHtml(post: {
  title: string
  summary: string
  slug: string
  published: string
  author_name: string
  thumbnail?: string
}): string {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`
  const ogImage = post.thumbnail || generateOgImage({ title: post.title, theme: 'dark' })

  const safeTitle = escapeHtml(post.title)
  const safeSummary = escapeHtml(post.summary)
  const safeAuthor = escapeHtml(post.author_name)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic SEO -->
  <title>${safeTitle} | ${SITE_NAME}</title>
  <meta name="description" content="${safeSummary}">
  <meta name="author" content="${safeAuthor}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeSummary}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="article:published_time" content="${post.published}">
  <meta property="article:author" content="${safeAuthor}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@ahnaf_nafee">
  <meta name="twitter:creator" content="@ahnaf_nafee">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeSummary}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- Redirect to actual page after crawlers have indexed -->
  <script>
    setTimeout(() => {
      window.location.href = "${canonicalUrl}";
    }, 100);
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 50px auto; padding: 20px; color: #111;">
  <h1 style="font-size: 32px; margin-bottom: 16px;">${safeTitle}</h1>
  <p style="color: #666; margin-bottom: 24px;">${safeSummary}</p>
  <p style="font-size: 14px; color: #999;">By ${safeAuthor} · ${post.published}</p>
  <p style="margin-top: 24px;"><small>Redirecting to full article...</small></p>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new NextResponse('Missing slug parameter', { status: 400 })
  }

  try {
    const post = await getContentBySlug<Blog>('/blog', slug)

    const html = generateMetaHtml({
      title: post.header.title,
      summary: post.header.summary,
      slug: post.header.slug,
      published: post.header.published,
      author_name: post.header.author_name,
      thumbnail: post.header.thumbnail
    })

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch {
    return new NextResponse('Blog post not found', { status: 404 })
  }
}
