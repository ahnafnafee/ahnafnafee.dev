import { Button } from '@/components/ui/button'

import { BookOpen, Download, Package } from 'lucide-react'
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
  documentation?: string
  releases?: string
  container?: string
  heading?: string
  subtext?: string
  children?: React.ReactNode
}

export const AppDownloadCTA: React.FC<AppDownloadCTAProps> = ({
  appStore,
  playStore,
  marketplace,
  openVsx,
  github,
  web,
  documentation,
  releases,
  container,
  heading = 'Download the app',
  subtext,
  children
}) => {
  if (
    !appStore &&
    !playStore &&
    !marketplace &&
    !openVsx &&
    !github &&
    !web &&
    !documentation &&
    !releases &&
    !container
  )
    return null

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

        {releases ? (
          <Button asChild size='sm' variant='outline'>
            <a href={releases} target='_blank' rel='noopener noreferrer'>
              <Download data-icon='inline-start' />
              Releases / APK
            </a>
          </Button>
        ) : null}

        {container ? (
          <Button asChild size='sm' variant='outline'>
            <a href={container} target='_blank' rel='noopener noreferrer'>
              <Package data-icon='inline-start' />
              Container image
            </a>
          </Button>
        ) : null}

        {documentation ? (
          <Button asChild size='sm' variant='outline'>
            <a href={documentation} target='_blank' rel='noopener noreferrer'>
              <BookOpen data-icon='inline-start' />
              Setup guide
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
      {children ? (
        <div className='text-foreground min-w-0 space-y-4 [&_li]:text-sm [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:text-sm [&_p]:leading-relaxed'>
          {children}
        </div>
      ) : null}
    </aside>
  )
}
