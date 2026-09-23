'use client'

import { InteractivePanel } from '@/components/content/interactive'

import { BasketWalkthrough } from './sequence-models/BasketWalkthrough'
import { EvidenceView } from './sequence-models/EvidenceView'
import { OrderView } from './sequence-models/OrderView'

export const SequenceModelStudy: React.FunctionComponent = () => (
  <InteractivePanel
    ariaLabel='Sequence-model evidence and synthetic basket walkthrough'
    eyebrow='Explore the comparison'
    title='Where the sequence helps, and where it does not'
    description='Compare fixed held-out measurements, inspect a single-seed order diagnostic, then trace an invented rating history through the input rule. Controls never change the measured results.'
    preserveInactiveViews
    views={[
      { id: 'evidence', label: 'Held-out evidence', content: <EvidenceView /> },
      { id: 'order', label: 'Order check', content: <OrderView /> },
      { id: 'history', label: 'Basket walkthrough', content: <BasketWalkthrough /> }
    ]}
  />
)
