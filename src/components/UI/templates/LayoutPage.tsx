import { CustomSeo } from '@/components/CustomSeo'
import type { CustomSeoProps } from '@/components/CustomSeo'

import { Footer } from '@/UI/common'

import { twclsx } from '@/libs/twclsx'

export type LayoutPageProps = {
  className?: string
  children: React.ReactNode
} & CustomSeoProps

export const LayoutPage: React.FC<LayoutPageProps> = ({ children, className, ...props }) => {
  return (
    <>
      <CustomSeo {...props} />

      <main className={twclsx('layout', className)}>{children}</main>
      <Footer />
    </>
  )
}
