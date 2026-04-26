import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import type { Viewport } from 'next'
import { Header } from '@/components/UI/common'
import { PERSON_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/libs/constants/site'

import '@/styles/globals.css'
import '@/styles/prism-themes.css'
import 'katex/dist/katex.min.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' }
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // WebSite schema with SearchAction for sitelinks search box
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: { '@id': PERSON_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // SiteNavigationElement schema for sitelinks
  const navigationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SiteNavigationElement',
        '@id': `${SITE_URL}/#navigation`,
        name: 'Main Navigation',
        hasPart: [
          { '@type': 'SiteNavigationElement', name: 'Home', url: SITE_URL },
          { '@type': 'SiteNavigationElement', name: 'Research', url: `${SITE_URL}/research` },
          { '@type': 'SiteNavigationElement', name: 'Blog', url: `${SITE_URL}/blog` },
          { '@type': 'SiteNavigationElement', name: 'Portfolio', url: `${SITE_URL}/portfolio` },
          { '@type': 'SiteNavigationElement', name: 'Resume', url: `${SITE_URL}/resume` }
        ]
      }
    ]
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* IndieAuth / Mastodon / Bluesky identity links — verifiable backlinks
            that cement the canonical Person entity across the federated web. */}
        <link rel='me' href='https://github.com/ahnafnafee' />
        <link rel='me' href='https://www.linkedin.com/in/ahnafnafee' />
        <link rel='me' href='https://scholar.google.com/citations?user=u15DO0cAAAAJ&hl=en' />
        <link rel='me' href='https://orcid.org/0009-0000-9363-4536' />
        <link rel='author' href={`${SITE_URL}/resume`} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationJsonLd) }}
        />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header />
          {children}
          <Toaster position='bottom-center' />
          <Analytics />
          <SpeedInsights />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-7S76865HNX" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7S76865HNX');
          `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  )
}
