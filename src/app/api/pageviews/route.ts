import {
  getView,
  incrementView,
  InvalidPageviewSlugError,
  PAGEVIEW_WINDOW_SECONDS,
  PageviewRateLimitError
} from '@/services/pageviews'

import { NextRequest, NextResponse } from 'next/server'

// Single-slug endpoint, used by detail pages.
//
//   GET  /api/pageviews?slug=...   → { message, view }   read-only count
//   POST /api/pageviews?slug=...   → { message, view }   atomic +1, returns new count
//
// Both gracefully return view: 0 when DATABASE_URL is unset (see
// src/services/db/neon.ts) so the UI keeps rendering on contributor forks
// without DB access.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ message: 'slug query parameter is required', view: null }, { status: 400 })
  }
  const view = await getView(slug)
  return NextResponse.json({ message: 'Retrieved successfully', view })
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ message: 'slug query parameter is required', view: null }, { status: 400 })
  }
  try {
    const view = await incrementView(slug)
    return NextResponse.json({ message: 'Incremented', view }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    if (err instanceof InvalidPageviewSlugError) {
      return NextResponse.json({ message: 'Unknown content slug', view: null }, { status: 404 })
    }
    if (err instanceof PageviewRateLimitError) {
      return NextResponse.json(
        { message: 'Too many pageview updates', view: null },
        { status: 429, headers: { 'Retry-After': String(PAGEVIEW_WINDOW_SECONDS), 'Cache-Control': 'no-store' } }
      )
    }
    return NextResponse.json(
      { message: 'Pageview storage unavailable', view: null },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
