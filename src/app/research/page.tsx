import { ResearchSections } from '@/components/content/research'
import { AppLayoutPage } from '@/components/legacy-ui/templates/AppLayoutPage'

import { Hero } from '@/UI/templates'

import { getContentHeaders } from '@/services/content'

import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { getNewestResearch } from '@/libs/sorters'

import type { Research } from 'me'
import type { Metadata } from 'next'

const RESEARCH_URL = `${SITE_URL}/research`
const RESEARCH_OG_IMAGE = generateOgImage({ title: 'Research', subTitle: SITE_NAME, theme: 'dark' })
const RESEARCH_OG_ALT = `Research - ${SITE_NAME} - Papers and projects on AI & 3D Computer Graphics`

export const metadata: Metadata = {
  title: `Research - ${SITE_NAME}`,
  description:
    'Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics by Ahnaf An Nafee.',
  keywords: [
    'Ahnaf An Nafee research',
    'ahnafnafee research',
    'PhD research AI 3D Graphics',
    'computer graphics research',
    'machine learning for graphics',
    'mesh simplification research',
    'AI 3D content generation',
    'GMU research',
    'DCXR Lab',
    'academic publications',
    'research projects'
  ],
  alternates: {
    canonical: RESEARCH_URL
  },
  openGraph: {
    title: `Research - ${SITE_NAME}`,
    description:
      'Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.',
    url: RESEARCH_URL,
    siteName: SITE_NAME,
    images: [{ url: RESEARCH_OG_IMAGE, width: 1200, height: 630, alt: RESEARCH_OG_ALT, type: 'image/png' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Research - ${SITE_NAME}`,
    description:
      'Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: RESEARCH_OG_IMAGE, alt: RESEARCH_OG_ALT }]
  }
}

async function getResearchData(): Promise<Research[]> {
  try {
    const response = await getContentHeaders<Research>('/research')
    return response.map((r) => r.header).sort(getNewestResearch)
  } catch (error) {
    console.warn('Failed to load research:', error)
    return []
  }
}

export default async function ResearchPage() {
  const allResearch = await getResearchData()

  const webpageId = `${RESEARCH_URL}#webpage`
  const breadcrumbId = `${RESEARCH_URL}#breadcrumb`

  const graphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': webpageId,
        url: RESEARCH_URL,
        name: `Research - ${SITE_NAME}`,
        description:
          'Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.',
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: RESEARCH_OG_IMAGE,
          width: 1200,
          height: 630,
          caption: RESEARCH_OG_ALT
        },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: allResearch.length,
          itemListElement: allResearch.slice(0, 20).map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/research/${r.slug}`,
            name: r.title
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Research', item: RESEARCH_URL }
        ]
      }
    ]
  }

  return (
    <AppLayoutPage>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <Hero
        title='Research'
        description='Papers, course projects, and ongoing investigations at the intersection of AI and 3D computer graphics.'
      />
      <ResearchSections posts={allResearch} />
    </AppLayoutPage>
  )
}
