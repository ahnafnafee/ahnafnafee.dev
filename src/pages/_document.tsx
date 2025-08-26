import Document, { type DocumentContext, type DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html lang='en-US'>
        <Head>
          {/* Performance optimizations */}
          <link rel='preload' href='/fonts/inter-var-latin.woff2' as='font' type='font/woff2' crossOrigin='anonymous' />
          <link rel='dns-prefetch' href='//ik.imagekit.io' />
          <link rel='dns-prefetch' href='//vercel.com' />
          <link rel='dns-prefetch' href='//github.com' />
          <link rel='dns-prefetch' href='//linkedin.com' />

          {/* Favicons and app icons */}
          <link href='/static/favicons/favicon.ico' rel='shortcut icon' />
          <link href='/static/favicons/apple-touch-icon.png' rel='apple-touch-icon' sizes='180x180' />
          <link href='/static/favicons/favicon-32x32.png' rel='icon' sizes='32x32' type='image/png' />
          <link href='/static/favicons/favicon-16x16.png' rel='icon' sizes='16x16' type='image/png' />
          <link color='#18181b' href='/static/favicons/safari-pinned-tab.svg' rel='mask-icon' />

          {/* Theme and app configuration */}
          <meta content='#18181b' name='theme-color' />
          <meta content='#18181b' name='msapplication-TileColor' />
          <meta content='/static/favicons/browserconfig.xml' name='msapplication-config' />

          {/* SEO and indexing */}
          <meta content='follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1' name='robots' />
          <meta name='author' content='Ahnaf An Nafee' />
          <meta name='creator' content='Ahnaf An Nafee' />
          <meta name='publisher' content='Ahnaf An Nafee' />
          <meta name='format-detection' content='telephone=no' />

          {/* Open Graph defaults */}
          <meta property='og:site_name' content='Ahnaf An Nafee' />
          <meta property='og:locale' content='en_US' />
          <meta property='article:author' content='Ahnaf An Nafee' />

          {/* Twitter Card defaults */}
          <meta name='twitter:creator' content='@ahnaf_nafee' />
          <meta name='twitter:site' content='@ahnaf_nafee' />

          {/* Enhanced structured data */}
          <script
            type='application/ld+json'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for structured data
            dangerouslySetInnerHTML={{
              __html: `{
                "@context": "https://schema.org",
                "@type": ["Person", "Researcher"],
                "name": "Ahnaf An Nafee",
                "alternateName": ["Ahnaf", "ahnafnafee"],
                "url": "https://www.ahnafnafee.dev/",
                "image": {
                  "@type": "ImageObject",
                  "url": "https://ik.imagekit.io/8ieg70pvks/profile?tr=w-400,h-400",
                  "width": 400,
                  "height": 400
                },
                "description": "🚀 PhD Student in AI & 3D Graphics @ George Mason University. I operate at the intersection of AI 🧠, 3D Computer Graphics 🌐, and scalable Cloud Infrastructure ☁️. Building the next generation of intuitive and immersive ways for humans to interact with digital worlds.",
                "jobTitle": [
                  "PhD Student in Computer Science",
                  "AI Researcher",
                  "Computer Graphics Researcher", 
                  "DevOps Engineer",
                  "Software Engineer",
                  "Ex-CTO"
                ],
                "hasOccupation": [
                  {
                    "@type": "Occupation",
                    "name": "PhD Student in Computer Science",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "George Mason University",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Fairfax",
                        "addressRegion": "VA",
                        "addressCountry": "US"
                      }
                    },
                    "description": "Conducting cutting-edge research in AI and 3D Computer Graphics, focusing on novel approaches to human-computer interaction in immersive digital environments",
                    "skills": [
                      "Artificial Intelligence",
                      "Machine Learning",
                      "3D Computer Graphics",
                      "Computer Vision",
                      "Generative AI",
                      "Rendering Pipelines",
                      "Parameterized Shaders",
                      "Human Computer Interaction"
                    ]
                  },
                  {
                    "@type": "Occupation", 
                    "name": "DevOps Engineer",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "Mindex"
                    },
                    "description": "DevOps Engineer specializing in Kubernetes, OpenShift, cloud infrastructure, and observability systems",
                    "skills": [
                      "Kubernetes",
                      "OpenShift", 
                      "AWS",
                      "Docker",
                      "Terraform",
                      "CI/CD",
                      "Infrastructure as Code",
                      "Monitoring",
                      "Observability"
                    ]
                  }
                ],
                "knowsAbout": [
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Deep Learning", 
                  "3D Computer Graphics",
                  "Computer Vision",
                  "Generative AI",
                  "Rendering Pipelines",
                  "Parameterized Shaders",
                  "Kubernetes",
                  "OpenShift",
                  "Cloud Infrastructure",
                  "DevOps",
                  "Game Development",
                  "Unity",
                  "Unreal Engine",
                  "React Native",
                  "AWS",
                  "Docker",
                  "Python",
                  "Java",
                  "Kotlin",
                  "GoLang",
                  "Technical Leadership",
                  "Startup Management"
                ],
                "sameAs": [
                  "https://www.linkedin.com/in/ahnafnafee",
                  "https://github.com/ahnafnafee",
                ],
                "alumniOf": [
                  {
                    "@type": "University",
                    "name": "Drexel University",
                    "url": "https://drexel.edu/"
                  }
                ],
                "affiliation": {
                  "@type": "University", 
                  "name": "George Mason University",
                  "url": "https://www.gmu.edu/"
                },
                "worksFor": {
                  "@type": "Organization", 
                  "name": "George Mason University",
                  "url": "https://www.gmu.edu/"
                },
                "hasCredential": [
                  {
                    "@type": "EducationalOccupationalCredential",
                    "name": "PhD in Computer Science",
                    "educationalLevel": "Doctoral",
                    "credentialCategory": "degree",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "George Mason University"
                    }
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "name": "Bachelor of Science in Computer Science",
                    "educationalLevel": "Bachelor",
                    "credentialCategory": "degree",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "Drexel University"
                    }
                  }
                ],
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.ahnafnafee.dev"
                }
              }`
            }}
          />

          {/* PWA manifest */}
          <link rel='manifest' href='/manifest.json' />

          {/* Preconnect to external domains for performance */}
          <link rel='preconnect' href='https://ik.imagekit.io' />
          <link rel='preconnect' href='https://vercel.com' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
