import { toLowerCase } from '@/libs/string'
import { twclsx } from '@/libs/twclsx'

type LabelProps = {
  type: string
  className?: string
  onClick?: () => void | (() => Promise<void>)
}

export const LabelBlog: React.FunctionComponent<LabelProps> = (props) => {
  const baseClass = 'inline-flex items-center justify-center py-1 px-1.5 rounded text-xs md:text-sm font-medium'
  const type = toLowerCase(props.type)

  switch (type) {
    case 'devlife':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'react':
      return (
        <span
          className={twclsx(baseClass, 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100', props.className)}
        >
          {props.type}
        </span>
      )

    case 'nextjs':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'git':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'frontend':
    case 'css':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-cyan-100 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-100',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'webdev':
    case 'web dev':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-800 dark:text-fuchsia-100',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'web analytics':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'hooks':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'state management':
      return (
        <span
          className={twclsx(baseClass, 'bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-50', props.className)}
        >
          {props.type}
        </span>
      )
    case 'baas':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-purple-100 text-purple-700 dark:bg-purple-500 dark:text-purple-50',
            props.className
          )}
        >
          {props.type}
        </span>
      )
    case 'supabase':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500 dark:text-black',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'ux':
    case 'user experience':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    case 'accessibility':
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-violet-200',
            props.className
          )}
        >
          {props.type}
        </span>
      )

    default:
      return (
        <span
          className={twclsx(
            baseClass,
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
            props.className
          )}
        >
          {props.type}
        </span>
      )
  }
}
