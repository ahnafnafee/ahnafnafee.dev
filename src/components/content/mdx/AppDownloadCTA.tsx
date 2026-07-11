import { Button } from '@/components/ui/button'

import { HiGlobeAlt } from 'react-icons/hi'
import { SiApple, SiGoogleplay } from 'react-icons/si'

type AppDownloadCTAProps = {
  appStore?: string
  playStore?: string
  web?: string
  heading?: string
  subtext?: string
}

export const AppDownloadCTA: React.FC<AppDownloadCTAProps> = ({
  appStore,
  playStore,
  web,
  heading = 'Download the app',
  subtext
}) => {
  if (!appStore && !playStore && !web) return null

  return (
    <aside className='not-prose border-border bg-muted/40 my-8 flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-col'>
        <p className='text-foreground text-base font-bold'>{heading}</p>
        {subtext ? <p className='text-muted-foreground mt-0.5 text-sm'>{subtext}</p> : null}
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {appStore ? (
          <Button asChild size='sm'>
            <a href={appStore} target='_blank' rel='noopener noreferrer'>
              <SiApple data-icon='inline-start' />
              App Store
            </a>
          </Button>
        ) : null}

        {playStore ? (
          <Button asChild size='sm'>
            <a href={playStore} target='_blank' rel='noopener noreferrer'>
              <SiGoogleplay data-icon='inline-start' />
              Google Play
            </a>
          </Button>
        ) : null}

        {web ? (
          <Button asChild size='sm' variant='outline'>
            <a href={web} target='_blank' rel='noopener noreferrer'>
              <HiGlobeAlt data-icon='inline-start' />
              Website
            </a>
          </Button>
        ) : null}
      </div>
    </aside>
  )
}
