'use client'

import { SlideDeck } from '@/components/content/interactive'

import { FLOWGATE_SLIDES } from './slides'

export const FlowGateTalkDeck: React.FunctionComponent = () => (
  <SlideDeck
    ariaLabel='FlowGate lightning talk slides'
    eyebrow='The five-minute talk'
    title='FlowGate: Can a Cycling Game Learn How Absorbed You Feel?'
    description='Step through the six slides with the buttons, the thumbnails or your arrow keys. Turn on “What I said” to read the narration I delivered for each slide, with its time in the talk.'
    slides={FLOWGATE_SLIDES}
  />
)
