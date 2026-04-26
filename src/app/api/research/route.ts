import { getContentBySlug, getContents } from '@/services/content'

import type { Research } from 'me'
import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = 'https://www.ahnafnafee.dev'
const SITE_NAME = 'Ahnaf An Nafee'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const format = searchParams.get('format')

    if (slug) {
      try {
        const entry = await getContentBySlug<Research>('/research', slug)
        const header = entry.header
        const authorsList = header.authors.map((a) => a.name).join(', ')
        const venueLine = header.venue
          ? `${header.venue.short ?? header.venue.name ?? ''}${header.venue.year ? ` (${header.venue.year})` : ''}`.trim()
          : ''

        if (format === 'markdown' || format === 'md') {
          const lines: string[] = [
            `# ${header.title}`,
            '',
            `> ${header.summary}`,
            '',
            `**Authors:** ${authorsList}`,
            `**Published:** ${header.published}`,
            ...(venueLine ? [`**Venue:** ${venueLine}`] : []),
            `**Topics:** ${header.topics.join(', ')}`,
            `**URL:** ${SITE_URL}/research/${header.slug}`,
            '',
            '## Abstract',
            '',
            header.abstract.trim(),
            '',
            ...(header.links?.paper ? [`- Paper: ${header.links.paper}`] : []),
            ...(header.links?.code ? [`- Code: ${header.links.code}`] : []),
            ...(header.links?.video ? [`- Video: ${header.links.video}`] : []),
            ...(header.links?.dataset ? [`- Dataset: ${header.links.dataset}`] : []),
            '',
            '---',
            '',
            entry.content
          ]
          return new NextResponse(lines.join('\n'), {
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Cache-Control': 'public, max-age=300, s-maxage=600',
              'Access-Control-Allow-Origin': '*'
            }
          })
        }

        const response = {
          title: header.title,
          slug: header.slug,
          summary: header.summary,
          abstract: header.abstract,
          authors: header.authors,
          affiliations: header.affiliations,
          venue: header.venue,
          published: header.published,
          updated: header.updated,
          topics: header.topics,
          keywords: header.keywords,
          links: header.links,
          identifiers: header.identifiers,
          bibtex: header.bibtex,
          thumbnail: header.thumbnail,
          teaser: header.teaser,
          url: `${SITE_URL}/research/${header.slug}`,
          content: entry.content
        }

        return NextResponse.json(response, {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=600',
            'Access-Control-Allow-Origin': '*'
          }
        })
      } catch {
        return NextResponse.json({ error: 'Research entry not found' }, { status: 404 })
      }
    }

    const entries = await getContents<Research>('/research')

    const sorted = entries.sort((a, b) => {
      const dateA = new Date(a.header.published)
      const dateB = new Date(b.header.published)
      return dateB.getTime() - dateA.getTime()
    })

    const response = {
      site: SITE_NAME,
      url: SITE_URL,
      description:
        'Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.',
      research: sorted.map((entry) => ({
        title: entry.header.title,
        slug: entry.header.slug,
        summary: entry.header.summary,
        authors: entry.header.authors,
        venue: entry.header.venue,
        published: entry.header.published,
        topics: entry.header.topics,
        featured: entry.header.featured,
        thumbnail: entry.header.thumbnail,
        teaser: entry.header.teaser,
        links: entry.header.links,
        identifiers: entry.header.identifiers,
        url: `${SITE_URL}/research/${entry.header.slug}`,
        markdownUrl: `${SITE_URL}/api/research?slug=${entry.header.slug}&format=md`
      }))
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Failed to fetch research data:', error)
    return NextResponse.json({ error: 'Failed to fetch research data' }, { status: 500 })
  }
}
