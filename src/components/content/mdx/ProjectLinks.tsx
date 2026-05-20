import { Button } from '@/components/ui/button'

import { BookOpen, Code2, Globe, Package, Play, Store } from 'lucide-react'
import { SiGithub, SiNpm } from 'react-icons/si'

type ProjectLinksProps = {
  github?: string
  marketplace?: string
  live?: string
  demo?: string
  npm?: string
  vscode?: string
  openvsx?: string
  documentation?: string
}

type LinkDef = {
  key: keyof ProjectLinksProps
  label: string
  Icon: React.ComponentType<{ className?: string; 'data-icon'?: string }>
}

// Order is deliberate: source-of-truth first, then distribution registries,
// then runtime/demo surfaces, then docs. Keeps the most-clicked links left-most.
const LINK_DEFS: LinkDef[] = [
  { key: 'github', label: 'GitHub', Icon: SiGithub },
  { key: 'marketplace', label: 'Marketplace', Icon: Store },
  { key: 'vscode', label: 'VS Code', Icon: Code2 },
  { key: 'openvsx', label: 'Open VSX', Icon: Package },
  { key: 'npm', label: 'npm', Icon: SiNpm },
  { key: 'demo', label: 'Demo', Icon: Play },
  { key: 'live', label: 'Live Site', Icon: Globe },
  { key: 'documentation', label: 'Docs', Icon: BookOpen }
]

export const ProjectLinks: React.FC<ProjectLinksProps> = (props) => {
  const links = LINK_DEFS.filter(({ key }) => Boolean(props[key]))
  if (links.length === 0) return null

  return (
    <nav aria-label='Project links' className='not-prose my-6 flex flex-wrap items-center gap-2'>
      {links.map(({ key, label, Icon }) => (
        <Button key={key} asChild variant='outline' size='sm'>
          <a href={props[key]!} target='_blank' rel='noopener noreferrer'>
            <Icon data-icon='inline-start' />
            {label}
          </a>
        </Button>
      ))}
    </nav>
  )
}
