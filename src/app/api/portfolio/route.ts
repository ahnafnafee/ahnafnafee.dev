import { NextRequest, NextResponse } from 'next/server'
import { getContents, getContentBySlug } from '@/services/content'
import type { Portfolio } from 'me'

const SITE_URL = 'https://www.ahnafnafee.dev'
const SITE_NAME = 'Ahnaf An Nafee'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const format = searchParams.get('format')

    // Single portfolio request
    if (slug) {
      try {
        const project = await getContentBySlug<Portfolio>('/portfolio', slug)

        // Return as markdown
        if (format === 'markdown' || format === 'md') {
          const markdown = `# ${project.header.title}

> ${project.header.summary}

**Date:** ${project.header.date}
**Stack:** ${project.header.stack.join(', ')}
**Category:** ${project.header.category || 'software'}
**URL:** ${SITE_URL}/portfolio/${project.header.slug}

## Links
${project.header.link.github ? `- GitHub: ${project.header.link.github}` : ''}
${project.header.link.live ? `- Live: ${project.header.link.live}` : ''}
${project.header.link.appStore ? `- App Store: ${project.header.link.appStore}` : ''}
${project.header.link.playStore ? `- Play Store: ${project.header.link.playStore}` : ''}

---

${project.content}`

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
          title: project.header.title,
          slug: project.header.slug,
          summary: project.header.summary,
          date: project.header.date,
          stack: project.header.stack,
          image: project.header.image,
          link: project.header.link,
          category: project.header.category,
          featured: project.header.featured,
          url: `${SITE_URL}/portfolio/${project.header.slug}`,
          content: project.content
        }

        return NextResponse.json(response, {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=600',
            'Access-Control-Allow-Origin': '*'
          }
        })
      } catch {
        return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 })
      }
    }

    // List all portfolios
    const projects = await getContents<Portfolio>('/portfolio')

    // Sort by date (newest first)
    const sortedProjects = projects.sort((a, b) => {
      const dateA = new Date(a.header.date)
      const dateB = new Date(b.header.date)
      return dateB.getTime() - dateA.getTime()
    })

    const response = {
      site: SITE_NAME,
      url: SITE_URL,
      description: 'Software Engineer & Game Developer. Building scalable applications and immersive experiences.',
      portfolios: sortedProjects.map((project) => ({
        title: project.header.title,
        slug: project.header.slug,
        summary: project.header.summary,
        date: project.header.date,
        stack: project.header.stack,
        image: project.header.image,
        link: project.header.link,
        category: project.header.category,
        featured: project.header.featured,
        url: `${SITE_URL}/portfolio/${project.header.slug}`,
        markdownUrl: `${SITE_URL}/api/portfolio?slug=${project.header.slug}&format=md`
      }))
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 })
  }
}
