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
    description: `Personal Website, Online Portfolio And Blog, Built On Top Of NEXT.js, An Online Space For Rizki To Share His Knowledge And Experience.`,
    keywords: ['Ahnaf An Nafee', 'Ahnaf An Nafee', 'ahnafnafee', 'Ahnaf An Nafee', 'ahnafnafee.dev'],
    og_image: `https://ik.imagekit.io/8ieg70pvks/tr:w-${712},h-${712},tr:bl-10,f-auto/profile?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747`,
    og_image_alt: 'Ahnaf An Nafee',
    slug: '/',
    type: 'website'
  })
  return (
    <>
      <CustomSeo {...meta} />

      <div className='w-full h-40 md:layout pattern' />

      <main className='layout'>
        <section className='flex flex-col'>
          <div className='relative flex h-14 md:h-16'>
            <ContentImage
              src='https://ik.imagekit.io/8ieg70pvks/tr:w-720,h-720,f-auto/profile'
              alt='Ahnaf An Nafee'
              width={128}
              height={128}
              className='rounded-full absolute -left-1 bottom-1 border-4 cursor-pointer border-theme-100 dark:border-theme-800'
              title="Ahnaf An Nafee's Profile Picture"
              quality={100}
              priority
            />
            <SocialHome className='ml-auto max-w-max' />
          </div>

          <div className='mt-3 md:mt-6'>
            <h1>Ahnaf An Nafee</h1>
            <h2 className='max-w-max mt-1.5 md:mt-2.5 mb-6 md:mb-8 text-transparent font-bold text-xl md:text-2xl bg-clip-text bg-gradient-to-r  from-primary-500 to-ternary-500 dark:text-transparent'>
              Software Engineer
            </h2>

            <div className='[&>p:not(:last-child)]:mb-3 [&>p]:max-w-prose md:pb-6'>
              <p>
                Hello👋, I&apos;m Ahnaf An Nafee, a guy who loves to code and is passionate about game development.
                Welcome to my personal website, where you can find my portfolio, blog and more.
              </p>

              <p>
                As a <strong>skilled software developer</strong>, I have expertise in frontend and backend technologies
                such as React Native, TypeScript, Spring Boot, and Node.js. I have implemented DevOps pipelines and
                automated build and deployment processes, as well as managed AWS cloud environments.
              </p>

              <p>
                I am dedicated to creating <strong>user-friendly and scalable applications</strong> and have developed
                responsive,
                <strong>reusable</strong> components and integrated third-party services and APIs. Additionally, I have
                experience in game programming and development, including{' '}
                <strong>creating custom shaders and game managers</strong>.
              </p>

              <p>
                I&apos;m very interested with <strong>Software Engineering</strong>, <strong>Cloud Engineering</strong>,{' '}
                <strong>AI/ML Engineering</strong>, <strong>Game Programming</strong>,{' '}
                <strong>Graphical Shader Programming</strong>
                and <strong>User Experience</strong>, and also interested in mobile development with{' '}
                <strong>React Native</strong>.
              </p>
            </div>
          </div>
        </section>

        <PortfolioList
          description='Check out my featured portfolio, feel free to explore it.'
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
