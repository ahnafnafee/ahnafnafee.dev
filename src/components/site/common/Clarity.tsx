'use client'

import { isProd } from '@/libs/constants/environmentState'

import ClarityApi from '@microsoft/clarity'
import { useEffect } from 'react'

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

/** TCF v2 purposes Clarity relies on: 1 = store/access info on a device, 8 = measure content performance. */
const REQUIRED_PURPOSES = [1, 8]

/** Google's messaging script installs `__tcfapi` asynchronously, and only where a consent message applies. */
const TCF_POLL_MS = 100
const TCF_TIMEOUT_MS = 2000

type TcData = {
  gdprApplies?: boolean
  eventStatus?: string
  listenerId?: number
  purpose?: { consents?: Record<number, boolean> }
}

type TcfApi = (cmd: string, version: number, callback: (data: TcData, success: boolean) => void, param?: number) => void

/**
 * Microsoft Clarity — heatmaps and session replay.
 *
 * The tag is injected only once the visitor may be tracked. Where Google's CMP
 * shows no consent message there is nothing to wait for and Clarity starts
 * immediately; where it does, Clarity waits for the visitor to grant the TCF
 * purposes above. Nothing is requested from clarity.ms before that point.
 */
export function Clarity() {
  useEffect(() => {
    if (!PROJECT_ID || !isProd) return
    const projectId = PROJECT_ID

    let started = false
    const start = () => {
      if (started) return
      started = true
      ClarityApi.init(projectId)
      // Clarity is analytics-only here, so ad storage stays denied regardless.
      ClarityApi.consentV2({ ad_Storage: 'denied', analytics_Storage: 'granted' })
    }

    const tcfWindow = window as Window & { __tcfapi?: TcfApi }
    let listenerId: number | undefined
    let waited = 0

    const onTcData = (data: TcData, success: boolean) => {
      if (!success || started) return
      listenerId = data.listenerId ?? listenerId
      if (!data.gdprApplies) return start()
      // Banner is up and unanswered — a later event carries the decision.
      if (data.eventStatus === 'cmpuishown') return
      const consents = data.purpose?.consents ?? {}
      if (REQUIRED_PURPOSES.every((id) => consents[id])) start()
    }

    // No `__tcfapi` at all means no consent message for this visitor (or a
    // blocked CMP, which blocks clarity.ms alongside it).
    const timer = setInterval(() => {
      if (tcfWindow.__tcfapi) {
        clearInterval(timer)
        tcfWindow.__tcfapi('addEventListener', 2, onTcData)
        return
      }
      waited += TCF_POLL_MS
      if (waited >= TCF_TIMEOUT_MS) {
        clearInterval(timer)
        start()
      }
    }, TCF_POLL_MS)

    return () => {
      clearInterval(timer)
      if (listenerId !== undefined) tcfWindow.__tcfapi?.('removeEventListener', 2, () => {}, listenerId)
    }
  }, [])

  return null
}
