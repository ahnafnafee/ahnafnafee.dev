<div align="center">
  <img src="https://ik.imagekit.io/8ieg70pvks/profile?tr=w-200,h-200" alt="Ahnaf An Nafee" width="150" height="150" style="border-radius: 50%;" />
  
  <h1>Ahnaf An Nafee</h1>
  <h3>PhD Student in AI & 3D Graphics @ GMU | DCXR Lab | Ex-CTO</h3>
  
  <p>
    <a href="https://www.ahnafnafee.dev">🌐 Website</a> •
    <a href="https://www.linkedin.com/in/ahnafnafee">💼 LinkedIn</a> •
    <a href="https://github.com/ahnafnafee">💻 GitHub</a>
  </p>
</div>

---

## About Me

I work at the intersection of AI, 3D computer graphics, and cloud infrastructure. As a Computer Science PhD student at George Mason University, I'm part of the DCXR (Design Computing and eXtended Reality) Lab, where I'm advised by Dr. Craig Yu. My research focuses on building intuitive and immersive ways for humans to interact with digital worlds.

My path to research came through industry experience as a co-founder and CTO of a tech startup. Leading teams through the full lifecycle of building, launching, and scaling products taught me that even the most sophisticated AI models need solid infrastructure to deliver real value.

### Current Focus

- **PhD Research**: AI-driven workflows for creative applications, 3D modeling automation, UV mapping, NPR techniques
- **Lab**: DCXR (Design Computing and eXtended Reality) Lab at George Mason University
- **Advisor**: Dr. Craig Yu
- **Research Areas**: Human-Computer Interaction, Immersive Digital Environments, AI-Graphics Intersection

### Professional Experience

- **Ex-CTO**: Led technical teams in startup environment
- **DevOps Engineer**: Kubernetes, OpenShift, AWS infrastructure specialist
- **Game Developer**: Unity, Unreal Engine, 3D graphics optimization
- **Software Engineer**: Full-stack development, cloud architecture

### Core Expertise

- **AI & Graphics**: Generative AI, 3D Computer Graphics, Rendering Pipelines, Parameterized Shaders
- **DevOps & Cloud**: Kubernetes, OpenShift, AWS, Go, Python, CI/CD, Infrastructure Automation
- **Leadership**: Technical Product Leadership, Agile Development, Team Building & Management

---

## Featured Projects

