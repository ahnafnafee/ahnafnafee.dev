import { SITE_AUTHOR } from '@/libs/constants/site'
import { generateOgImage } from '@/libs/metapage'

import type { Metadata } from 'next'

const PRIVACY_OG_IMAGE = generateOgImage({
  title: 'Privacy Policy',
  subTitle: 'How this site handles data, cookies, and ads',
  type: 'page'
})

export const metadata: Metadata = {
  title: 'Privacy Policy - Ahnaf An Nafee',
  description:
    'Privacy policy for ahnafnafee.dev — how cookies, analytics, and third-party advertising (Google AdSense) are used on this site.',
  keywords: ['privacy policy', 'cookies', 'google adsense', 'analytics', 'ahnafnafee privacy'],
  alternates: {
    canonical: 'https://www.ahnafnafee.dev/privacy-policy'
  },
  openGraph: {
    title: 'Privacy Policy - Ahnaf An Nafee',
    description: 'How cookies, analytics, and third-party advertising are used on ahnafnafee.dev',
    url: 'https://www.ahnafnafee.dev/privacy-policy',
    siteName: 'Ahnaf An Nafee',
    images: [
      {
        url: PRIVACY_OG_IMAGE,
        width: 1200,
        height: 600,
        alt: 'Privacy Policy - Ahnaf An Nafee'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Ahnaf An Nafee',
    description: 'How cookies, analytics, and third-party advertising are used on ahnafnafee.dev',
    site: '@ahnaf_nafee',
    creator: '@ahnaf_nafee',
    images: [PRIVACY_OG_IMAGE]
  }
}

export default function PrivacyPolicyPage() {
  return (
    <main className='layout'>
      <div className='mx-auto max-w-4xl py-8'>
        <h1 className='mb-8 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white'>
          Privacy Policy
        </h1>

        <div className='prose prose-gray dark:prose-invert max-w-none'>
          <section className='mb-8'>
            <p className='mb-4'>
              This Privacy Policy explains what information is collected when you visit <code>ahnafnafee.dev</code> (the
              &ldquo;Site&rdquo;), how it is used, and the choices you have. This is a personal portfolio and blog
              operated by {SITE_AUTHOR.name}. By using the Site, you consent to the practices described here.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Information I Collect</h2>
            <p className='mb-4'>
              I do not ask you to create an account and I do not directly collect personal information such as your name
              or address just for browsing. The Site does collect limited data automatically and through the third-party
              services below:
            </p>
            <ul className='mb-4 list-disc pl-6'>
              <li>
                <strong>Usage and device data</strong> — pages visited, referring page, approximate location, browser
                type, and device information, gathered by the analytics providers described below.
              </li>
              <li>
                <strong>Cookies and similar technologies</strong> — small files stored by your browser, used by
                advertising and analytics partners (see below).
              </li>
              <li>
                <strong>Information you choose to send</strong> — if you email me or post a comment, I receive whatever
                you include (for example, your email address or GitHub username).
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Cookies and Web Beacons</h2>
            <p className='mb-4'>
              The Site uses cookies to store visitor preferences and to record data for the third-party services below.
              You can disable cookies through your browser settings; doing so does not prevent you from reading the
              Site, though some features may behave differently.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Advertising — Google AdSense</h2>
            <p className='mb-4'>
              This Site displays ads served by Google AdSense, a third-party advertising vendor. Google and its partners
              use cookies (including the DoubleClick DART cookie) to serve ads based on your prior visits to this Site
              and other sites on the internet.
            </p>
            <ul className='mb-4 list-disc pl-6'>
              <li>
                Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you based on your
                visits to this and other websites.
              </li>
              <li>
                You may opt out of personalized advertising by visiting{' '}
                <a
                  href='https://www.google.com/settings/ads'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                You can opt out of third-party vendor cookies for personalized advertising at{' '}
                <a
                  href='https://www.aboutads.info/choices/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  aboutads.info/choices
                </a>
                .
              </li>
              <li>
                For more detail, see{' '}
                <a
                  href='https://policies.google.com/technologies/partner-sites'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  How Google uses information from sites that use its services
                </a>
                .
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Analytics</h2>
            <p className='mb-4'>
              The Site uses the following analytics services to understand traffic and performance:
            </p>
            <ul className='mb-4 list-disc pl-6'>
              <li>
                <strong>Google Analytics</strong> — measures aggregate traffic and usage. Google&rsquo;s handling of
                this data is governed by the{' '}
                <a
                  href='https://policies.google.com/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  Google Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Vercel Analytics and Speed Insights</strong> — privacy-friendly, aggregated performance and
                traffic metrics collected by the Site&rsquo;s host, Vercel. See the{' '}
                <a
                  href='https://vercel.com/legal/privacy-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700'
                >
                  Vercel Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Comments</h2>
            <p className='mb-4'>
              Blog comments are powered by Giscus, which stores discussions in GitHub Discussions. To comment you sign
              in with a GitHub account, and any comment you post is public. This processing is governed by the{' '}
              <a
                href='https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-600 hover:text-primary-700'
              >
                GitHub Privacy Statement
              </a>
              .
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Images and Media</h2>
            <p className='mb-4'>
              Images are delivered through the ImageKit content delivery network and, in some posts, embedded YouTube
              videos. These providers may receive your IP address and standard request data in order to serve content.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>External Links</h2>
            <p className='mb-4'>
              The Site links to external websites that I do not control. This Privacy Policy does not apply to those
              sites, and I encourage you to review their privacy policies.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Children&rsquo;s Privacy</h2>
            <p className='mb-4'>
              The Site is not directed to children under the age of 13, and I do not knowingly collect personal
              information from children. If you believe a child has provided such information, please contact me and I
              will remove it.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Your Choices</h2>
            <ul className='mb-4 list-disc pl-6'>
              <li>Adjust or block cookies through your browser settings.</li>
              <li>Opt out of personalized ads using the links in the Advertising section above.</li>
              <li>Use browser privacy extensions or &ldquo;Do Not Track&rdquo; signals as you prefer.</li>
              <li>Contact me to ask what information you have sent me directly and to request its deletion.</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Changes to This Policy</h2>
            <p className='mb-4'>
              I may update this Privacy Policy from time to time. Changes take effect when posted on this page, and the
              &ldquo;Last Updated&rdquo; date below reflects the latest revision.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>Contact</h2>
            <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${SITE_AUTHOR.email}`} className='text-primary-600 hover:text-primary-700'>
                  {SITE_AUTHOR.email}
                </a>
              </p>
              <p>
                <strong>Last Updated:</strong> July 2026
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
