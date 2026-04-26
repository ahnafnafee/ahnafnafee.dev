'use client'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

type LightboxLazyProps = {
  mainSrc: string
  imageTitle?: string
  onCloseRequest: () => void
}

export const LightboxLazy = ({ mainSrc, imageTitle, onCloseRequest }: LightboxLazyProps) => (
  <Lightbox
    mainSrc={mainSrc}
    imageTitle={imageTitle}
    onCloseRequest={onCloseRequest}
    reactModalStyle={{
      maxWidth: '500px'
    }}
  />
)
