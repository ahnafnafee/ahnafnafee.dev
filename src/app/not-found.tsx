import { WrappedImage } from '@/UI/images'
import { UnderlineLink } from '@/UI/links'
import { Footer } from '@/UI/common'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for are not found, please contact Ahnaf if you encounter any problem'
}

/**
 * Used to display UI of 404, if the
 * Visitor of the web visit unavailable page
 */
export default function NotFound() {
  return (
    <>
      <main className='layout'>
        <div className='flex flex-col items-center justify-center gap-4 min-h-screen'>
          <WrappedImage priority src='/static/404.svg' alt='illustration' quality={60} width={225} height={225} />

          <section className='text-center'>
            <h1 className='text-center'>404 - Not Found</h1>
            <p className='my-2 md:my-4'>The page you are looking for are not found</p>

            <UnderlineLink href='/'>Back to home</UnderlineLink>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
