import { UnstyledLink } from '@/UI/links'

import { twclsx } from '@/libs'
import SOCIAL from '@/libs/constants/social'

type SocialWithoutIcon = typeof SOCIAL[0]

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
      <p className={'font-bold text-sm'}>SOCIALS</p>
      <span className='text-sm sr-only'>connect with me:</span>
      {socialList.map((social) => {
        return (
          <UnstyledLink
            className={twclsx(
              'text-sm font-medium max-w-max border-b border-dashed border-transparent hover:border-b-theme-500 text-gray-400 hover:text-gray-600',
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
