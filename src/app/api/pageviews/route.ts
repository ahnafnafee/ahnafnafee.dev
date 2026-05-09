import { getView, incrementView } from '@/services/pageviews'

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
  const view = await incrementView(slug)
  return NextResponse.json({ message: 'Incremented', view })
}
