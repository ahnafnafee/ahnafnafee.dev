import SOCIAL from './social'

import { Experience } from 'me'

export const HEADLINE = {
  name: 'Ahnaf An Nafee',
  title: 'Software Engineer · AI Researcher · DevOps & Cloud Infrastructure'
}

// Mirrors the canonical resume in github.com/ahnafnafee/ahnafnafee. The PDF
// link points at the raw file in that repo so the resume page always tracks
// the source of truth without re-uploading the binary into this repo.
export const LINKS: typeof SOCIAL = [
  ...SOCIAL.filter((s) => s.title !== 'Telegram'),
  {
    href: 'https://ahnafnafee.dev',
    title: 'Website'
  },
  {
    href: 'https://raw.githubusercontent.com/ahnafnafee/ahnafnafee/main/resume.pdf',
    title: 'PDF'
  }
]

// Skills mirror the categorized blocks in resume.tex. Stays in roughly the
// same on-page rendering order (Languages first, spoken languages last).
export const SKILLS = [
  {
    name: 'Languages',
    list: ['Python', 'Go', 'Java', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'GLSL', 'Bash']
  },
  {
    name: 'AI / ML',
    list: [
      'PyTorch',
      'TensorFlow',
      'Generative AI',
      'Deep Learning',
      'Computer Vision',
      'Diffusion Models',
      'LLMs',
      'Reinforcement Learning',
      'MLOps'
    ]
  },
  {
    name: 'Graphics & XR',
    list: [
      '3D Computer Graphics',
      'Real-Time Rendering',
      'Shader Programming',
      'Unity',
      'Unreal Engine',
      'WebGL',
      'Procedural Generation'
    ]
  },
  {
    name: 'Cloud & DevOps',
    list: [
      'AWS',
      'Kubernetes',
      'OpenShift',
      'Docker',
      'Terraform',
      'CI/CD',
      'GitHub Actions',
      'Jenkins',
      'Gradle',
      'Maven',
      'Helm',
      'Observability'
    ]
  },
  {
    name: 'Backend & Systems',
    list: [
      'Distributed Systems',
      'Microservices',
      'REST',
      'gRPC',
      'WebSockets',
      'OAuth',
      'RBAC',
      'System Design',
      'High Availability'
    ]
  },
  {
    name: 'Frontend',
    list: ['React', 'Node.js', 'Next.js', 'Redux', 'HTML5', 'CSS3']
  },
  {
    name: 'Methods',
    list: [
      'Agile',
      'Scrum',
      'Test-Driven Development',
      'Code Review',
      'Technical Leadership',
      'Cross-Functional Collaboration'
    ]
  }
]

export const KEY_SKILLS = []

