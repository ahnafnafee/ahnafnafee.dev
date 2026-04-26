import { WrappedImage } from '@/components/site/images'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/empty'

export const EmptyResult: React.FunctionComponent = () => {
  return (
    <Empty className='py-8 md:py-16'>
      <EmptyHeader>
        <EmptyMedia>
          <WrappedImage
            width={256}
            height={256}
            loading='lazy'
            alt='Not found'
            placeholder='blur'
            blurDataURL='/blur.svg'
            src='/static/not-found.svg'
            title='An image represent no content to show'
          />
        </EmptyMedia>
        <EmptyDescription className='text-sm md:text-base'>
          Couldn&apos;t find what you&apos;re looking for, come back later for further content!
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
