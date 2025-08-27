import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    name: 'Ahnaf An Nafee',
    status: 'Alive'
  }

  return NextResponse.json(data)
}
