import { getViewsBatch } from '@/services/pageviews'

import { NextRequest, NextResponse } from 'next/server'

// Cache batch results for 5 minutes — list-page pageviews are stale-tolerant
// and we'd rather absorb traffic spikes than hammer Neon for every visitor.
export const revalidate = 300

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slugsParam = searchParams.get('slugs')

  if (!slugsParam) {
    return NextResponse.json({ message: 'slugs query parameter is required' }, { status: 400 })
  }

  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (slugs.length === 0) {
    return NextResponse.json({})
  }

  // Cap the batch to avoid an unbounded SQL `ANY($1)` if a caller passes
  // an enormous slug list (paranoia — listing pages currently send <30).
  const capped = slugs.slice(0, 100)
  const result = await getViewsBatch(capped)
  return NextResponse.json(result)
}
