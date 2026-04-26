import { ResumePageClient } from '@/components/resume/ResumePageClient'
import { getPersonNode } from '@/libs/seo/personSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher',
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
    canonical: 'https://www.ahnafnafee.dev/resume'
  },
  openGraph: {
    title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher',
    description:
      'PhD student researching AI-driven 3D content generation and graphics pipelines at GMU. DCXR Lab, advised by Dr. Craig Yu.',
    url: 'https://www.ahnafnafee.dev/resume',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: 'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-resume.png?tr=w-1200,h-630',
        width: 1200,
        height: 630,
        alt: 'Resume - Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University | Ex-CTO',
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
    title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher',
    description:
      'PhD student researching AI-driven 3D content generation and graphics pipelines at GMU. DCXR Lab, advised by Dr. Craig Yu.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [
      {
        url: 'https://ik.imagekit.io/8ieg70pvks/ahnafnafee-resume.png?tr=w-1200,h-630',
        alt: 'Resume - Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University | Ex-CTO'
      }
    ]
  }
}

export default function ResumePage() {
  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://www.ahnafnafee.dev/resume#profile',
    url: 'https://www.ahnafnafee.dev/resume',
    name: 'Resume — Ahnaf An Nafee',
    description:
      'PhD student researching AI-driven 3D content generation and graphics pipelines at George Mason University.',
    mainEntity: getPersonNode(),
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://www.ahnafnafee.dev'
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ahnafnafee.dev' },
      { '@type': 'ListItem', position: 2, name: 'Resume', item: 'https://www.ahnafnafee.dev/resume' }
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
