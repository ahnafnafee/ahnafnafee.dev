import { ResumePageClient } from '@/components/resume/ResumePageClient'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'
import { PERSON_REFERENCE } from '@/libs/seo/personSchema'

import type { Metadata } from 'next'

const RESUME_URL = `${SITE_URL}/resume`
const RESUME_OG_IMAGE = generateOgImage({ title: 'resume' })
const RESUME_OG_ALT = `Resume - ${SITE_NAME} - PhD Student in AI & 3D Graphics @ George Mason University | Ex-CTO`

export const metadata: Metadata = {
  title: `Resume - ${SITE_NAME} | PhD AI & 3D Graphics Researcher`,
  description:
    'PhD student researching AI-driven 3D content generation and graphics pipelines at GMU. DCXR Lab, advised by Dr. Craig Yu. Ex-CTO with experience building production systems. Download PDF resume.',
  keywords: [
    'Ahnaf An Nafee resume',
    'ahnafnafee resume',
    'curriculum vitae',
    'cv download',
    'PhD AI 3D Graphics resume',
    'Computer Science PhD resume',
    'AI researcher resume',
    '3D Computer Graphics researcher',
    'Machine Learning researcher',
    'Computer Vision expert',
    'Generative AI specialist',
    'Rendering Pipeline expert',
    'DevOps Engineer resume',
    'Kubernetes expert resume',
    'OpenShift engineer resume',
    'Cloud Infrastructure specialist',
    'AWS certified professional',
    'Docker containerization expert',
    'CI/CD pipeline specialist',
    'Infrastructure automation expert',
    'George Mason University PhD',
    'GMU computer science PhD',
    'Drexel University alumni',
    'Game Development experience',
    'Unity 3D developer resume',
    'Unreal Engine developer',
    '3D modeling expert',
    'Software Engineer resume',
    'Full stack developer',
    'Python developer resume',
    'Go programming expert',
    'Java developer',
    'Kotlin developer',
    'React Native developer',
    'Tech startup CTO resume',
    'Technical leadership resume',
    'Startup founder experience',
    'Team building experience',
    'Agile development expert',
    'Product leadership',
    'Research publications',
    'Academic research experience',
    'Human computer interaction',
    'Immersive technology expert',
    'Interactive technology',
    'Digital worlds development',
    'Computer graphics research',
    'AI graphics intersection',
    'Theory to practice bridge',
    'Production ready systems',
    'Scalable infrastructure',
    'Modern DevOps principles',
    'ahnafnafee.dev resume'
  ],
  alternates: {
    canonical: RESUME_URL
  },
  openGraph: {
    title: `Resume - ${SITE_NAME} | PhD AI & 3D Graphics Researcher`,
    description:
      'PhD student researching AI-driven 3D content generation and graphics pipelines at GMU. DCXR Lab, advised by Dr. Craig Yu.',
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
    title: `Resume - ${SITE_NAME} | PhD AI & 3D Graphics Researcher`,
    description:
      'PhD student researching AI-driven 3D content generation and graphics pipelines at GMU. DCXR Lab, advised by Dr. Craig Yu.',
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
      'PhD student researching AI-driven 3D content generation and graphics pipelines at George Mason University.',
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
