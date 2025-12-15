import { twclsx } from '@/libs/twclsx'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <div className={twclsx('overflow-x-auto rounded-lg my-8', '-mx-4 px-4 md:mx-0 md:px-0')}>
      <table className={twclsx('min-w-full', className)}>
        {children}
      </table>
    </div>
  )
}
