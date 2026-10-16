'use client'

import ErrorPage from './error'

// Only shown when the root layout itself fails, so it replaces the layout and has no header or footer.
export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <ErrorPage {...props} />
      </body>
    </html>
  )
}
