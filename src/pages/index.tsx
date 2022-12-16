import { CustomSeo } from '@/components'
import { Footer, SocialHome } from '@/components/UI/common'
import { ContentImage } from '@/components/content'
import { PortfolioList } from '@/components/content/portfolio/PortfolioList'

import { GetContents, getContents } from '@/services'

import { getMetaPage } from '@/libs/metapage'
import { getNewestBlog, getNewestPortfolio } from '@/libs/sorters'

import type { Blog, Portfolio } from 'me'
import type { GetStaticProps, NextPage } from 'next'
import readingTime from 'reading-time'

interface HomePageProps {
  blogs: Array<Blog>
  portfolios: Array<Portfolio>
}

const HomePage: NextPage<HomePageProps> = ({ blogs, portfolios }) => {
  const meta = getMetaPage({
    title: 'Ahnaf An Nafee',
    template: 'Software Engineer',
    description: `Personal Website, Online Portfolio And Blog of Ahnaf An Nafee`,
    keywords: ['Ahnaf An Nafee', 'Ahnaf An Nafee', 'ahnafnafee', 'Ahnaf An Nafee', 'ahnafnafee.dev'],
    og_image: `https://ik.imagekit.io/8ieg70pvks/site_og?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747`,
    og_image_alt: 'Ahnaf An Nafee',
    slug: '/',
    type: 'website'
  })

  return (
    <>
      <CustomSeo {...meta} />

      <main className='layout'>
        <section className='flex flex-col'>
          <div className='flex flex-col-reverse sm:flex-row items-start mt-3 md:mt-6'>
            <div className='flex flex-col pr-8'>
              <h1 className='font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white'>
                Ahnaf An Nafee
              </h1>
              <h2 className='text-base text-gray-700 dark:text-gray-200 mb-4'>
                Software Engineer at <span className='font-semibold'>Dynasty 11 Studios</span>
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Hello👋, I&apos;m Ahnaf An Nafee, a guy who loves to code and is passionate about game development!
              </p>
              <SocialHome className='flex-shrink flex-wrap self-start gap-3 mt-4 mb-8' />
            </div>
            <div className='w-[100px] sm:w-[176px] relative mb-8 sm:mb-0 mr-auto'>
              <ContentImage
                src='https://ik.imagekit.io/8ieg70pvks/tr:w-720,h-720,f-auto/profile'
                alt='Ahnaf An Nafee'
                width={176}
                height={176}
                className='rounded-full bottom-1 border-4 cursor-pointer border-theme-100 dark:border-theme-800'
                title="Ahnaf An Nafee's Profile Picture"
                quality={100}
                sizes='30vw'
                priority
              />
            </div>
          </div>
        </section>

        <PortfolioList
          description={`Check out my featured portfolio. View all my works <a href="/portfolio">here</a>!`}
          title='Featured Portfolio'
          portfolios={portfolios}
        />
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [requestBlogs, requestPortfolios] = await Promise.allSettled([
    getContents<Blog>('/blog'),
    getContents<Portfolio>('/portfolio')
  ])

  const blogsData = [] as Array<GetContents<Blog>>
  const portfoliosData = [] as Array<GetContents<Portfolio>>
  // const portfoliosData = [] as Array<Portfolio>

  if (requestBlogs.status === 'fulfilled') {
    requestBlogs.value.forEach((blog) => {
      blogsData.push(blog)
    })
  }
  if (requestPortfolios.status === 'fulfilled') {
    requestPortfolios.value.forEach((portfolio) => {
      portfoliosData.push(portfolio)
    })
  }

  const blogs = blogsData
    .filter((r) => r.header.featured)
    .map((r) => ({ est_read: readingTime(r.content).text, ...r.header }))
    .sort(getNewestBlog)

  const portfolios = portfoliosData
    .map((p) => p.header)
    .filter((f) => f.featured)
    .sort(getNewestPortfolio)

  return {
    props: {
      blogs,
      portfolios
    }
  }
}

export default HomePage
