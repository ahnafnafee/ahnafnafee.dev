import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { Header } from '@/components/UI/common'

import '@/styles/globals.css'
import '@/styles/prism-themes.css'
import 'katex/dist/katex.min.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ahnaf An Nafee',
    url: 'https://www.ahnafnafee.dev',
    description: 'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences.',
    author: {
      '@type': 'Person',
      name: 'Ahnaf An Nafee',
      url: 'https://www.ahnafnafee.dev'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.ahnafnafee.dev/blog?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
