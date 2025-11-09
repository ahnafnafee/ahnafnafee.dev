import { NextSeo } from 'next-seo'
import type { NextSeoProps } from 'next-seo'

export type CustomSeoProps = {
  template?: string
} & Omit<NextSeoProps, 'children'>

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'ahnafnafee.dev'
const SITE_URL = 'https://www.ahnafnafee.dev'

/**
 * Enhanced SEO component with better defaults for search engine optimization
 */
export const CustomSeo: React.FunctionComponent<CustomSeoProps> = ({ ...props }) => {
  const TITLE_TEMPLATE = `%s — ${props.template ?? SITE_NAME}`

  const defaultProps: Partial<NextSeoProps> = {
    canonical: `${SITE_URL}${props.canonical || ''}`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${SITE_URL}${props.openGraph?.url || ''}`,
      siteName: SITE_NAME,
      images: [
        {
          url: props.openGraph?.images?.[0]?.url || `${SITE_URL}/static/favicons/android-chrome-512x512.png`,
          width: 1200,
          height: 630,
          alt: props.openGraph?.images?.[0]?.alt || 'Ahnaf An Nafee - PhD Student in AI & 3D Graphics | DevOps Engineer'
        }
      ],
      ...props.openGraph
    },
    additionalMetaTags: [
      {
        name: 'author',
        content: 'Ahnaf An Nafee'
      },
      {
        name: 'creator',
        content: 'Ahnaf An Nafee'
      },
      {
        name: 'publisher',
        content: 'Ahnaf An Nafee'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      },
      {
        name: 'theme-color',
        content: '#18181b'
      },
      {
        name: 'msapplication-TileColor',
        content: '#18181b'
      },
      {
        name: 'robots',
        content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      },
      {
        name: 'bingbot',
        content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      },
      {
        name: 'language',
        content: 'English'
      },
      {
        name: 'geo.region',
        content: 'US'
      },
      {
        name: 'geo.placename',
        content: 'United States'
      },
      {
        property: 'article:author',
        content: 'Ahnaf An Nafee'
      },
      {
        property: 'profile:first_name',
        content: 'Ahnaf'
      },
      {
        property: 'profile:last_name',
        content: 'An Nafee'
      },
      {
        property: 'profile:username',
        content: 'ahnafnafee'
      },
      ...(props.additionalMetaTags || [])
    ],
    additionalLinkTags: [
      {
        rel: 'icon',
        href: '/static/favicons/favicon.ico'
      },
      {
        rel: 'apple-touch-icon',
        href: '/static/favicons/apple-touch-icon.png',
        sizes: '180x180'
      },
      {
        rel: 'manifest',
        href: '/manifest.json'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://ik.imagekit.io'
      },
      ...(props.additionalLinkTags || [])
    ]
  }

  return <NextSeo {...defaultProps} {...props} title={props.title} titleTemplate={TITLE_TEMPLATE} />
}
