'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
          <h2 className='text-2xl font-bold'>Something went wrong!</h2>
          <p className='text-gray-600 dark:text-gray-400'>{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => reset()}
            className='px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors'
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
