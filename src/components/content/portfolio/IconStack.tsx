import { twclsx } from '@/libs/twclsx'

import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiAndroidstudio,
  SiAutodesk,
  SiChakraui,
  SiCodesandbox,
  SiCsharp,
  SiCss3,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGnubash,
  SiGo,
  SiJava,
  SiJavascript,
  SiJira,
  SiKotlin,
  SiMarkdown,
  SiNextdotjs,
  SiNodedotjs,
  SiPerforce,
  SiPostgresql,
  SiReact,
  SiRedux,
  SiSass,
  SiSupabase,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiUnity,
  SiVisualstudiocode,
  SiVite
} from 'react-icons/si'

type IconStackProps = {
  type: string
  className?: string
}

export const IconStack: React.FunctionComponent<IconStackProps> = ({ type, className }) => {
  const check = type.toLowerCase()
  switch (check) {
    case 'react':
    case 'react.js':
    case 'reactjs':
      return <SiReact className={twclsx('text-sky-500', className)} />

    case 'next.js':
    case 'nextjs':
      return <SiNextdotjs className={twclsx('text-theme-800 dark:text-theme-200', className)} />
    case 'nodejs':
    case 'node.js':
      return <SiNodedotjs className={twclsx('text-emerald-500', className)} />

    case 'vite':
      return <SiVite className={twclsx('text-yellow-500', className)} />

    case 'redux':
      return <SiRedux className={twclsx('text-violet-500', className)} />

    case 'firebase':
      return <SiFirebase className={twclsx('text-amber-500', className)} />

    case 'tailwindcss':
    case 'tailwind css':
      return <SiTailwindcss className={twclsx('text-teal-500', className)} />

    case 'sass':
    case 'scss':
      return <SiSass className={twclsx('text-pink-500 dark:text-pink-400', className)} />

    case 'css':
    case 'CSS':
      return <SiCss3 className={twclsx('text-blue-600 dark:text-blue-500', className)} />

    case 'framer motion':
      return <SiFramer className={twclsx('text-theme-800 dark:text-theme-200', className)} />

    case 'javascript':
      return <SiJavascript className={twclsx('text-yellow-500', className)} />

    case 'typescript':
      return <SiTypescript className={twclsx('text-blue-600', className)} />

    case 'markdown':
      return <SiMarkdown className={twclsx('text-theme-800 dark:text-theme-200', className)} />

    case 'supabase':
      return <SiSupabase className={twclsx('text-emerald-600 dark:text-emerald-500', className)} />

    case 'go':
      return <SiGo className={twclsx('text-emerald-600 dark:text-emerald-500', className)} />

    case 'Unity':
    case 'unity':
      return <SiUnity className={twclsx('text-black-600 dark:text-white-500', className)} />

    case 'csharp':
      return <SiCsharp className={twclsx('text-emerald-600 dark:text-emerald-500', className)} />

    case 'figma':
      return <SiFigma className={twclsx('text-pink-600', className)} />

    case 'photoshop':
      return <SiAdobephotoshop className={twclsx('text-blue-600', className)} />

    case 'illustrator':
      return <SiAdobeillustrator className={twclsx('text-orange-600', className)} />

    case 'adobe-xd':
      return <SiAdobexd className={twclsx('text-pink-200', className)} />

    case 'maya':
      return <SiAutodesk className={twclsx('text-teal-600', className)} />

    case 'perforce':
      return <SiPerforce className={twclsx('text-pink-50', className)} />

    case 'vscode':
      return <SiVisualstudiocode className={twclsx('text-blue-500', className)} />

    case 'bash':
      return <SiGnubash className={twclsx('text-orange-500', className)} />

    case 'chakraui':
      return <SiChakraui className={twclsx('text-teal-100', className)} />

    case 'postgresql':
      return <SiPostgresql className={twclsx('text-indigo-500', className)} />

    case 'java':
      return <SiJava className={twclsx('text-orange-500', className)} />

    case 'android-studio':
      return <SiAndroidstudio className={twclsx('text-green-400', className)} />

    case 'kotlin':
      return <SiKotlin className={twclsx('text-purple-900', className)} />

    case 'trello':
      return <SiTrello className={twclsx('text-blue-500', className)} />

    case 'jira':
      return <SiJira className={twclsx('text-blue-500', className)} />

    default:
      return <SiCodesandbox className={twclsx('text-slate-900 dark:text-slate-800', className)} />
  }
}
