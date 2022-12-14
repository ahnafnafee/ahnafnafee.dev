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
    href: 'https://mega.nz/file/CzQ0FSpa#uxOnLguTlP1y8N9rIukzkFXe7HncMHhSMnMr__L9-64',
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
      start: 'September, 2021',
      end: 'Present'
    },
    lists: [
      `Create and Implement 6 new DevOps pipelines to deliver fast OTA application updates, backend build status, and Infrastructure as Code`,
      `Spearhead backend migration to Amazon Elastic Beanstalk for auto-scaling server instances, reducing application load and costs by 80%`,
      `Automate the build and deployment process with GitHub Actions and Maven and use Serverless Lambda functions for monitoring, eliminating 85% of manual work`,
      `Develop a custom API layer to handle all CRUD transactions, and JWT token management and implemented interceptors to embed custom headers`,
      'Engineer Java service integration for STOMP WebSockets for in-app chat functionality',
      'Chart and Integrate Third-Party services and OAuth services with 20+ REST endpoints to create a scalable, user-facing application and increase user engagement'
    ]
  },
  {
    companyName: `<a href=\'https://phlcollective.com\'>PHL Collective</a>`,
    role: 'Technical Programmer Co-op',
    period: {
      start: 'March, 2021',
      end: 'September, 2022'
    },
    lists: [
      `Integrated and Scripted versatile <strong>game managers</strong> to simplify future design processes`,
      `Developed shaders with multiple variants for general <strong>stylized</strong> usage`,
      `Collaborated with the Art team to improve workflows and create simpler and customizable <strong>shaders</strong>`,
      `Performed <strong>integration and stress testing</strong> on WIP games, while reporting any issues in a developer-friendly format in Mantis`,
      `Coordinated closely with the design team to identify problematic areas and created relevant <strong>test cases</strong>`
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
      start: 'September, 2018',
      end: 'June, 2022'
    },
    paragraphs: [
      'BS in Computer Science',
      'Concentration in Artificial Intelligence, Game Programming and Development',
      'GPA: 3.77 (manga cum laude)'
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
