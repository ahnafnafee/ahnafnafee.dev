import { ResearchItem } from './ResearchItem'

import type { Research } from 'me'

type ResearchListProps = {
  posts: Research[]
}

export const ResearchList: React.FunctionComponent<ResearchListProps> = (props) => {
  return (
    <section className='py-8'>
      {props.posts.length > 0 && (
        <div className='flex flex-col'>
          {props.posts.map((post, index) => (
            <ResearchItem key={post.slug} {...post} priority={index === 0} />
          ))}
        </div>
      )}
    </section>
  )
}
