'use client'

import { useTheme } from '@/hooks'

import Giscus from '@giscus/react'
import { memo } from 'react'

export const GiscusComment = memo(() => {
  const { theme, systemTheme } = useTheme()

  const gcTheme = theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? 'dark' : 'light'

  return (
    <div className='mt-4 md:mt-8'>
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
    </div>
  )
})

GiscusComment.displayName = 'GiscusComment'
