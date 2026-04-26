import { NextRequest, NextResponse } from 'next/server'

// Cache batch results for 5 minutes — list-page pageviews are stale-tolerant.
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

  // The upstream analytics integration is currently stubbed (see ./route.ts).
  // Returning zeros keeps the listing page rendering correctly until it's restored;
  // when it is, plug the batch fetch in here and avoid re-introducing the N+1.
  const result: Record<string, number> = {}
  for (const slug of slugs) {
    result[slug] = 0
  }

  return NextResponse.json(result)
}
