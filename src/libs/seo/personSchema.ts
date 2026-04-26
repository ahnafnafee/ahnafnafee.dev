// Canonical Person entity for the site. Emit the full node ONCE on the home
// page; reference it by @id from BlogPosting.author/publisher,
// SoftwareSourceCode.author, and any other schema that needs a Person.
//
// Why a single source: AI search engines (Google AI Mode, ChatGPT, Perplexity)
// build entity graphs across pages — duplicate Person nodes either get
// deduplicated (best case) or weaken entity confidence (worst case).
// Cross-referencing by @id keeps the graph coherent.

import {
  PERSON_ID,
  PROFILE_IMAGE,
  PROFILE_IMAGE_HEIGHT,
  PROFILE_IMAGE_WIDTH,
  SITE_AUTHOR,
  SITE_URL
} from '@/libs/constants/site'

export { PERSON_ID }

export const PERSON_REFERENCE = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE_AUTHOR.name,
  url: SITE_URL
} as const

export const getPersonNode = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE_AUTHOR.name,
  alternateName: SITE_AUTHOR.githubUsername,
  url: SITE_URL,
  // ImageObject (rather than a bare URL string) so Google has explicit
  // dimensions + caption for the Knowledge Graph / name-search thumbnail.
  // Required by https://developers.google.com/search/docs/appearance/structured-data/profile-page
  image: {
    '@type': 'ImageObject',
    url: PROFILE_IMAGE,
    width: PROFILE_IMAGE_WIDTH,
    height: PROFILE_IMAGE_HEIGHT,
    caption: SITE_AUTHOR.name,
    contentUrl: PROFILE_IMAGE
  },
  sameAs: [
    'https://www.linkedin.com/in/ahnafnafee',
    'https://github.com/ahnafnafee',
    'https://scholar.google.com/citations?user=u15DO0cAAAAJ&hl=en',
    'https://orcid.org/0009-0000-9363-4536',
    'https://ahnafnafee.itch.io',
    'https://www.artstation.com/ahnafnafee',
    'https://www.behance.net/ahnafannafee'
  ],
  email: SITE_AUTHOR.email,
  jobTitle: 'PhD Student in Computer Science',
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Computer Science Researcher',
    occupationLocation: {
      '@type': 'Place',
      name: 'George Mason University, Fairfax, VA'
    },
    skills: [
      'Artificial Intelligence',
      '3D Computer Graphics',
      'Machine Learning',
      'DevOps Engineering',
      'Cloud Infrastructure',
      'Kubernetes',
      'Research & Development'
    ]
  },
  worksFor: {
    '@type': 'Organization',
    name: 'George Mason University',
    url: 'https://www.gmu.edu',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fairfax',
      addressRegion: 'VA',
      addressCountry: 'US'
    }
  },
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'George Mason University',
      url: 'https://www.gmu.edu'
    },
    {
      '@type': 'Organization',
      name: 'Drexel University',
      url: 'https://drexel.edu'
    }
  ],
  knowsAbout: [
    'Artificial Intelligence',
    '3D Computer Graphics',
    'Machine Learning for Graphics',
    'AI-driven 3D Content Generation',
    'Generative AI',
    'Computer Vision',
    'Deep Learning',
    'Neural Networks',
    'Rendering Pipelines',
    'Real-time Rendering',
    'Parameterized Shaders',
    'UV Mapping Automation',
    'NPR Techniques',
    'Human Computer Interaction',
    'Immersive Technology',
    'Extended Reality',
    'Game Development',
    'Unity Engine',
    'Unreal Engine',
    'WebGL',
    'GLSL',
    'Python Programming',
    'PyTorch',
    'TensorFlow',
    'Computer Graphics Research',
    'AI Research'
  ],
  researchInterests: [
    'AI-driven creative workflows for 3D content generation',
    'Machine learning for graphics pipelines',
    'Automating UV mapping and NPR techniques',
    'Human-computer interaction in immersive environments'
  ],
  affiliation: {
    '@type': 'Organization',
    name: 'DCXR Lab, George Mason University',
    url: 'https://craigyuyu.github.io/home/group.html'
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'PhD in Computer Science',
      educationalLevel: 'Doctoral',
      credentialCategory: 'degree',
      recognizedBy: {
        '@type': 'Organization',
        name: 'George Mason University'
      }
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'BS in Computer Science',
      educationalLevel: 'Bachelor',
      credentialCategory: 'degree',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Drexel University'
      }
    }
  ],
  description:
    'PhD student at GMU exploring how machine learning transforms 3D content creation and immersive experiences. Research at the intersection of AI and computer graphics.'
})
