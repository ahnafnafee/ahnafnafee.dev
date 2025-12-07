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
    name: 'Top Skills',
    list: ['OpenShift', 'Go', 'Kubernetes']
  },
  {
    name: 'Programming',
    list: [
      'Python',
      'Kotlin',
      'Java',
      'Groovy',
      'GoLang',
      'PostgreSQL',
      'MySQL',
      'WebGL',
      'C#',
      'C',
      'C++',
      'Haskell',
      'SQLite',
      'JavaScript',
      'TypeScript',
      'Bash',
      'GLSL',
      'HLSL'
    ]
  },
  {
    name: 'Tools & Frameworks',
    list: [
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
      'React Native',
      'SpringBoot',
      'Node.js',
      'React',
      'JIRA',
      'AI',
      'ML',
      'AWS',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'OpenShift',
      'Terraform',
      'Hashicorp Vault',
      'Jenkins',
      'AWS ECS',
      'AWS AKS',
      'GCP',
      'Gradle',
      'Puppet',
      'Ansible',
      'Maven',
      'Kong Mesh',
      'KEDA'
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
    companyName: `<a href='https://gmu.edu'>George Mason University</a>`,
    role: 'Graduate Teaching Assistant',
    period: {
      start: 'Aug 2024',
      end: 'Present'
    },
    lists: [
      `Serving as a Graduate Teaching Assistant for the Computer Science department, supporting students through hands-on learning and mentorship in complex technical concepts`
    ]
  },
  {
    companyName: `<a href='https://paychex.com'>Paychex</a>`,
    role: 'Software Engineer',
    period: {
      start: 'Feb 2023',
      end: 'Aug 2024'
    },
    lists: [
      `As a Software Engineer, I was part of a collaborative effort to upgrade observability infrastructure, automate key processes, and enhance CI/CD pipeline efficiency for enterprise-level applications`,
      `Led a cross-team initiative to standardize deployment dictionaries, facilitating discussions and building consensus to create conflict-free configurations that improved developer workflow`,
      `Partnered with infrastructure teams to design and implement role-based access control in OpenShift, effectively translating developer needs into security requirements to streamline operations`,
      `Automated certificate management, eliminating manual renewals and reducing downtime related to certificate expirations by 100%`,
      `Innovated CI/CD processes by introducing a gradle plugin for image certification, which reduced build congestion and lowered operational expenses by 10% annually`
    ]
  },
  {
    companyName: `<a href='https://dynasty11.com'>Dynasty 11 Studios</a>`,
    role: 'Chief Technology Officer',
    period: {
      start: 'Jun 2022',
      end: 'Feb 2023'
    },
    lists: [
      `As CTO, I directed the company's technical vision, led engineering teams, and managed the full project lifecycle from architecture to deployment to improve application efficiency, scalability, and reliability`,
      `As CTO, mentored and led multiple student engineering teams to spearhead the design and implementation of several new microservices across the application`,
      `Spearheaded a critical backend migration to AWS, leading the project from conception to completion and coordinating with multiple teams to achieve an 80% reduction in application load and costs`,
      `Automated the build and deployment process with GitHub Actions and Maven, leading to an 85% reduction in manual work and improved team efficiency`,
      `Acted as a key liaison between stakeholders and the project team, facilitating weekly meetings to ensure clear communication, manage expectations, and drive successful project execution`
    ]
  },
  {
    companyName: `<a href='https://dynasty11.com'>Dynasty 11 Studios</a>`,
    role: 'Software Engineer',
    period: {
      start: 'Sep 2021',
      end: 'Jun 2022'
    },
    lists: [
      `Engineered Java service integration for STOMP WebSockets to enable in-app chat functionality, enhancing user engagement and communication within the application`,
      `Integrated Third-Party services and OAuth services with over 20 RESTful endpoints to create a scalable, user-facing application and increase user engagement`,
      `Reduced performance bottlenecks in the custom chat service using Redux state management by 80%, improving the overall efficiency of the application`,
      `Designed and integrated APIs that processed match data to power matchmaking recommendations for thousands of users, improving the personalization and effectiveness of the application`,
      `Collaborated in weekly meetings with stakeholders and the project team to ensure streamlined communication and the successful execution of projects`
    ]
  },
  {
    companyName: `<a href='https://drexel.edu'>Drexel University College of Computing & Informatics</a>`,
    role: 'Teaching Assistant',
    period: {
      start: 'Sep 2021',
      end: 'Jun 2022'
    },
    lists: [
      `Assisted with multiple undergraduate and graduate courses covering systems engineering, programming, and management`,
      `Mentored undergraduate and graduate students, enhancing their comprehension of abstract concepts by developing and leading hands-on demonstrations and facilitating weekly labs`
    ]
  },
  {
    companyName: `<a href='https://phlcollective.com'>PHL Collective</a>`,
    role: 'Technical Programmer',
    period: {
      start: 'Mar 2021',
      end: 'Sep 2021'
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
    school: 'PhD in Computer Science, George Mason University',
    period: {
      start: '2024',
      end: 'Present'
    },
    paragraphs: [
      'Research Focus: AI and 3D Computer Graphics',
      `<strong>Lab:</strong> DCXR (Design Computing and eXtended Reality) Lab`,
      `<strong>Advisor:</strong> Dr. Craig Yu`,
      `<strong>Research Areas:</strong> Human-Computer Interaction, Immersive Digital Environments, AI-Driven Creative Workflows`
    ],
    list: {
      title: 'Current Research',
      listItem: [
        'Developing novel AI approaches for intuitive human-computer interaction in 3D environments',
        'Creating machine learning models to automate and optimize 3D modeling pipelines, including UV mapping and NPR techniques',
        'Exploring scalable cloud infrastructure for deploying AI-powered graphics applications'
      ]
    }
  },
  {
    school: 'BS in Computer Science, Drexel University',
    period: {
      start: '2018',
      end: '2022'
    },
    paragraphs: [
      'Concentration in AI and Game Programming',
      `<strong>Honors:</strong> Magna Cum Laude, Winner of Senior Project Showcase with the 'Player 2' app, Dean's List`
    ],
    list: {
      title: 'Notable Achievements',
      listItem: [
        'Senior Project Showcase Winner with innovative mobile application development',
        "Consistent Dean's List recognition for academic excellence",
        'Strong foundation in AI, machine learning, and game development technologies'
      ]
    }
  }
]

export const SUMMARY = {
  intro: `PhD student at GMU's DCXR Lab, advised by Dr. Craig Yu. Researching the intersection of AI and 3D graphics to transform immersive experiences.`,
  experience: `Ex-CTO of a tech startup with a focus on building scalable, production-ready systems. I build systems that work, not just papers that publish.`,
  researchFocus: [
    `AI-driven creative workflows for 3D content generation`,
    `Machine learning for graphics pipelines - automating UV mapping, NPR techniques, and modeling workflows`,
    `Human-computer interaction in immersive environments`
  ],
  technicalSkills: `Python, C++, PyTorch, TensorFlow, Unity, Unreal Engine, OpenGL, GLSL, Kubernetes, AWS`,
  outro: `Open to collaborations pushing the boundaries of AI and graphics.`
}

export const CERTIFICATIONS = [
  {
    title: 'Bachelor of Science',
    issuer: 'Drexel University',
    date: '2022'
  },
  {
    title: 'Python 3',
    issuer: 'Programming Certification',
    date: '2021'
  }
]

export const HONORS_AWARDS = [
  {
    title: "Dean's List",
    issuer: 'Drexel University',
    date: 'Multiple Semesters'
  },
  {
    title: "Founder's Scholarship",
    issuer: 'Academic Excellence',
    date: '2018-2022'
  }
]

export const LANGUAGES = [
  {
    title: 'Bangla',
    level: 'Full Professional'
  },
  {
    title: 'English',
    level: 'Full Professional'
  }
]
