import type { CustomSeoProps } from '@/components'

import { MetaPage, SITE_NAME, SITE_URL } from './type'

export const getMetaPage = (data: MetaPage): CustomSeoProps => {
  return {
    canonical: SITE_URL + data.slug,
    openGraph: {
      images: [
        {
          url: data.og_image,
          alt: data.og_image_alt,
          width: 1200,
          height: 600
        }
      ],
      site_name: SITE_NAME,
      url: SITE_URL + data.slug,
      type: data.type ?? 'website',
      locale: 'en_US'
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: data.keywords.join(', ')
      },
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
      }
    ],
    ...data
  }
}
