'use client'

import { InteractivePanel } from '@/components/content/interactive'

import { BlockMapView } from './regional-quantization/BlockMapView'
import { LatencyView } from './regional-quantization/LatencyView'
import { ReplayView } from './regional-quantization/ReplayView'
import { RiderView } from './regional-quantization/RiderView'

export const RegionalQuantizationStudy: React.FunctionComponent = () => (
  <InteractivePanel
    ariaLabel='Regional quantization map, replay fidelity, rider results and latency'
    eyebrow='Explore the study'
    title='From game regions to encoder blocks to riders'
    description='Walk through the measured block map, the matched replay, each rider’s two rides, and the delay check. Every value comes from the paper; the controls only change what you look at.'
    preserveInactiveViews
    views={[
      { id: 'map', label: 'Block map', content: <BlockMapView /> },
      { id: 'replay', label: 'Replay', content: <ReplayView /> },
      { id: 'riders', label: 'Riders', content: <RiderView /> },
      { id: 'latency', label: 'Delay', content: <LatencyView /> }
    ]}
  />
)
