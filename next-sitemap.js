/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ahnafnafee.dev',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  },
  sitemapSize: 10000
}