export const EXPERIENCE: Experience[] = [
  {
    companyName: `<a href='https://gmu.edu'>George Mason University — DCXR Lab</a>`,
    role: 'Graduate Teaching Assistant',
    period: {
      start: 'Aug 2025',
      end: 'Present'
    },
    lists: [
      `Mentor 60+ graduate and undergraduate students in algorithms, systems, and applied machine learning, driving measurable improvements in lab completion and conceptual mastery`,
      `Design coursework, lab exercises, and evaluation rubrics aligned with modern software engineering best practices`
    ]
  },
  {
    companyName: `<a href='https://www.paychex.com'>Paychex</a>`,
    role: 'DevOps Engineer',
    period: {
      start: 'Feb 2023',
      end: 'Aug 2025'
    },
    lists: [
      `Architected and led a cross-team standardization of Kubernetes/OpenShift deployment dictionaries across 10+ service teams, eliminating configuration conflicts and accelerating developer velocity`,
      `Designed and rolled out Role-Based Access Control (RBAC) policies in OpenShift in partnership with security and infrastructure teams, hardening the platform against privilege-escalation risks`,
      `Automated end-to-end TLS certificate lifecycle management, eliminating manual renewals and reducing certificate-expiration-related downtime by 100%`,
      `Built a Gradle plugin for container image certification that streamlined CI/CD workflows, reduced build-pipeline congestion, and lowered operational expenses by 10% annually`,
      `Championed infrastructure-as-code and observability best practices; partnered with SREs to improve deployment reliability and mean time to recovery (MTTR)`
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
      `Owned end-to-end technical strategy, architecture, and execution as CTO; led engineering across backend, frontend, and cloud teams shipping a consumer-facing matchmaking platform`,
      `Spearheaded migration of monolithic backend to a microservices architecture on AWS, cutting application load and cloud spend by 80% through right-sizing, autoscaling, and serverless adoption`,
      `Introduced CI/CD with GitHub Actions and Maven, automating builds, tests, and deployments; reduced manual release effort by 85% and eliminated deploy-day toil`,
      `Recruited, mentored, and led multiple student engineering pods through full microservice design, implementation, and production rollout`,
      `Drove weekly stakeholder syncs, aligning product, design, and engineering on roadmap, scope, and delivery milestones`
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
      `Engineered a real-time chat subsystem using STOMP over WebSockets in Java, supporting thousands of concurrent users with low-latency delivery`,
      `Integrated 20+ REST endpoints across third-party and OAuth-based identity providers, enabling secure, scalable authentication and data exchange`,
      `Optimized client-side state management with Redux, cutting chat-service performance bottlenecks by 80%`,
      `Designed data pipelines and APIs powering the matchmaking recommendation engine serving thousands of active users`
    ]
  },
  {
    companyName: `<a href='https://drexel.edu'>Drexel University — College of Computing & Informatics</a>`,
    role: 'Teaching Assistant',
    period: {
      start: 'Sep 2021',
      end: 'Jun 2022'
    },
    lists: [
      `Facilitated weekly labs and mentored students in systems engineering, programming fundamentals, and technical project management`,
      `Developed hands-on demonstrations translating abstract computer-science concepts into practical, assessable skills`
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
      `Shipped gameplay systems and parameterized shaders for <i>DC's Justice League: Cosmic Chaos</i> (multi-platform console/PC release)`,
      `Built modular game-manager scripts that streamlined designer workflows and accelerated feature iteration`,
      `Partnered with technical artists to create customizable, performance-tuned shaders optimized for runtime rendering`,
      `Executed integration and stress testing via Mantis, delivering actionable, developer-ready bug reports`
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
    school: 'Ph.D. in Computer Science, George Mason University — DCXR Lab',
    period: {
      start: '2025',
      end: 'Expected 2030'
    },
    paragraphs: [
      `<strong>Advisor:</strong> Dr. Craig Yu`,
      `<strong>Research focus:</strong> generative AI for 3D content creation, machine-learning-driven graphics pipelines (UV mapping, non-photorealistic rendering), and human–computer interaction in immersive XR environments`
    ]
  },
  {
    school: 'B.S. in Computer Science, Drexel University',
    period: {
      start: '2018',
      end: '2022'
    },
    paragraphs: [
      `<strong>Honors:</strong> Dean's List; Founder's Scholarship`,
      `<strong>Relevant coursework:</strong> Algorithms, Operating Systems, Distributed Computing, Computer Graphics, Machine Learning, Software Engineering`
    ]
  }
]

export const SUMMARY = {
  intro: `Computer Science PhD candidate and full-stack engineer with 4+ years of industry experience spanning distributed systems, cloud-native infrastructure, and applied AI/ML research.`,
  experience: `Proven track record delivering production-grade platforms at scale: reduced infrastructure cost by 80%, automated release pipelines cutting manual effort by 85%, and eliminated certificate-related downtime by 100%. Former CTO leading cross-functional engineering teams; now advancing research at the intersection of generative AI, 3D computer graphics, and human–computer interaction.`,
  researchFocus: [
    `Generative models (diffusion, neural fields) for automated, controllable 3D asset creation in production-grade graphics pipelines`,
    `Learning-based approaches to UV mapping, stylization, and non-photorealistic rendering (NPR) for real-time applications`,
    `Human–computer interaction in immersive XR environments and AI-driven creative workflows`
  ],
  technicalSkills: `Python, Go, Java, C++, PyTorch, TensorFlow, Unity, Unreal Engine, WebGL, GLSL, Kubernetes, OpenShift, AWS, Docker, Terraform`,
  outro: `Seeking software engineering, machine learning, and research-engineering roles where systems thinking meets scientific rigor.`
}

// Keeping the section so the page rendering doesn't break, but the canonical
// resume doesn't list separate "certifications" — it folds them into Education
// and Honors. List Python 3 here as a residual; remove the Bachelor of Science
// "certification" since it's already represented in EDUCATION.
export const CERTIFICATIONS = [
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
    issuer: 'Drexel University',
    date: '2018-2022'
  }
]

export const LANGUAGES = [
  {
    title: 'English',
    level: 'Full Professional'
  },
  {
    title: 'Bangla',
    level: 'Native'
  }
]
