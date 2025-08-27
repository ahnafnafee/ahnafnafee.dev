import { WrappedImage } from '@/components/UI/images'
import { HeadingPortfolio, IconStack, MDXComponents, PRButton } from '@/components/content'
import { BackToTop } from '@/UI/buttons'
import { AppLayoutPage } from '@/components/UI/templates/AppLayoutPage'
import { getContentBySlug, getContents } from '@/services'
import { generateOgImage } from '@/libs/metapage'
import { twclsx } from '@/libs/twclsx'
import type { Portfolio } from 'me'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import mdxPrism from 'mdx-prism'
import rehypeSlug from 'rehype-slug'

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

  return {
    title: header.title,
    description: header.summary,
    keywords: header.stack,
    openGraph: {
      title: header.title,
      description: header.summary,
      url: `https://www.ahnafnafee.dev/portfolio/${header.slug}`,
      siteName: 'Ahnaf An Nafee',
      images: [
        {
          url: generateOgImage({
            title: header.title,
            subTitle: header.summary
          }),
          width: 1200,
          height: 600,
          alt: `${header.title} - Ahnaf An Nafee Portfolio`
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: header.title,
      description: header.summary,
      site: '@ahnaf_nafee',
      creator: '@ahnaf_nafee',
      images: [
        generateOgImage({
          title: header.title,
          subTitle: header.summary
        })
      ]
    }
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const res = await getContentBySlug<Portfolio>('/portfolio', slug)
  const header = res.header

  return (
    <AppLayoutPage>
      <BackToTop />

      <article className={twclsx('flex flex-col', 'gap-8')}>
        <HeadingPortfolio {...header} />

        <section className={twclsx('flex flex-col gap-4', 'md:flex-row md:items-center md:justify-between')}>
          <div className={twclsx('flex items-center gap-4 flex-wrap flex-shrink', 'w-full')}>
            {header.stack.map((s) => (
              <span className={'flex flex-row items-center gap-2 cursor-pointer'} key={s}>
                <IconStack type={s} />
                <p className={'uppercase text-xs font-medium'}>{s}</p>
              </span>
            ))}
          </div>
        </section>

        <p className={'w-full mt-4 font-medium text-gray-600 dark:text-gray-400 italic text-center'}>
          {header.summary}
        </p>

        <WrappedImage
          title={header.title}
          alt={header.title}
          src={header.image + '&tr=w-700'}
          parentStyle='w-full h-56 sm:h-72 md:h-96 my-4'
          className='object-cover rounded-lg'
          priority
          fill
        />

        <section className={twclsx('prose', 'dark:prose-invert', 'md:prose-lg')}>
          <MDXRemote
            source={res.content}
            components={MDXComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [mdxPrism, rehypeSlug]
              }
            }}
          />
        </section>

        <div className='mt-5 mb-2'>
          <PRButton path={`/portfolio/${header.slug}.mdx`} />
        </div>
      </article>
    </AppLayoutPage>
  )
}
