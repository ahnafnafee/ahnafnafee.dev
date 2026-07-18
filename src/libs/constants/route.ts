const APP_ROUTE = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/research',
    name: 'Research'
  },
  {
    path: '/blog',
    name: 'Blog'
  },
  {
    path: '/portfolio',
    name: 'Portfolio'
  },
  {
    path: '/resume',
    name: 'Resume'
  }
]

// Footer-only utility/legal links. Kept out of APP_ROUTE so they don't clutter
// the primary top navigation or the SiteNavigationElement schema, while staying
// crawlable and visible on every page.
export const SITE_LINKS = [
  {
    path: '/about',
    name: 'About'
  },
  {
    path: '/contact',
    name: 'Contact'
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy'
  },
  {
    path: '/security-policy',
    name: 'Security Policy'
  }
]

export const ADDT_ROUTE = [
  // {
  //   path: '/tags',
  //   name: 'Tags'
  // },
  // {
  //   path: '/snippet',
  //   name: 'Snippet'
  // },
  // {
  //   path: '/resume',
  //   name: 'Resume'
  // },
  // {
  //   path: '/certificate',
  //   name: 'Certificate'
  // }
]

export default APP_ROUTE
