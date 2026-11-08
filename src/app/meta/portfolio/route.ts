import { getContentBySlug } from '@/services/content'

import { serializeJsonForHtml } from '@/libs/seo/serializeJson'

import type { Portfolio } from 'me'
import { NextRequest, NextResponse } from 'next/server'

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

function generateMetaHtml(project: {
  title: string
  summary: string
  slug: string
  date: string
  image: string
  stack: string[]
}): string {
  const canonicalUrl = `${SITE_URL}/portfolio/${encodeURIComponent(project.slug)}`
  const ogImage = project.image

  const safeTitle = escapeHtml(project.title)
  const safeSummary = escapeHtml(project.summary)
  const safeCanonicalUrl = escapeHtml(canonicalUrl)
  const safeOgImage = escapeHtml(ogImage)
  const safeStack = escapeHtml(project.stack.join(', '))

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic SEO -->
  <title>${safeTitle} | ${SITE_NAME}</title>
  <meta name="description" content="${safeSummary}">
  <link rel="canonical" href="${safeCanonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeSummary}">
  <meta property="og:image" content="${safeOgImage}">
  <meta property="og:url" content="${safeCanonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE_NAME}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeSummary}">
  <meta name="twitter:image" content="${safeOgImage}">
  
  <!-- Redirect to actual page after crawlers have indexed -->
  <script>
    setTimeout(() => {
      window.location.href = ${serializeJsonForHtml(canonicalUrl)};
    }, 100);
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 50px auto; padding: 20px; color: #111;">
  <h1 style="font-size: 32px; margin-bottom: 16px;">${safeTitle}</h1>
  <p style="color: #666; margin-bottom: 24px;">${safeSummary}</p>
  <p style="font-size: 14px; color: #999;">Stack: ${safeStack}</p>
  <p style="margin-top: 24px;"><small>Redirecting to full project page...</small></p>
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
    const project = await getContentBySlug<Portfolio>('/portfolio', slug)

    const html = generateMetaHtml({
      title: project.header.title,
      summary: project.header.summary,
      slug: project.header.slug,
      date: project.header.date,
      image: project.header.image,
      stack: project.header.stack
    })

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch {
    return new NextResponse('Portfolio project not found', { status: 404 })
  }
}
