import { UnstyledLink } from '@/UI/links'

import { twclsx } from '@/libs'
import SOCIAL from '@/libs/constants/social'

import type { IconType } from 'react-icons/lib'
import { SiArtstation, SiBehance, SiGithub, SiItchdotio, SiLinkedin, SiMaildotru, SiTelegram } from 'react-icons/si'

type SocialWithIcon = typeof SOCIAL[0] & { icon: IconType }

const icon = {
  email: SiMaildotru,
  linkedin: SiLinkedin,
  github: SiGithub,
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
      <span className='text-sm sr-only'>connect with me:</span>
      {socialList.map((social) => {
        return (
          <UnstyledLink
            className={twclsx('inline-flex items-center justify-center w-7 h-7', props.linkClassName)}
            href={social.href}
            key={social.href}
            title={`Connect with me on ${social.title}`}
          >
            {props.textOnly ? (
              social.title
            ) : (
              <>
                <social.icon className={twclsx('w-5 h-5', props.iconStyle)} />
                <span className='sr-only'>Connect with Ahnaf An Nafee on {social.title}</span>
              </>
            )}
          </UnstyledLink>
        )
      })}
    </div>
  )
}
