import { twclsx } from '@/libs'

import { Category } from 'me'

export const CategoryLabel: React.FunctionComponent<Category> = ({ label, className }) => {
  return (
    <div className={twclsx('flex gap-3', className)}>
      <span
        className={twclsx(
          'my-1 inline-block cursor-pointer text-xs font-medium tracking-wider uppercase',
          label === 'game' ? 'text-orange-600 dark:text-orange-300' : 'text-pink-600 dark:text-pink-300'
        )}
      >
        {label ?? 'software'}
      </span>
    </div>
  )
}
