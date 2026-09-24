import { ResumePageClient } from '@/components/resume/ResumePageClient'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { PERSON_REFERENCE } from '@/libs/seo/personSchema'

import type { Metadata } from 'next'

const RESUME_URL = `${SITE_URL}/resume`
const RESUME_OG_IMAGE = generateOgImage({
  title: 'Resume',
  subTitle: 'HCI · ML systems · Research engineering',
  type: 'resume'
})
const RESUME_OG_ALT = `Resume - ${SITE_NAME} - Computer Science PhD student at George Mason University`

export const metadata: Metadata = {
  title: `Resume - ${SITE_NAME} | HCI and ML Systems`,
  description:
    'Computer Science PhD student at George Mason University working across HCI, ML systems, research software, and production engineering. View experience and download the current résumé.',
  keywords: [
    'Ahnaf An Nafee resume',
    'Computer Science PhD student',
    'George Mason University',
    'human-computer interaction',
    'research engineering',
    'ML systems',
    'recommendation evaluation',
    'Unity C# research software',
    'Kubernetes OpenShift',
    'Player 2',
    'Summer 2027 research internship'
  ],
  alternates: {
    canonical: RESUME_URL
  },
  openGraph: {
    title: `Resume - ${SITE_NAME} | HCI and ML Systems`,
    description:
      'Computer Science PhD student at George Mason University working across HCI, ML systems, and research software.',
    url: RESUME_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: RESUME_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: RESUME_OG_ALT,
        type: 'image/png'
      }
    ],
    locale: 'en_US',
    type: 'profile',
    firstName: 'Ahnaf',
    lastName: 'Nafee',
    username: 'ahnafnafee'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Resume - ${SITE_NAME} | HCI and ML Systems`,
    description:
      'Computer Science PhD student at George Mason University working across HCI, ML systems, and research software.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [{ url: RESUME_OG_IMAGE, alt: RESUME_OG_ALT }]
  }
}

export default function ResumePage() {
  // Reference the canonical Person by @id rather than re-emitting the full
  // sameAs/knowsAbout/credentials block (those live on the home page). A few
  // resume-relevant fields are inlined so the resume page still has useful
  // standalone schema even if a crawler doesn't follow the @id back to /.
  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${RESUME_URL}#profile`,
    url: RESUME_URL,
    name: `Resume — ${SITE_NAME}`,
    description:
      'Computer Science PhD student at George Mason University with research and engineering experience in HCI, ML systems, and interactive software.',
    inLanguage: 'en-US',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: RESUME_OG_IMAGE,
      width: 1200,
      height: 630,
      caption: RESUME_OG_ALT
    },
    mainEntity: {
      ...PERSON_REFERENCE,
      jobTitle: 'PhD Student in Computer Science',
      description: SITE_DESCRIPTION
    },
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Resume', item: RESUME_URL }
    ]
  }

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ResumePageClient />
    </>
  )
}
