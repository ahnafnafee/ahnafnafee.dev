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
        <div tw='flex h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8'>
          {/* Terminal Window */}
          <div tw='flex flex-col w-full h-full bg-gray-900 rounded-lg border border-gray-700 shadow-2xl overflow-hidden'>
            {/* Terminal Header */}
            <div tw='flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700'>
              <div tw='flex items-center space-x-2'>
                <div tw='w-3 h-3 bg-red-500 rounded-full'></div>
                <div tw='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <div tw='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
              <div tw='text-gray-400 text-sm font-mono'>
                ahnafnafee@dev: ~/{title?.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <div tw='w-16'></div>
            </div>

            {/* Terminal Content */}
            <div tw='flex flex-col flex-1 p-6 font-mono text-white'>
              {/* Command Line */}
              <div tw='flex items-center mb-4'>
                <span tw='text-green-400 mr-2'>ahnafnafee@dev</span>
                <span tw='text-white mr-2'>:</span>
                <span tw='text-blue-400 mr-2'>~</span>
                <span tw='text-white mr-2'>$</span>
                <span tw='text-gray-300'>cat {title?.toLowerCase().replace(/\s+/g, '_')}.md</span>
              </div>

              {/* File Content */}
              <div tw='flex flex-col flex-1 justify-center'>
                <div tw='mb-6'>
                  <div tw='text-purple-400 text-lg mb-2'># {title}</div>
                  <div tw='text-gray-300 text-base leading-relaxed mb-4'>{subtitle}</div>
                </div>

                <div tw='flex items-center justify-between'>
                  <div tw='flex items-center'>
                    {/** biome-ignore lint/performance/noImgElement: <explanation> */}
                    <img
                      width='80'
                      height='80'
                      tw='rounded-full border-2 border-purple-400'
                      style={{ objectFit: 'cover' }}
                      src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-160,h-160'
                      alt='Ahnaf An Nafee'
                    />
                    <div tw='ml-4'>
                      <div tw='text-white text-2xl font-bold mb-1'>Ahnaf An Nafee</div>
                      <div tw='text-cyan-400 text-lg'>PhD Student • AI & 3D Graphics</div>
                      <div tw='text-gray-400 text-base'>George Mason University</div>
                    </div>
                  </div>

                  <div tw='flex flex-col items-end'>
                    <div tw='flex items-center space-x-3 mb-2'>
                      <div tw='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                        <span tw='text-xl'>🧠</span>
                      </div>
                      <div tw='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                        <span tw='text-xl'>🌐</span>
                      </div>
                      <div tw='w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center'>
                        <span tw='text-xl'>⚡</span>
                      </div>
                    </div>
                    <div tw='text-purple-400 text-sm'>www.ahnafnafee.dev</div>
                  </div>
                </div>
              </div>

              {/* Command Prompt */}
              <div tw='flex items-center mt-4'>
                <span tw='text-green-400 mr-2'>ahnafnafee@dev</span>
                <span tw='text-white mr-2'>:</span>
                <span tw='text-blue-400 mr-2'>~</span>
                <span tw='text-white mr-2'>$</span>
                <span tw='text-white bg-gray-700 px-1'>█</span>
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
