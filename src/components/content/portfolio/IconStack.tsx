import { twclsx } from '@/libs/twclsx'

import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiAmazon,
  SiAndroid,
  SiAndroidstudio,
  SiAutodesk,
  SiChakraui,
  SiCodesandbox,
  SiSharp,
  SiCss3,
  SiDiscord,
  SiExpo,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiHtml5,
  SiIos,
  SiJavascript,
  SiJira,
  SiJquery,
  SiKotlin,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPerforce,
  SiPostgresql,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiReact,
  SiRedux,
  SiSass,
  SiServerless,
  SiSpringboot,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiUnity,
  SiVite,
  SiXcode
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { TbBrandReactNative, TbWebhook } from 'react-icons/tb'
import { VscVscode } from 'react-icons/vsc'

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

    case 'html':
    case 'html5':
    case 'HTML5':
    case 'HTML':
      return <SiHtml5 className={twclsx('text-orange-500', className)} />

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
      return <SiUnity className={twclsx('text-gray-800 dark:text-white', className)} />

    case 'csharp':
    case 'c#':
      return <SiSharp className={twclsx('text-purple-600 dark:text-purple-500', className)} />

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
    case 'visual studio code':
      return <VscVscode className={twclsx('text-blue-500', className)} />

    case 'bash':
      return <SiGnubash className={twclsx('text-orange-500', className)} />

    case 'chakraui':
      return <SiChakraui className={twclsx('text-teal-100', className)} />

    case 'postgresql':
      return <SiPostgresql className={twclsx('text-indigo-500', className)} />

    case 'java':
      return <FaJava className={twclsx('text-orange-600', className)} />

    case 'android':
      return <SiAndroid className={twclsx('text-green-400', className)} />

    case 'android-studio':
      return <SiAndroidstudio className={twclsx('text-green-400', className)} />

    case 'ios':
      return <SiIos className={twclsx('text-gray-400', className)} />

    case 'xcode':
      return <SiXcode className={twclsx('text-blue-600', className)} />

    case 'kotlin':
      return <SiKotlin className={twclsx('text-purple-900', className)} />

    case 'trello':
      return <SiTrello className={twclsx('text-blue-500', className)} />

    case 'jira':
      return <SiJira className={twclsx('text-blue-500', className)} />

    case 'cloud':
      return <SiGooglecloud className={twclsx('text-blue-500', className)} />

    case 'aws':
      return <SiAmazon className={twclsx('text-yellow-400', className)} />

    case 'github-action':
    case 'github-actions':
      return <SiGithubactions className={twclsx('text-gray-800 dark:text-white', className)} />

    case 'serverless':
      return <SiServerless className={twclsx('text-orange-500', className)} />

    case 'discord':
      return <SiDiscord className={twclsx('text-indigo-600', className)} />

    case 'expo':
      return <SiExpo className={twclsx('text-blue-600', className)} />

    case 'webhook':
      return <TbWebhook className={twclsx('text-purple-600', className)} />

    case 'MySQL':
    case 'mysql':
      return <SiMysql className={twclsx('text-orange-300', className)} />

    case 'jQuery':
    case 'jquery':
      return <SiJquery className={twclsx('text-orange-700', className)} />

    case 'react-native':
      return <TbBrandReactNative className={twclsx('text-blue-500', className)} />

    case 'swift':
      return <SiSwift className={twclsx('text-orange-400', className)} />

    case 'SpringBoot':
    case 'spring-boot':
    case 'spring boot':
      return <SiSpringboot className={twclsx('text-green-400', className)} />

    case 'python':
    case 'py':
      return <SiPython className={twclsx('text-yellow-500', className)} />

    case 'docker':
      return <SiDocker className={twclsx('text-blue-500', className)} />

    case 'kubernetes':
    case 'k8s':
      return <SiKubernetes className={twclsx('text-blue-600', className)} />

    default:
      return <SiCodesandbox className={twclsx('text-slate-500 dark:text-slate-400', className)} />
  }
}
