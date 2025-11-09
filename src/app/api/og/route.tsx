/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Ahnaf An Nafee'
    const subtitle = searchParams.get('subtitle') || 'PhD Student in AI & 3D Graphics @ GMU | DCXR Lab'
    const theme = searchParams.get('theme') || 'default'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
            padding: '40px'
          }}
        >
          {/* Terminal Window */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              backgroundColor: '#111827',
              borderRadius: '12px',
              border: '1px solid #374151',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Terminal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#1f2937',
                padding: '12px 16px',
                borderBottom: '1px solid #374151'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#eab308', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '14px', fontFamily: 'monospace' }}>
                ahnafnafee@dev: ~/{title?.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <div style={{ width: '64px' }}></div>
            </div>

            {/* Terminal Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '24px',
                fontFamily: 'monospace',
                color: 'white'
              }}
            >
              {/* Command Line */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#4ade80', marginRight: '8px' }}>ahnafnafee@dev</span>
                <span style={{ color: 'white', marginRight: '8px' }}>:</span>
                <span style={{ color: '#60a5fa', marginRight: '8px' }}>~</span>
                <span style={{ color: 'white', marginRight: '8px' }}>$</span>
                <span style={{ color: '#d1d5db' }}>cat {title?.toLowerCase().replace(/\s+/g, '_')}.md</span>
              </div>

              {/* File Content */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ color: '#c084fc', fontSize: '24px', marginBottom: '8px' }}># {title}</div>
                  <div style={{ color: '#d1d5db', fontSize: '18px', lineHeight: 1.6, marginBottom: '16px' }}>
                    {subtitle}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      width='80'
                      height='80'
                      style={{ borderRadius: '50%', border: '2px solid #c084fc', objectFit: 'cover' }}
                      src='https://ik.imagekit.io/8ieg70pvks/profile?tr=w-160,h-160'
                      alt='Ahnaf An Nafee'
                    />
                    <div style={{ marginLeft: '16px' }}>
                      <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Ahnaf An Nafee
                      </div>
                      <div style={{ color: '#22d3ee', fontSize: '20px' }}>PhD Student • AI & 3D Graphics</div>
                      <div style={{ color: '#9ca3af', fontSize: '16px' }}>George Mason University</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}
                      >
                        🧠
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}
                      >
                        🌐
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #ec4899, #ef4444)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}
                      >
                        ⚡
                      </div>
                    </div>
                    <div style={{ color: '#c084fc', fontSize: '14px' }}>www.ahnafnafee.dev</div>
                  </div>
                </div>
              </div>

              {/* Command Prompt */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ color: '#4ade80', marginRight: '8px' }}>ahnafnafee@dev</span>
                <span style={{ color: 'white', marginRight: '8px' }}>:</span>
                <span style={{ color: '#60a5fa', marginRight: '8px' }}>~</span>
                <span style={{ color: 'white', marginRight: '8px' }}>$</span>
                <span style={{ color: 'white', backgroundColor: '#374151', padding: '0 4px' }}>█</span>
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
