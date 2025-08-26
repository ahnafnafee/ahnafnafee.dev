import '../styles/globals.css'
import 'prism-themes/themes/prism-dracula.css'
import 'react-image-lightbox/style.css'

import { Header } from '@/components/UI/common/Header'
import { SkipToContent } from '@/UI/buttons'
import { twclsx } from '@/libs'
import variants, { withExit } from '@/libs/animation/variants'
import { useTheme } from '@/hooks'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

// Remove deprecated reportWebVitals export

const v: Variants = withExit(variants)

const onExitComplete = () => window.scrollTo(0, 0)

const App = ({ Component, pageProps, router }: AppProps) => {
  const { theme, mounted, systemTheme } = useTheme()

  return (
    <ThemeProvider attribute='class' storageKey='theme' enableSystem>
      <SkipToContent />
      <LazyMotion features={domAnimation}>
        <Header />
        <AnimatePresence initial={false} onExitComplete={onExitComplete} mode='wait'>
          <m.div
            id={'skip-content'}
            key={router.route.concat(router.pathname)}
            variants={v}
            initial='hidden'
            animate='visible'
            exit='exit'
            className={twclsx(router.pathname === '/resume' && 'max-w-3xl w-11/12 mx-auto')}
          >
            <Component {...pageProps} />
          </m.div>
        </AnimatePresence>
      </LazyMotion>

      {mounted && (
        <Toaster
          toastOptions={{
            className: twclsx('rounded-md'),
            style: {
              zIndex: 4,
              backgroundColor:
                theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? '#27272a' : '#ffffff',
              color: theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? '#ffffff' : '#18181b'
            }
          }}
        />
      )}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}

export default App
