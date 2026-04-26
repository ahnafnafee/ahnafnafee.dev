import { Footer } from '@/components/site/common'

import { twclsx } from '@/libs/twclsx'

export type AppLayoutPageProps = {
  className?: string
  children: React.ReactNode
}

export const AppLayoutPage: React.FC<AppLayoutPageProps> = ({ children, className }) => {
  return (
    <>
      <main className={twclsx('layout', className)}>{children}</main>
      <Footer />
    </>
  )
}
