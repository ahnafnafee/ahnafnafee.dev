// Wireframe mesh backdrop for the OG card. Renders the precomputed icosphere
// edge list as inline SVG `<line>` elements. Server-only.

// server-only

import React from 'react'

import { MESH_EDGES, MESH_VIEWBOX } from './og-mesh-data'

import type { OgAccent } from './og-types'

type MeshBackdropProps = {
  accent: OgAccent
  width: number
  height: number
}

export function MeshBackdrop({ accent, width, height }: MeshBackdropProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${MESH_VIEWBOX.width} ${MESH_VIEWBOX.height}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {MESH_EDGES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={accent.mesh}
          strokeWidth={1.4}
          strokeOpacity={0.55}
          strokeLinecap='round'
        />
      ))}
    </svg>
  )
}
