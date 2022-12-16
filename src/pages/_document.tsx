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
