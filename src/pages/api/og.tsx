/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Ahnaf An Nafee'
    const subtitle = searchParams.get('subtitle') || 'PhD Student in AI & 3D Graphics @ GMU | Building Immersive Worlds'

    return new ImageResponse(
      (
        <div tw='flex h-[600px] py-8 px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'>
          <div tw='flex flex-col h-full w-full justify-between'>
            <div tw='flex items-center'>
              <div tw='w-2 h-16 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4'></div>
              <p tw='font-bold text-2xl text-blue-300'>www.ahnafnafee.dev</p>
            </div>

            <div tw='flex flex-col max-w-4xl'>
              <p tw='font-extrabold text-7xl mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>
                {title}
              </p>
              <p tw='text-2xl text-gray-300 font-medium'>{subtitle}</p>
            </div>

            <div tw='flex items-center justify-between w-full'>
              <div tw='flex items-center'>
                <img
                  width='64'
                  height='64'
                  tw='rounded-full border-4 border-blue-400'
                  style={{
                    objectFit: 'cover'
                  }}
                  src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-128,h-128'
                  alt='Ahnaf An Nafee'
                />
                <div tw='ml-4 flex flex-col'>
                  <p tw='font-bold text-3xl'>Ahnaf An Nafee</p>
                  <p tw='text-xl text-blue-300'>AI Researcher • 3D Graphics • Ex-CTO</p>
                </div>
              </div>

              <div tw='flex items-center space-x-4'>
                <div tw='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <span tw='text-2xl'>🧠</span>
                </div>
                <div tw='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center'>
                  <span tw='text-2xl'>🌐</span>
                </div>
                <div tw='w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center'>
                  <span tw='text-2xl'>☁️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600
      }
    )
  } catch (err) {
    console.info(JSON.stringify(err))
    return new Response('Failed to generate the og image', {
      status: 500,
      statusText: 'failed to generate the og image'
    })
  }
}
