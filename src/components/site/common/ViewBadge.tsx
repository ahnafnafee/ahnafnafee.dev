import { twclsx } from '@/libs/twclsx'

import { HiOutlineEye } from 'react-icons/hi'

const formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

type Props = {
  count?: number | null
  /** Render even when count is 0 (default false — keeps cards clean for fresh content). */
  showZero?: boolean
  className?: string
}

/** Compact 'eye + count' badge. Returns null when count is missing or zero (unless showZero). */
export const ViewBadge: React.FunctionComponent<Props> = ({ count, showZero = false, className }) => {
  if (count == null) return null
  if (count === 0 && !showZero) return null
  return (
    <span
      className={twclsx(
        'inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400',
        className
      )}
      title={`${count.toLocaleString('en-US')} views`}
    >
      <HiOutlineEye className='h-3.5 w-3.5' aria-hidden='true' />
      <span>{formatter.format(count)}</span>
      <span className='sr-only'>views</span>
    </span>
  )
}
