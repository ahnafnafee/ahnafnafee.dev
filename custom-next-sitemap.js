const isProduction = process.env.NODE_ENV === 'production'
const isStaticExport = process.env.STATIC_EXPORT === 'true'
const domain = isProduction ? 'www.ahnafnafee.dev' : 'localhost:3000'
const protocol = isProduction ? 'https' : 'http'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `${protocol}://${domain}`,
  generateRobotsTxt: !isStaticExport, // Don't generate robots.txt for static export
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
      { userAgent: '*', disallow: '/_next/' },
      { userAgent: '*', disallow: '/static/' }
    ],
    additionalSitemaps: [
      `${protocol}://${domain}/sitemap.xml`, 
      `${protocol}://${domain}/server-sitemap.xml`
    ],
    host: `${protocol}://${domain}`,
    crawlDelay: 1
  },
  priority: 1.0,
  exclude: ['/server-sitemap.xml', '/api/*', '/_next/*', '/static/*', '/.well-known/*'],
  generateIndexSitemap: false,
  sitemapSize: 10000,
  changefreq: 'weekly',
  transform: async (config, path) => {
    // Custom priority and changefreq based on page importance
    let priority = 0.7
    let changefreq = 'monthly'
    
    if (path === '/') {
      priority = 1.0
      changefreq = 'weekly'
    } else if (path === '/resume') {
      priority = 0.9
      changefreq = 'monthly'
    } else if (path === '/portfolio') {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.startsWith('/portfolio/')) {
      priority = 0.7
      changefreq = 'monthly'
    } else if (path.startsWith('/blog/')) {
      priority = 0.6
      changefreq = 'monthly'
    } else if (path.startsWith('/snippet/')) {
      priority = 0.5
      changefreq = 'monthly'
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async (config) => {
    // Add additional important paths
    return [
      await config.transform(config, '/'),
      await config.transform(config, '/resume'),
      await config.transform(config, '/portfolio'),
    ]
  }
}