All of my projects are available at [ahnafnafee.dev/portfolio](https://www.ahnafnafee.dev/portfolio)

---

## Get In Touch

- **Email**: [ahnafnafee@gmail.com](mailto:ahnafnafee@gmail.com)
- **Resume**: [Download PDF](https://www.ahnafnafee.dev/AhnafAnNafeeResume.pdf)
- **Website**: [ahnafnafee.dev](https://www.ahnafnafee.dev)
- **LinkedIn**: [linkedin.com/in/ahnafnafee](https://www.linkedin.com/in/ahnafnafee)

---

## Research Interests

- **Computer Graphics**: Rendering Optimization, AI-Driven Workflows for Creative Applications
- **Machine Learning**: Automating 3D modeling pipelines, UV mapping, NPR techniques  
- **Human-Computer Interaction**: Intuitive interfaces for immersive digital environments
- **Cloud Infrastructure**: Scalable deployment of AI-powered graphics applications

---

<a target="_blank" href="https://www.ahnafnafee.dev">
  <p align="center">
      <img width="45%" alt='Website Home' src="https://ik.imagekit.io/8ieg70pvks/portfolio/site_ss_01.png?ik-sdk-version=javascript-1.4.3&updatedAt=1671006079707" />
      <img width="45%" alt='Website Portfolio' src="https://ik.imagekit.io/8ieg70pvks/portfolio/site_ss_02.png?ik-sdk-version=javascript-1.4.3&updatedAt=1671006079707" />
  </p>
</a>

## Technology Stack

This portfolio website is built with modern web technologies for optimal performance and SEO:

### Frontend & Framework

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### UI & Animation

- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Beautiful notifications
- **React Image Lightbox** - Image gallery functionality
- **Lucide React** - Modern icon library

### Analytics & Performance

- **Vercel Analytics** - Web analytics
- **Vercel Speed Insights** - Performance monitoring
- **Next Axiom** - Structured logging

### SEO & PWA

- **Next SEO** - SEO optimization
- **Next PWA** - Progressive Web App features
- **Next Sitemap** - Automatic sitemap generation
- **Structured Data** - Rich snippets for search engines

### Content Management

- **MDX** - Markdown with React components
- **Gray Matter** - Front matter parsing
- **Reading Time** - Estimated reading time

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint Staged** - Pre-commit linting

## Development

### Prerequisites

```bash
node >= 22.0.0
yarn >= 1.22.0
```

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/ahnafnafee/ahnafnafee.dev.git
cd ahnafnafee.dev
```

2. **Install dependencies**

```bash
yarn install
```

3. **Environment Configuration**

Create a `.env.development.local` file in the root directory:

```env
NEXT_PUBLIC_TWITTER_USERNAME=@ahnaf_nafee
NEXT_PUBLIC_SITE_NAME="Ahnaf An Nafee"
NEXT_PUBLIC_SITE_URL="https://localhost:3000"
```

4. **Development Server**

```bash
yarn dev
```

5. **Build for Production**

```bash
yarn build
yarn start
```

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production (with server features)
yarn export       # Build for static export (generates /out folder)
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn type-check   # Run TypeScript checks
yarn sitemap      # Generate sitemap
yarn clean:build  # Clean .next build folder
yarn clean:export # Clean out export folder
```

## Deployment

### Vercel Deployment (Recommended)

This site is optimized for deployment on **Vercel** with:

- ✅ Automatic deployments from GitHub
- ✅ Edge functions for OG image generation
- ✅ Built-in analytics and speed insights
- ✅ Global CDN for optimal performance
- ✅ Automatic HTTPS and custom domains

```bash
yarn build  # Use this for Vercel deployment
```

### Static Hosting Deployment

For static hosting providers (Netlify, GitHub Pages, AWS S3, etc.):

```bash
yarn export  # Generates static files in /out folder
```

The `out` folder contains:

- ✅ `index.html` - Main entry point
- ✅ All static assets (CSS, JS, images)
- ✅ Pre-rendered HTML pages
- ✅ PWA files (manifest.json, service worker)
- ✅ SEO files (robots.txt, sitemap.xml, security.txt)

**Note:** Static export disables:

- API routes (`/api/*`)
- Server-side features
- Dynamic OG image generation
- Real-time analytics

### Deployment Options

| Platform | Command | Features |
|----------|---------|----------|
| **Vercel** | `yarn build` | Full features + Edge functions |
| **Netlify** | `yarn export` | Static only |
| **GitHub Pages** | `yarn export` | Static only |
| **AWS S3** | `yarn export` | Static only |
| **Traditional Web Server** | `yarn export` | Static only |

### Performance Features

- 🚀 **Next.js 15** with App Router for optimal performance
- 📱 **Progressive Web App** with offline support
- 🖼️ **Optimized Images** with Next.js Image component
- ⚡ **Edge Functions** for dynamic OG images
- 🗜️ **Compression** and caching strategies
- 📊 **Web Vitals** monitoring with Vercel Speed Insights

### SEO Optimizations

- 🔍 **Comprehensive meta tags** and structured data
- 🗺️ **Dynamic sitemaps** for all content
- 🤖 **Robots.txt** optimization
- 📱 **Mobile-first** responsive design
- ⚡ **Core Web Vitals** optimization
- 🔗 **Internal linking** strategy

## License

MIT © [Ahnaf An Nafee](https://github.com/ahnafnafee/ahnafnafee.dev/blob/main/LICENSE)

MIT © [Rizki Maulana Citra](https://github.com/rizkimcitra/rizkicitra.dev/blob/main/LICENSE)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://www.ahnafnafee.dev">Ahnaf An Nafee</a></p>
  <p>
    <a href="https://www.ahnafnafee.dev">🌐 Visit Website</a> •
    <a href="https://github.com/ahnafnafee/ahnafnafee.dev/issues">🐛 Report Bug</a> •
    <a href="https://github.com/ahnafnafee/ahnafnafee.dev/pulls">✨ Request Feature</a>
  </p>
</div>
