import { cn } from '@/lib/utils'

type ComingSoonImageProps = {
  className?: string
}

/**
 * Pastel-gradient placeholder used in place of a real thumbnail/OG image when a
 * research entry is pre-publication (`comingSoon: true` in the MDX frontmatter).
 * Sized to fill its parent — drop into the same `relative aspect-[5/4]` slot the
 * NextImage normally occupies.
 */
export const ComingSoonImage: React.FunctionComponent<ComingSoonImageProps> = ({ className }) => {
  return (
    <div
      role='img'
      aria-label='Coming soon'
      className={cn(
        'flex h-full w-full items-center justify-center',
        'bg-gradient-to-br from-amber-50 via-rose-50 to-blue-100',
        'dark:from-amber-950/40 dark:via-rose-950/30 dark:to-blue-900/40',
        className
      )}
    >
      <span className='font-serif text-2xl leading-none font-medium tracking-tight text-gray-900 md:text-3xl dark:text-gray-100'>
        Coming <span className='italic'>soon!</span>
      </span>
    </div>
  )
}
