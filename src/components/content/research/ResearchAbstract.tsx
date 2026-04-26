import { twclsx } from '@/libs/twclsx'

type ResearchAbstractProps = {
  abstract: string
}

export const ResearchAbstract: React.FunctionComponent<ResearchAbstractProps> = ({ abstract }) => {
  return (
    <section
      aria-labelledby='abstract-heading'
      className={twclsx(
        'not-prose',
        'bg-gray-50 dark:bg-gray-900/40',
        'border-l-4 border-purple-500',
        'rounded-r-lg',
        'p-5 md:p-6',
        'my-2'
      )}
    >
      <h2
        id='abstract-heading'
        className={twclsx(
          'text-center text-lg font-extrabold tracking-wider uppercase md:text-xl',
          'text-purple-600 dark:text-purple-400',
          'mb-4'
        )}
      >
        Abstract
      </h2>
      <p className={twclsx('text-sm leading-relaxed md:text-base', 'text-gray-700 dark:text-gray-300')}>
        {abstract.trim()}
      </p>
    </section>
  )
}
