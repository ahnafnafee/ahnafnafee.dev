import { UnstyledLink } from '@/UI/links'

import { twclsx } from '@/libs'
import SOCIAL from '@/libs/constants/social'

type SocialWithoutIcon = (typeof SOCIAL)[0]

const socialList: SocialWithoutIcon[] = SOCIAL.map((social) => ({
  ...social
}))

type FooterSocialHomeProps = {
  className?: string
  iconStyle?: string
  linkClassName?: string
}

export const FooterSocialHome: React.FunctionComponent<FooterSocialHomeProps> = (props) => {
  return (
    <div className={twclsx('flex flex-col space-y-4', props.className)}>
      <p className={'text-sm font-bold'}>SOCIALS</p>
      <span className='sr-only text-sm'>connect with me:</span>
      {socialList.map((social) => {
        return (
          <UnstyledLink
            className={twclsx(
              'hover:border-b-theme-500 max-w-max border-b border-dashed border-transparent text-sm font-medium text-gray-400 hover:text-gray-600',
              props.linkClassName
            )}
            href={social.href}
            key={social.href}
            title={`Connect with me on ${social.title}`}
          >
            {social.title}
          </UnstyledLink>
        )
      })}
    </div>
  )
}
