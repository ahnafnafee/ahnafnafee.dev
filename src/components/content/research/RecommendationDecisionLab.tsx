'use client'

import { InteractivePanel } from '@/components/content/interactive'

import { EvidenceView } from './recommendation-decision-lab/EvidenceView'
import { NeuralEvidence } from './recommendation-decision-lab/NeuralEvidence'
import { RouteSimulator } from './recommendation-decision-lab/RouteSimulator'

export const RecommendationDecisionLab: React.FunctionComponent = () => (
  <InteractivePanel
    ariaLabel='Interactive recommendation evidence and routing demonstration'
    eyebrow='Explore the decision'
    title='Evidence first, then routing'
    description='Inspect the held-out scores, compare an exploratory neural challenger, or trace a request through a synthetic fallback scenario. Demo controls do not change measured results.'
    preserveInactiveViews
    views={[
      { id: 'evidence', label: 'Measured evidence', content: <EvidenceView /> },
      { id: 'neural', label: 'Neural challenger', content: <NeuralEvidence /> },
      { id: 'routing', label: 'Route simulator', content: <RouteSimulator /> }
    ]}
  />
)
