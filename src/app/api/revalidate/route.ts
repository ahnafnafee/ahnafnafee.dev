import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET || process.env.SECRET_KEY

  if (!SECRET_KEY || secret !== SECRET_KEY) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  if (!slug) {
    return NextResponse.json({ message: 'Please provide slug to revalidate' }, { status: 400 })
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    revalidatePath(slug)
    return NextResponse.json({ revalidated: true })
  } catch {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
