import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html lang='en-US'>
        <Head>
          <link rel='preload' href='/fonts/inter-var-latin.woff2' as='font' type='font/woff2' crossOrigin='true' />
          <link href='/static/favicons/favicon.ico' rel='shortcut icon' />
          <link href='/static/favicons/apple-touch-icon.png' rel='apple-touch-icon' sizes='180x180' />
          <link href='/static/favicons/favicon-32x32.png' rel='icon' sizes='32x32' type='image/png' />
          <link href='/static/favicons/favicon-16x16.png' rel='icon' sizes='16x16' type='image/png' />
          <link color='#18181b' href='/static/favicons/safari-pinned-tab.svg' rel='mask-icon' />
          <meta content='#18181b' name='theme-color' />
          <meta content='#18181b' name='msapplication-TileColor' />
          <meta content='/static/favicons/browserconfig.xml' name='msapplication-config' />
          <meta content='follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1' name='robots' />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: `{"@context":"http://schema.org","@type":"Person","image":"https://ik.imagekit.io/8ieg70pvks/profile","name":"Ahnaf An Nafee","alternateName":"Ahnaf","url":"https://www.ahnafnafee.dev/","jobTitle":["Software Engineer","Frontend Engineer","Front-End Developer","Web Developer","Game Developer"],"hasOccupation":{"@type":"Occupation","name":"Software Engineer","occupationLocation":{"@type":"City","name":"Philadelphia"},"description":"Develops mobile and web applications and websites using JavaScript, TypeScript, React, React Native and HTML5.","skills":"HTML5, CSS, JavaScript, React, React Native, Sass, Node.js, Express.js, Next.js, JavaScript Frameworks, Git, Github, NPM, SEO, CMS, Java, Spring Boot, PostgreSQL, E-Commerce, AWS","alternateName":["Frontend Developer","Full Stack Developer","Frontend Engineer"],"responsibilities":["App Development","Web Design","Website Development","JavaScript Development","Backend Development","CMS Development","Frontend Development","Full Stack Development","Online Marketing","SEO Services","Web Developer","Website Maintenance"]},"sameAs":["http://linkedin.com/in/ahnafnafee","http://twitter.com/ahnaf_nafee","https://github.com/ahnafnafee"],"brand":[{"@type":"Brand","name":"Software Engineer","alternateName":"Front-End Engineer"},{"@type":"Brand","name":"Ahnaf","alternateName":"Ahnaf An Nafee"}],"memberOf":[{"@type":"Organization","url":"https://dynasty11.com/","name":"Dynasty 11","alternateName":"Dynasty 11 Studios"},{"@type":"Organization","url":"https://phlcollective.com/","name":"PHL Collective","alternateName":"PHL"}],"homeLocation":{"@type":"City","name":"Philadelphia"},"alumniOf":{"@type":"University","url":"https://www.drexel.edu/","name":"Drexel University"},"birthDate":"1999-12-26"}`
            }}
          />
          <link rel='manifest' href='/manifest.json' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
