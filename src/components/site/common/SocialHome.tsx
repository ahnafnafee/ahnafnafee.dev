import { UnstyledLink } from '@/components/site/links'

import { twclsx } from '@/libs'
import SOCIAL from '@/libs/constants/social'

import type { IconType } from 'react-icons/lib'
import {
  SiArtstation,
  SiBehance,
  SiGithub,
  SiGooglescholar,
  SiItchdotio,
  SiLinkedin,
  SiMaildotru,
  SiOrcid,
  SiTelegram
} from 'react-icons/si'

type SocialWithIcon = (typeof SOCIAL)[0] & { icon: IconType }

const icon = {
  email: SiMaildotru,
  linkedin: SiLinkedin,
  github: SiGithub,
  'google scholar': SiGooglescholar,
  orcid: SiOrcid,
  telegram: SiTelegram,
  'itch.io': SiItchdotio,
  artstation: SiArtstation,
  behance: SiBehance
} as Record<string, IconType>

const socialList: SocialWithIcon[] = SOCIAL.map((social) => ({
  ...social,
  icon: icon[social.title.toLowerCase()] ?? SiMaildotru
}))

type SocialHomeProps = {
  className?: string
  iconStyle?: string
  textOnly?: boolean
  linkClassName?: string
}

export const SocialHome: React.FunctionComponent<SocialHomeProps> = (props) => {
  return (
    <div className={twclsx('flex items-center', props.className)}>
      <span className='sr-only text-sm'>connect with me:</span>
      {socialList.map((social) => {
        return (
          <UnstyledLink
            className={twclsx('inline-flex h-7 w-7 items-center justify-center', props.linkClassName)}
            href={social.href}
            key={social.href}
            title={`Connect with me on ${social.title}`}
          >
            {props.textOnly ? (
              social.title
            ) : (
              <>
                <social.icon className={twclsx('h-5 w-5', props.iconStyle)} />
                <span className='sr-only'>Connect with Ahnaf An Nafee on {social.title}</span>
              </>
            )}
          </UnstyledLink>
        )
      })}
    </div>
  )
}
