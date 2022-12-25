const isProduction = process.env.NODE_ENV === 'production'
const domain = isProduction ? 'ahnafnafee.dev' : 'localhost:3000'
const protocol = isProduction ? 'https' : 'http'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `${protocol}://${domain}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [`${protocol}://${domain}/sitemap.xml`, `${protocol}://${domain}/server-sitemap.xml`]
  },
  priority: 1.0,
  exclude: ['/server-sitemap.xml', '/blogs/*', '/snippets/*', 'tags/*'],
  generateIndexSitemap: false,
  sitemapSize: 10000
}
