// Single source of truth for the canonical site identity.
// Override SITE_URL via NEXT_PUBLIC_SITE_URL when deploying to a non-canonical
// host (preview deploys, university mirror, etc.) — otherwise everything points
// at the production domain.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.ahnafnafee.dev'

export const SITE_NAME = 'Ahnaf An Nafee'

export const SITE_DESCRIPTION =
  'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.'

export const SITE_AUTHOR = {
  name: 'Ahnaf An Nafee',
  email: 'ahnafnafee@gmail.com',
  twitterHandle: '@ahnaf_nafee',
  githubUsername: 'ahnafnafee'
} as const

export const TWITTER_HANDLE = SITE_AUTHOR.twitterHandle

// 800×800 square headshot. Google's name-search thumbnail (and Knowledge Panel
// when it eventually fires) prefers ≥600 px on the short edge; the original
// 400×400 was technically valid but visibly soft on retina rich-result cards.
export const PROFILE_IMAGE = 'https://ik.imagekit.io/8ieg70pvks/profile?tr=w-800,h-800'
export const PROFILE_IMAGE_WIDTH = 800
export const PROFILE_IMAGE_HEIGHT = 800

// Canonical entity @id used to dedupe the Person across every page that emits
// schema. The fragment-based form is the schema.org-recommended convention.
export const PERSON_ID = `${SITE_URL}/#person`
