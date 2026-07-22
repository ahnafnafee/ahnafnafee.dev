import { Clarity, Header } from '@/components/site/common'
import { Toaster } from '@/components/ui/sonner'

import { PERSON_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/libs/constants/site'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'

import '@/styles/globals.css'
import '@/styles/prism-themes.css'
import 'katex/dist/katex.min.css'

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400..700;1,400..700&display=swap'

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
        {/* Google Sans Text — primary site font; local Inter @font-face stays as a fallback in globals.css */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='stylesheet' href={GOOGLE_FONTS_HREF} />

        {/* IndieAuth / Mastodon / Bluesky identity links — verifiable backlinks
            that cement the canonical Person entity across the federated web. */}
        <link rel='me' href='https://github.com/ahnafnafee' />
        <link rel='me' href='https://www.linkedin.com/in/ahnafnafee' />
        <link rel='me' href='https://scholar.google.com/citations?user=u15DO0cAAAAJ&hl=en' />
        <link rel='me' href='https://orcid.org/0009-0000-9363-4536' />
        <link rel='author' href={`${SITE_URL}/resume`} />

        {/* Google AdSense account verification */}
        <meta name='google-adsense-account' content='ca-pub-1038888374692513' />
      </head>
      <body suppressHydrationWarning>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationJsonLd) }} />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header />
          {children}
          <Toaster position='bottom-center' richColors />
          <Analytics />
          <SpeedInsights />
          <Clarity />
          <Script src='https://www.googletagmanager.com/gtag/js?id=G-7S76865HNX' strategy='afterInteractive' />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Consent Mode v2 — storage defaults to denied in regions whose law
            // requires opt-in consent (EEA + UK + CH). Google's certified CMP
            // (AdSense Privacy & messaging, served via the adsbygoogle script)
            // shows the consent banner in those regions and updates these
            // signals on the visitor's choice; wait_for_update holds tags
            // briefly so a stored choice applies before anything fires.
            // Visitors elsewhere keep the regular defaults.
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500,
              region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH']
            });
            gtag('set', 'ads_data_redaction', true);

            gtag('js', new Date());

            gtag('config', 'G-7S76865HNX');
          `}
          </Script>
          <Script
            id='google-adsense'
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1038888374692513'
            strategy='afterInteractive'
            crossOrigin='anonymous'
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
