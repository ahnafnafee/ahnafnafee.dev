/* eslint-disable @typescript-eslint/no-var-requires */
const { withAxiom } = require('next-axiom')

const runtimeCaching = require('next-pwa/cache')
const isDev = process.env.NODE_ENV === 'development'

// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com;
    child-src *.youtube.com *.google.com *.twitter.com;
    style-src 'self' 'unsafe-inline' *.googleapis.com;
    img-src * blob: data:;
    media-src 'none';
    connect-src *;
    font-src 'self';
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

const withPWA = require('next-pwa')({
  dest: 'public',
  skipWaiting: true, // installs new SW when available without a prompt, we only need to send a reload request to user.
  register: true,
  disable: isDev,
  runtimeCaching,
  buildExcludes: [
    /chunks\/images\/.*$/, // Don't precache files under .next/static/chunks/images this improves next-optimized-images behaviour
    /chunks\/pages\/api\/.*/ // Dont cache the API it needs fresh serverinfo
  ]
  // exclude: [
  //   /middleware-manifest\.json$/, // exclude middleware to fix error @see https://github.com/shadowwalker/next-pwa/issues/288#issuecomment-955777098,
  //   /build-manifest\.json$/,
  //   /\.map$/, // dont cache map files
  //   /^.*ts.*$/ // Dont let serviceworker touch the TS streams
  // ],
})

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: [
      'cdn.sanity.io',
      'ik.imagekit.io',
      'og-image.vercel.app',
      'media3.giphy.com',
      'media0.giphy.com',
      'github.com',
      'raw.githubusercontent.com',
      'img.shields.io'
    ]
  },
  compiler: { removeConsole: !isDev },
  swcMinify: true,
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/resume.pdf',
        destination: '/AhnafAnNafeeResume.pdf',
        permanent: true
      },
      {
        source: '/blog',
        destination: '/portfolio',
        permanent: true
      },
      {
        source: '/projects',
        destination: '/portfolio',
        permanent: true
      },
      {
        source: '/snippet',
        destination: '/portfolio',
        permanent: true
      },
      {
        source: '/tags',
        destination: '/',
        permanent: true
      },
      {
        source: '/cv',
        destination: '/AhnafAnNafeeResume.pdf',
        permanent: true
      },
      {
        source: '/github',
        destination: 'https://github.com/ahnafnafee',
        permanent: true
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/ahnafnafee',
        permanent: true
      }
    ]
  }
}

module.exports = withAxiom(withPWA(config))

// module.exports = config
