// PULL Request Button in case there is a typo on some post, other people can help you
import { UnstyledLink } from '@/components/site/links'

import { HiExternalLink } from 'react-icons/hi'

type PRButtonProps = {
  path: string
}

/**
 * PULL Request Button in case there is a typo on some post, other people can help you.
 * The param path are the path directory to the file of slug.
 * `e.g:`
 * ```tsx
 * <EditButton path="/blog/slug.mdx" />
 * ```
 * @returns
 */
export const PRButton: React.FunctionComponent<PRButtonProps> = (props) => {
  return (
    <UnstyledLink
      title='Edit on GitHub'
      className='border-theme-500 text-theme-800 dark:text-theme-200 inline-flex max-w-max items-center space-x-1.5 border-b-2 border-dashed py-1 text-sm md:text-base'
      href={`https://github.com/ahnafnafee/ahnafnafee.dev/edit/main/src/data` + props.path}
    >
      <HiExternalLink className='h-5 w-5' />
      <span>Edit on GitHub</span>
    </UnstyledLink>
  )
}
