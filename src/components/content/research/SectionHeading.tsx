import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  children: React.ReactNode
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ children, className }) => (
  <h2
    className={cn(
      'mb-3 border-b border-gray-200 pb-2 text-lg font-bold text-black md:text-xl dark:border-gray-800 dark:text-white',
      className
    )}
  >
    {children}
  </h2>
)
