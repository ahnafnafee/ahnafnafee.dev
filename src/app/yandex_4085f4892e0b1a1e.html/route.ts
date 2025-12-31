import { NextResponse } from 'next/server'

/**
 * Route handler to serve Yandex verification file
 * This bypasses Next.js cleanUrls which strips .html extensions
 */
export async function GET() {
  const html = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: 4085f4892e0b1a1e</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}
