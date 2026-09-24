// Public resume content follows D:/GitHub/ahnafnafee/resume.tex.
// Independent research and synthetic benchmarks remain distinct from production work.

export const RESUME_PDF_URL = '/AhnafAnNafeeResume.pdf'

export const HEADLINE = {
  name: 'Ahnaf An Nafee',
  focus: 'HCI // ML systems // Research engineering',
  title: 'Computer Science PhD Student | George Mason University',
  location: 'Manassas, VA',
  phone: '+1 540 252 8738',
  email: 'ahnafnafee@gmail.com'
}

export const LINKS = [
  { label: 'Website', href: 'https://www.ahnafnafee.dev' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahnafnafee' },
  { label: 'GitHub', href: 'https://github.com/ahnafnafee' }
]

export const SUMMARY =
  'Computer Science PhD student focused on human-computer interaction, with industry experience in platform engineering and mobile/backend product delivery. At the DCXR Lab, I formulate hypotheses, design and pilot-test experiments, and integrate Unity/C# and Python study systems. Former CTO seeking Summer 2027 research internships in HCI, human-centered AI, graphics, and ML systems.'

export type ResumeEntry = {
  organization: string
  role: string
  period: string
  location: string
  description?: string
  bullets?: string[]
  href?: string
  links?: { label: string; href: string }[]
  note?: string
}

export const EDUCATION: ResumeEntry[] = [
  {
    organization: 'George Mason University',
    role: 'PhD in Computer Science, in progress',
    period: 'Aug 2025 - present',
    location: 'Fairfax, VA',
    description:
      'Anticipated graduation: June 2029. Research focus: human-computer interaction and interactive systems. DCXR Lab researcher.'
  },
  {
    organization: 'Drexel University',
    role: 'BS in Computer Science, Magna Cum Laude',
    period: 'Sep 2018 - Jun 2022',
    location: 'Philadelphia, PA',
    description:
      'Concentrations in Artificial Intelligence and Game Programming & Development. Four-year co-op program.'
  }
]

export const RESEARCH: ResumeEntry[] = [
  {
    organization: 'DCXR Lab, George Mason University',
    role: 'Researcher; Graduate Research Assistant appointment in Summer 2026',
    period: 'Jan 2026 - present',
    location: 'Fairfax, VA',
    bullets: [
      'Formulate hypotheses and design experiments for IRB-approved human-subjects research; integrate and pilot-test Unity/C# and Python study systems for fNIRS-informed classification, synchronized telemetry, preprocessing, and data-quality checks.'
    ]
  }
]

export const PROJECTS: ResumeEntry[] = [
  {
    organization: 'Player 2',
    role: 'Continuing independent development',
    period: 'Ongoing',
    location: 'Mobile, web, and backend',
    href: 'https://www.ahnafnafee.dev/portfolio/player2',
    bullets: [
      'Evolved a nine-repository iOS, Android, and web platform using Java/Spring, PostgreSQL/Redis, cloud infrastructure, release automation, and observability.',
      'Built feed, matchmaking, and discovery ranking with attributed feedback, Python/LightGBM training, and Java shadow scoring; learned-model ranking remains shadow-only.',
      'Benchmarked one million synthetic users; removed full-table and N+1 work to cut warm-feed time from 7.4 seconds to 0.70-1.69 seconds and raise modeled capacity from 39 to 330 requests/second.',
      'Added 15-locale and right-to-left support; reduced feed p99 frame time from 101 ms to 36 ms and jank from 9.6% to 4.1%.'
    ]
  },
  {
    organization: 'Offline recommendation studies',
    role: 'Independent research projects',
    period: '2026',
    location: 'Python, PyTorch, LightGBM, MovieLens 1M',
    bullets: [
      'Evaluated temporal LambdaRank against validation-selected popularity on 961 held-out users (NDCG@10 0.108 vs. 0.190; paired difference -0.082, 95% interval [-0.093, -0.071]); kept the higher-scoring test-only item-kNN result descriptive.',
      'Compared PyTorch GRU and causal Transformer next-rating rankers (Transformer-minus-GRU +0.014 NDCG@10; 95% paired user-bootstrap interval [+0.008, +0.020]); built temporal-leakage, cold-history, artifact, and CPU/GPU cost checks. Outcomes reflect rating activity, not engagement.'
    ],
    links: [
      {
        label: 'Sequence-model study',
        href: 'https://www.ahnafnafee.dev/research/sequence-models-rating-activity'
      }
    ]
  }
]

export const INDUSTRY: ResumeEntry[] = [
  {
    organization: 'Mindex',
    role: 'DevOps Engineer, contractor for Paychex under Mindex',
    period: 'Feb 2023 - Aug 2025',
    location: 'United States',
    bullets: [
      'Standardized Kubernetes/OpenShift deployment patterns across 10+ service teams, establishing a consistent path for production releases.',
      'Designed and rolled out OpenShift role-based access controls with security and infrastructure partners to address privilege-escalation risk on a shared platform.',
      'Automated the TLS certificate lifecycle, eliminating manual renewals and reported certificate-expiration downtime.',
      'Built Gradle tooling for container-image certification, reducing CI/CD congestion and contributing to a reported 10% reduction in annual operating expense.'
    ]
  },
  {
    organization: 'Dynasty 11 Studios',
    role: 'Chief Technology Officer',
    period: 'Jun 2022 - Feb 2023',
    location: 'United States',
    bullets: [
      "Promoted to CTO within nine months; owned Player 2's technical roadmap and led a distributed team across React Native, Java/Spring, PostgreSQL, AWS, and product delivery.",
      'Advanced the award-winning prototype toward production readiness across matchmaking, chat, community, and marketplace features; reduced cloud costs by 80% through architecture and delivery changes.'
    ]
  },
  {
    organization: 'Dynasty 11 Studios',
    role: 'Software Engineer',
    period: 'Sep 2021 - Jun 2022',
    location: 'United States',
    bullets: [
      'Built the React Native and Java/Spring foundation across authentication, STOMP/WebSocket chat, matchmaking, PostgreSQL services, and repeatable mobile/backend releases.'
    ]
  },
  {
    organization: 'PHL Collective',
    role: 'Technical Engineer',
    period: 'Mar 2021 - Sep 2021',
    location: 'United States',
    description: 'Contributed Unity/C# engineering and real-time technical work within a game-development team.'
  },
  {
    organization: 'giffot.ai',
    role: 'UX Designer',
    period: 'Feb 2020 - Mar 2020',
    location: 'Early-stage product team',
    description: 'Contributed user-experience design work to an early-stage product team.'
  }
]

export const TEACHING: ResumeEntry[] = [
  {
    organization: 'George Mason University',
    role: 'Graduate Teaching Assistant',
    period: 'Aug 2026 - present',
    location: 'Fairfax, VA',
    note: 'Prior appointment: Aug 2025 - May 2026',
    description: 'Support computer science coursework and labs through instruction, debugging, and student mentorship.'
  },
  {
    organization: 'Drexel University',
    role: 'Teaching Assistant',
    period: 'Sep 2021 - Jun 2022',
    location: 'Philadelphia, PA',
    description: 'Supported programming assignments, course concepts, and technical problem-solving.'
  }
]

export const SKILLS = [
  { name: 'Programming', details: 'Python, Java, Go, C++, C#, Rust, TypeScript, JavaScript, SQL, Bash.' },
  {
    name: 'Research and ML tools',
    details:
      'Unity, NumPy, pandas, SciPy, scikit-learn, LightGBM; research instrumentation, data-quality validation, offline evaluation, synthetic load testing.'
  },
  {
    name: 'Platforms',
    details:
      'React Native, React, Java/Spring, PostgreSQL, Redis, AWS, Kubernetes, OpenShift, Docker, Terraform, GitHub Actions, Jenkins, Gradle, Cloudflare.'
  }
]

export const RECOGNITION = {
  honors: "Drexel Senior Project Showcase Winner for Player 2; Dean's List; Founder's Scholarship.",
  languages: 'English (full professional proficiency); Bangla (native).'
}
