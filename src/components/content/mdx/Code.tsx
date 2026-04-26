import { twclsx } from '@/libs/twclsx'

export const Code = (props: { children: React.ReactNode; className?: string }) => {
  // If it's inside a pre tag (code block), render without special styling
  if (props.className?.includes('language-')) {
    return <code className={props.className}>{props.children}</code>
  }

  return (
    <code
      className={twclsx(
        'rounded px-1.5 py-0.5 font-mono text-sm',
        'bg-gray-100 dark:bg-gray-800',
        'text-pink-600 dark:text-pink-400'
      )}
    >
      {props.children}
    </code>
  )
}
