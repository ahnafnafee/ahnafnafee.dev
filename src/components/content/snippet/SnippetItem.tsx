import { UnstyledLink } from '@/components/legacy-ui/links'

import { IconStack } from '../portfolio'

import { Snippet } from 'me'

export const SnippetItem: React.FunctionComponent<Snippet> = (props) => {
  const slugURL = '/snippet/' + props.slug

  return (
    <div className='flex w-full py-3'>
      <div className='w-full pr-4'>
        <h3>
          <UnstyledLink
            className='hover:border-theme-500 dark:hover:border-theme-300 border-b-2 border-dashed border-transparent'
            href={slugURL}
          >
            {props.title}
          </UnstyledLink>
        </h3>
        <p className='mb-3 max-w-prose'>{props.summary}</p>
      </div>

      <IconStack className='h-9 w-9 md:h-10 md:w-10' type={props.topic} />
    </div>
  )
}
