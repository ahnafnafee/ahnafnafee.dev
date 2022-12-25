import SOCIAL from './social'

import { Experience } from 'me'

export const HEADLINE = {
  name: 'Ahnaf An Nafee'
}

export const LINKS: typeof SOCIAL = [
  ...SOCIAL.filter((s) => s.title !== 'Telegram'),
  {
    href: 'https://ahnafnafee.dev',
    title: 'Website'
  },
  {
    href: '/AhnafAnNafeeResume.pdf',
    title: 'PDF'
  }
]

export const SKILLS = [
  {
    name: 'Programming',
    list: [
      'Python',
      'TypeScript',
      'JavaScript',
      'Kotlin',
      'Java',
      'Jest',
      'Detox',
      'TypeScript',
      'JUnit',
      'Selenium',
      'PostgreSQL',
      'MySQL',
      'WebGL',
      'C#',
      'C',
      'C++',
      'Haskell',
      'GLSL',
      'HLSL',
      'SQLite'
    ]
  },
  {
    name: 'Tools & Frameworks',
    list: [
      'React Native',
      'SpringBoot',
      'Node.js',
      'React',
      'JIRA',
      'Android Studio',
      'Xcode',
      'GitHub',
      'Postman',
      'Unity',
      'Unreal Engine',
      'Maya',
      'FMOD',
      'Wwise',
      'Blender',
      '3D Modeling',
      'Game Testing',
      '3D Animation',
      'Prototyping',
      'Adobe CS',
      'Figma',
      'Perforce',
      'Plastic SCM',
      'AI',
      'ML',
      'AWS (ECS, EC2, SNS, SES, Route 53, RDS, Lambda, Cloud Formation Stack)',
      'Firebase',
      'Docker',
      'WebSocket Integration',
      'ERM',
      'Microservice API',
      'OAuth'
    ]
  }
]

export const KEY_SKILLS = [
  // 'Continuous Integration & Continuous Deployment',
  // 'Design Thinking Process',
  // 'Critical Thinking & Problem Solving',
  // 'Accessible Frontend Application',
  // 'Adaptability',
  // 'Team Player',
  // 'Creativity'
]

export const EXPERIENCE: Experience[] = [
  {
    companyName: `<a href=\'https://dynasty11.com\'>Dynasty 11 Studios</a>`,
    role: 'Software Developer',
    period: {
      start: 'Sept 2021',
      end: 'Present'
    },
    lists: [
      `Designed and implemented 6 new DevOps pipelines to deliver fast OTA application updates, resulting in improved customer satisfaction and retention`,
      `Led the backend migration to Amazon Elastic Load Balancers and Auto Scale Groups, resulting in an 80% reduction in application load and costs`,
      `Automated the build and deployment process with GitHub Actions and Maven, and implemented Serverless Lambda functions for monitoring, resulting in an 85% reduction in manual work`,
      `Created a custom API interceptor to handle all CRUD transactions and JWT token management, improving security and scalability`,
      'Engineered Java service integration for STOMP WebSockets to enable in-app chat functionality, enhancing user engagement and experience',
      'Integrated third-party services and OAuth services with over 20+ RESTful endpoints, contributing to the development of a scalable, user-facing application and increasing user engagement'
    ]
  },
  {
    companyName: `<a href=\'https://phlcollective.com\'>PHL Collective</a>`,
    role: 'Technical Programmer Co-op',
    period: {
      start: 'Mar 2021',
      end: 'Sept 2022'
    },
    lists: [
      `Integrated and scripted versatile game managers to streamline future design processes and improve efficiency, resulting in a more efficient and effective workflow for the development team`,
      `Developed parameterized shaders with multiple variants for general stylized usage for DC's Justice League: Cosmic Chaos, enhancing visual aesthetics and appeal`,
      `Worked closely with the Art team to improve workflows and create simpler, customizable shaders, improving collaboration and productivity`,
      `Conducted integration and stress testing on WIP games, identifying and reporting any issues in a developer-friendly format using Mantis`,
      `Coordinated closely with the design team to identify problematic areas and created relevant test cases, ensuring the quality and functionality of the final product`
    ]
  }
]

type Education = Array<{
  school: string
  period: { start: string; end: string }
  paragraphs: string[]
  list?: {
    title: string
    listItem: string[]
  }
}>

export const EDUCATION: Education = [
  {
    school: 'Drexel University',
    period: {
      start: 'Sept 2018',
      end: 'June 2022'
    },
    paragraphs: [
      'BS in Computer Science',
      'Concentration in Artificial Intelligence, Game Programming and Development',
      `GPA: 3.77 (<i>manga cum laude</i>)`
    ]
  }
]

export const SUMMARY = [
  `Software Engineer`,
  'Passion for <strong>Game Programming</strong> and <strong>Development</strong>',
  'Deploy optimized apps with scalable user interface, user experience, and user accessibility based on design thinking process.'
]

export const LANGUAGES = [
  {
    title: 'English',
    level: 'Native & Fluent'
  },
  {
    title: 'Bangla',
    level: 'Native & Fluent'
  }
]
