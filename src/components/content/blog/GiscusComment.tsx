'use client'

import { useTheme } from '@/hooks'

import Giscus from '@giscus/react'
import { memo, useEffect, useRef, useState } from 'react'

// Giscus mounts a heavyweight iframe + bootstrap JS that hurts INP if it hydrates
// at first paint. Defer mounting until the comments section enters the viewport
// (with a 200px buffer) so initial scroll/click interactions stay responsive.
export const GiscusComment = memo(() => {
  const { theme, systemTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(false)

  useEffect(() => {
    if (shouldMount || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldMount])

  const gcTheme = theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? 'dark' : 'light'

  return (
    <div ref={containerRef} className='mt-4 min-h-[180px] md:mt-8'>
      {shouldMount && (
        <Giscus
          lang='en'
          theme={gcTheme}
          emitMetadata='0'
          inputPosition='bottom'
          repo='ahnafnafee/ahnafnafee.dev'
          repoId='R_kgDOInMbvA'
          category='General'
          categoryId='DIC_kwDOInMbvM4CTIGg'
          mapping='pathname'
          reactionsEnabled='1'
          loading='lazy'
        />
      )}
    </div>
  )
})

GiscusComment.displayName = 'GiscusComment'
