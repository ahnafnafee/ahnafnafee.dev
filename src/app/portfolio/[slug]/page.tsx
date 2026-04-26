import { HeadingPortfolio, IconStack, MDXComponents, PRButton } from '@/components/content'
import { WrappedImage } from '@/components/legacy-ui/images'
import { AppLayoutPage } from '@/components/legacy-ui/templates/AppLayoutPage'

import { BackToTop } from '@/UI/buttons'

import { getContentBySlug, getContents } from '@/services'

import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/libs/constants/site'
import { commonMDXOptions } from '@/libs/mdxConfig'
import { generateOgImage } from '@/libs/metapage'
import { PERSON_ID } from '@/libs/seo/personSchema'
import { twclsx } from '@/libs/twclsx'

import type { Portfolio } from 'me'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const portfolio = await getContents<Portfolio>('/portfolio')
  return portfolio.map((p) => ({
    slug: p.header.slug
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const res = await getContentBySlug<Portfolio>('/portfolio', slug)
  const header = res.header
  const canonical = `${SITE_URL}/portfolio/${header.slug}`
  const ogAlt = `${header.title} - ${SITE_NAME} Portfolio`

  return {
    title: header.title,
    description: header.summary,
    keywords: header.stack,
    alternates: {
      canonical,
      languages: {
        'en-US': canonical,
        'x-default': canonical
      }
    },
    openGraph: {
      title: header.title,
      description: header.summary,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: generateOgImage({
            title: header.title,
            subTitle: header.summary
          }),
          width: 1200,
          height: 630,
          alt: ogAlt,
          type: 'image/png'
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: header.date,
      modifiedTime: header.updated || header.date
    },
    twitter: {
      card: 'summary_large_image',
      title: header.title,
      description: header.summary,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [
        {
          url: generateOgImage({ title: header.title, subTitle: header.summary }),
          alt: ogAlt
        }
      ]
    }
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const res = await getContentBySlug<Portfolio>('/portfolio', slug)
  const header = res.header
  const pageUrl = `${SITE_URL}/portfolio/${header.slug}`
  const projectId = `${pageUrl}#project`
  const webpageId = `${pageUrl}#webpage`
  const breadcrumbId = `${pageUrl}#breadcrumb`

  // Single @graph: SoftwareSourceCode + WebPage + BreadcrumbList connected by @id.
  const graphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareSourceCode',
        '@id': projectId,
        name: header.title,
        description: header.summary,
        image: header.image,
        dateCreated: header.date,
        dateModified: header.updated || header.date,
        inLanguage: 'en-US',
        author: { '@id': PERSON_ID },
        programmingLanguage: header.stack,
        ...(header.link.github && { codeRepository: header.link.github }),
        ...(header.link.live && { url: header.link.live }),
        mainEntityOfPage: { '@id': webpageId }
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: header.title,
        description: header.summary,
        inLanguage: 'en-US',
        datePublished: header.date,
        dateModified: header.updated || header.date,
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
        primaryImageOfPage: { '@type': 'ImageObject', url: header.image },
        breadcrumb: { '@id': breadcrumbId }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE_URL}/portfolio` },
          { '@type': 'ListItem', position: 3, name: header.title, item: pageUrl }
        ]
      }
    ]
  }

  return (
    <AppLayoutPage>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <BackToTop />

      <article className={twclsx('flex flex-col', 'gap-8')}>
        <HeadingPortfolio {...header} />

        <section className={twclsx('flex flex-col gap-4', 'md:flex-row md:items-center md:justify-between')}>
          <div className={twclsx('flex flex-shrink flex-wrap items-center gap-4', 'w-full')}>
            {header.stack.map((s) => (
              <span className={'flex cursor-pointer flex-row items-center gap-2'} key={s}>
                <IconStack type={s} />
                <p className={'text-xs font-medium uppercase'}>{s}</p>
              </span>
            ))}
          </div>
        </section>

        <p className={'mt-4 w-full text-center font-medium text-gray-600 italic dark:text-gray-400'}>
          {header.summary}
        </p>

        <WrappedImage
          title={header.title}
          alt={header.title}
          src={header.image + '&tr=w-700'}
          parentStyle='w-full h-56 sm:h-72 md:h-96 my-4'
          className='rounded-lg object-cover'
          priority
          fill
        />

        <section className={twclsx('prose', 'dark:prose-invert', 'md:prose-lg')}>
          <MDXRemote source={res.content} components={MDXComponents} options={commonMDXOptions} />
        </section>

        <div className='mt-5 mb-2'>
          <PRButton path={`/portfolio/${header.slug}.mdx`} />
        </div>
      </article>
    </AppLayoutPage>
  )
}
