'use client'

import { InteractivePanel } from '@/components/content/interactive'

import { EvidenceView } from './recommendation-decision-lab/EvidenceView'
import { RouteSimulator } from './recommendation-decision-lab/RouteSimulator'

export const RecommendationDecisionLab: React.FunctionComponent = () => (
  <InteractivePanel
    ariaLabel='Interactive recommendation evidence and routing demonstration'
    eyebrow='Explore the decision'
    title='Evidence first, then routing'
    description='Inspect the held-out scores or trace a request through a synthetic fallback scenario. The two views are separate: demo controls do not change the measured results.'
    preserveInactiveViews
    views={[
      { id: 'evidence', label: 'Measured evidence', content: <EvidenceView /> },
      { id: 'routing', label: 'Route simulator', content: <RouteSimulator /> }
    ]}
  />
)
