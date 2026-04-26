import { ResearchPageClient } from '@/components/research/ResearchPageClient'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContentHeaders } from '@/services/content'
import { getNewestResearch } from '@/libs/sorters'
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Research', item: RESEARCH_URL }
    ]
  }

  return (
    <AppLayoutPage>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ResearchPageClient allResearch={allResearch} />
    </AppLayoutPage>
  )
}
