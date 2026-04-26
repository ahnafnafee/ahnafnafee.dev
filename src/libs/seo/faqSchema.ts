// FAQPage schema is heavily cited by AI search engines (ChatGPT, Perplexity,
// Google AI Overviews). Use it for evergreen Q&A sections inside long-form
// posts. Pair with the <FAQ> MDX component.

export type FAQItem = {
  q: string
  a: string
}

export function buildFaqJsonLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }
}
