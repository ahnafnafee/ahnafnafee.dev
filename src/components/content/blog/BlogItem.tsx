import { UnstyledLink } from '@/UI/links'
import { numberToCompact } from '@/libs/intl'
import { LabelBlog } from './LabelBlog'
import type { Blog } from 'me'
import { HiOutlineClock } from 'react-icons/hi'
import { generateOgImage } from '@/libs/metapage'
import { WrappedImage } from '@/UI/images'

export const BlogItem: React.FunctionComponent<Blog> = (props) => {
  const urlPost = `/blog/${props.slug}`
  
  // Use the thumbnail from props, or fallback to generated OG image
  // (Assuming generateOgImage handles this correctly on client, or we reconstruct the URL pattern)
  const ogImageUrl = props.thumbnail || generateOgImage({ title: props.title, theme: 'dark' })

  return (
    <div className='w-full py-8 border-b border-gray-100 dark:border-gray-800 last:border-0 group'>
      <div className='flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-6 md:gap-8'>
        
        {/* Left Content */}
        <div className='flex flex-col flex-1 min-w-0'>
          {/* Metadata Top */}
          <div className='flex items-center gap-2 mb-2 text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400'>
             {new Date(props.published).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>

          <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 group-hover:text-purple-600 transition-colors'>
            <UnstyledLink href={urlPost}>
              {props.title}
            </UnstyledLink>
          </h3>

          <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3'>
            {props.summary}
          </p>

          <div className='flex flex-wrap items-center gap-3 mt-auto'>
             {/* Labels */}
            {props.topics.length > 0 && (
              <div className='flex flex-wrap items-center gap-2'>
                {props.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-sm whitespace-nowrap">
                    {topic}
                  </span>
                ))}
              </div>
            )}
            
            <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 font-medium'>
               <HiOutlineClock className='w-3.5 h-3.5' />
               <span>{props.est_read ?? '0 min'}</span>
            </div>
          </div>
        </div>

        {/* Right Thumbnail */}
        <div className='w-full md:w-48 aspect-[1.91/1] md:aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
           <img 
             src={ogImageUrl} 
             alt={props.title}
             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
             loading="lazy"
           />
        </div>

      </div>
    </div>
  )
}

