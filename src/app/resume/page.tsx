import { ResumePageClient } from '@/components/resume/ResumePageClient'
import { generateOgImage } from '@/libs/metapage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher | DevOps Engineer',
  description:
    '🚀 Professional Resume of Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University. I operate at the intersection of AI 🧠, 3D Computer Graphics 🌐, and scalable Cloud Infrastructure ☁️. Ex-CTO with expertise in Kubernetes, OpenShift, AWS, and technical leadership. Download PDF resume.',
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
  openGraph: {
    title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher | DevOps Engineer',
    description:
      '🚀 Professional Resume of Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University.',
    url: 'https://www.ahnafnafee.dev/resume',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: generateOgImage({
          title: 'Resume',
          subTitle: 'PhD Student in AI & 3D Graphics | Ex-CTO'
        }),
        width: 1200,
        height: 600,
        alt: 'Resume - Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University | Ex-CTO'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume - Ahnaf An Nafee | PhD AI & 3D Graphics Researcher | DevOps Engineer',
    description:
      '🚀 Professional Resume of Ahnaf An Nafee - PhD Student in AI & 3D Graphics @ George Mason University.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [
      generateOgImage({
        title: 'Resume',
        subTitle: 'PhD Student in AI & 3D Graphics | Ex-CTO'
      })
    ]
  }
}

export default function ResumePage() {
  return <ResumePageClient />
}
