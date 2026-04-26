import { twclsx } from '@/libs'

import NextImage, { type ImageProps } from 'next/image'

type WrappedImageProps = ImageProps & {
  alt: string
  parentStyle?: string
}

export const WrappedImage: React.FunctionComponent<WrappedImageProps> = ({ parentStyle, ...props }) => {
  if (!props.fill) {
    return <NextImage {...props} />
  }

  return (
    <figure className={twclsx('relative', parentStyle)}>
      <NextImage {...props} placeholder='blur' blurDataURL='/blur.svg' sizes='(max-width: 768px) 100%' />
    </figure>
  )
}
