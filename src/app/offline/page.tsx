import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'You Are Offline',
  description: `It looks like you are offline, please connect to your internet connection and try refreshing this page.`
}

export default function OfflinePage() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 min-h-screen -mt-36'>
      <section className='text-center'>
        <h1 className='text-center'>503 - Offline</h1>
        <p className='my-2 md:my-4 max-w-prose'>
          It looks like you are offline, please connect to your internet connection and try refreshing this page.
        </p>
      </section>
    </div>
  )
}
