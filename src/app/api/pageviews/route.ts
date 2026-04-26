import { NextRequest, NextResponse } from 'next/server'

// Stub endpoint — the upstream Umami integration is currently disabled.
// Returns view: 0 for any slug. The blog list uses /api/pageviews/batch
// instead; this single-slug variant is kept for backwards compatibility
// with the BlogPostClient component.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: 'query parameter is required', view: null }, { status: 400 })
  }

  return NextResponse.json({ message: 'Retrieved successfully', view: 0 })
}
