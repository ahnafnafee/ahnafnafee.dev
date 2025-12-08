import { BlogItem } from './BlogItem'

import type { Blog } from 'me'

type BlogListProps = {
  posts: Blog[]
  displayViews?: boolean
}

export const BlogList: React.FunctionComponent<BlogListProps> = ({ displayViews, ...props }) => {
  return (
    <section className='py-8'>
      {props.posts.length > 0 && (
        <div className='flex flex-col'>
          {props.posts.map((post) => {
            return <BlogItem key={post.slug} {...post} displayViews={displayViews} />
          })}
        </div>
      )}
    </section>
  )
}

