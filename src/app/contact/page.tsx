import { SITE_AUTHOR } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'

import type { Metadata } from 'next'
import Link from 'next/link'

const CONTACT_OG_IMAGE = generateOgImage({
  title: 'Contact',
  subTitle: 'Get in touch with Ahnaf An Nafee',
  type: 'page'
})

export const metadata: Metadata = {
  title: 'Contact - Ahnaf An Nafee',
  description: 'Get in touch with Ahnaf An Nafee — email, LinkedIn, GitHub, and other ways to reach me.',
  keywords: ['contact ahnaf an nafee', 'get in touch', 'email', 'linkedin', 'github'],
  alternates: {
    canonical: 'https://www.ahnafnafee.dev/contact'
  },
  openGraph: {
    title: 'Contact - Ahnaf An Nafee',
    description: 'Email, LinkedIn, GitHub, and other ways to reach me.',
    url: 'https://www.ahnafnafee.dev/contact',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: CONTACT_OG_IMAGE,
        width: 1200,
        height: 600,
        alt: 'Contact - Ahnaf An Nafee'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Ahnaf An Nafee',
    description: 'Email, LinkedIn, GitHub, and other ways to reach me.',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [CONTACT_OG_IMAGE]
  }
}

export default function ContactPage() {
  return (
    <main className='layout'>
      <div className='mx-auto max-w-4xl py-8'>
        <h1 className='mb-8 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white'>Contact</h1>

        <div className='prose prose-gray dark:prose-invert max-w-none'>
          <section className='mb-8'>
            <p className='mb-4'>
              Have a question about something I&rsquo;ve written, want to talk research or collaboration, or just want
              to say hello? The best way to reach me is by email — I read everything, though it may take a few days to
              reply.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Email</h2>
            <p className='mb-4'>
              <a href={`mailto:${SITE_AUTHOR.email}`} className='text-primary-600 hover:text-primary-700'>
                {SITE_AUTHOR.email}
              </a>
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Elsewhere</h2>
            <ul className='mb-4 list-disc pl-6'>
              <li>
                <strong>LinkedIn:</strong>{' '}
                <a
                  href='https://www.linkedin.com/in/ahnafnafee'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  linkedin.com/in/ahnafnafee
                </a>
              </li>
              <li>
                <strong>GitHub:</strong>{' '}
                <a
                  href='https://github.com/ahnafnafee'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  github.com/ahnafnafee
                </a>
              </li>
              <li>
                <strong>X (Twitter):</strong>{' '}
                <a
                  href='https://twitter.com/ahnaf_nafee'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  @ahnaf_nafee
                </a>
              </li>
              <li>
                <strong>Google Scholar:</strong>{' '}
                <a
                  href='https://scholar.google.com/citations?user=u15DO0cAAAAJ&hl=en'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  Ahnaf An Nafee
                </a>
              </li>
              <li>
                <strong>ORCID:</strong>{' '}
                <a
                  href='https://orcid.org/0009-0000-9363-4536'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  0009-0000-9363-4536
                </a>
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Reporting a Security Issue</h2>
            <p className='mb-4'>
              If you&rsquo;ve found a security vulnerability on this site, please follow the responsible-disclosure
              steps on my{' '}
              <Link href='/security-policy' className='text-primary-600 hover:text-primary-700'>
                Security Policy
              </Link>{' '}
              page instead of the general contact channels above.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
