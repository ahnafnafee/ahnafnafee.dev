import { WrappedImage } from '@/components/UI/images'
import { HeadingPortfolio, IconStack, MDXComponents, PRButton } from '@/components/content'

import { BackToTop } from '@/UI/buttons'
import { LayoutPage } from '@/UI/templates'
import type { LayoutPageProps } from '@/UI/templates'

import { getContentBySlug, getContents } from '@/services'

import { generateOgImage, getMetaPage } from '@/libs/metapage'
import { twclsx } from '@/libs/twclsx'

import type { Portfolio } from 'me'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import type { ParsedUrlQuery } from 'querystring'
import rehypeSlug from 'rehype-slug'

type ProjectDetailPageProps = {
  header: Portfolio
  mdxSource: MDXRemoteSerializeResult
}

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = ({ header, mdxSource }) => {
  const metaData = getMetaPage({
    title: header.title,
    description: header.summary,
    og_image: generateOgImage({
      title: header.title,
      subTitle: header.summary
    }),
    og_image_alt: `${header.title} - Ahnaf An Nafee Portfolio`,
    keywords: header.stack,
    slug: '/portfolio/' + header.slug
  })

  return (
    <LayoutPage {...metaData}>
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
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </section>

        <div className='mt-5 mb-2'>
          <PRButton path={`/portfolio/${header.slug}.mdx`} />
        </div>
      </article>
    </LayoutPage>
  )
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const portfolio = await getContents<Portfolio>('/portfolio')

  const paths = portfolio.map((p) => ({ params: { slug: p.header.slug } }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<ProjectDetailPageProps> = async (ctx) => {
  const mdxPrism = await import('mdx-prism')
  const { slug } = ctx.params as ParsedUrlQuery & { slug: string }

  const res = await getContentBySlug<Portfolio>('/portfolio', slug)

  const mdxSource = await serialize(res.content, { mdxOptions: { rehypePlugins: [mdxPrism.default, rehypeSlug] } })

  return {
    props: {
      header: res.header,
      mdxSource
    }
  }
}

export default ProjectDetailPage
