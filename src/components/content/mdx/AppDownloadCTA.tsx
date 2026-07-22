import { Button } from '@/components/ui/button'

import { HiGlobeAlt } from 'react-icons/hi'
import { SiApple, SiGithub, SiGoogleplay } from 'react-icons/si'
import { VscExtensions, VscVscode } from 'react-icons/vsc'

type AppDownloadCTAProps = {
  appStore?: string
  playStore?: string
  /** Visual Studio Marketplace listing (VSCode, Cursor, Windsurf, vscode.dev). */
  marketplace?: string
  /** Open VSX listing — the registry VSCodium, Gitpod, and OSS Codespaces install from. */
  openVsx?: string
  github?: string
  web?: string
  heading?: string
  subtext?: string
}

export const AppDownloadCTA: React.FC<AppDownloadCTAProps> = ({
  appStore,
  playStore,
  marketplace,
  openVsx,
  github,
  web,
  heading = 'Download the app',
  subtext
}) => {
  if (!appStore && !playStore && !marketplace && !openVsx && !github && !web) return null

  // Stacked rather than side-by-side: the article column is capped at max-w-2xl,
  // too narrow to hold a copy block and more than two buttons on one line
  // without the button group wrapping mid-group. `leading-*` is explicit
  // because the base layer sets `p { leading-7 }`, which `not-prose` leaves
  // alone.
  return (
    <aside className='not-prose border-border bg-muted/40 my-8 flex flex-col gap-4 rounded-xl border p-5'>
      <div className='flex flex-col'>
        <p className='text-foreground text-base leading-snug font-bold'>{heading}</p>
        {subtext ? <p className='text-muted-foreground mt-1 text-sm leading-snug'>{subtext}</p> : null}
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

        {marketplace ? (
          <Button asChild size='sm'>
            <a href={marketplace} target='_blank' rel='noopener noreferrer'>
              <VscVscode data-icon='inline-start' />
              VS Marketplace
            </a>
          </Button>
        ) : null}

        {openVsx ? (
          <Button asChild size='sm' variant='outline'>
            <a href={openVsx} target='_blank' rel='noopener noreferrer'>
              <VscExtensions data-icon='inline-start' />
              Open VSX
            </a>
          </Button>
        ) : null}

        {github ? (
          <Button asChild size='sm' variant='outline'>
            <a href={github} target='_blank' rel='noopener noreferrer'>
              <SiGithub data-icon='inline-start' />
              GitHub
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
