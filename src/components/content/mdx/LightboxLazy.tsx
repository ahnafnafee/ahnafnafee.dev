'use client'

import Lightbox from 'react-image-lightbox'
// Global CSS imported from a 'use client' module — Next.js App Router permits
// this, and the dynamic-import boundary in ContentImage.tsx keeps the stylesheet
// out of the initial blog-post bundle. Moving it to layout.tsx would force the
// CSS onto every page even when the lightbox is never opened.
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
