// HowTo schema is eligible for the "how-to" rich result on Google Search and is
// frequently cited by AI search engines for step-by-step queries. Use it on
// tutorial-style posts (build-this, set-up-that, scrape-that) where the body
// follows a clear ordered sequence.

export type HowToStep = {
  name: string
  text: string
  image?: string
  url?: string
}

export type HowToSchemaInput = {
  name: string
  description?: string
  totalTime?: string // ISO 8601 duration, e.g. PT30M
  image?: string
  steps: HowToStep[]
}

export function buildHowToJsonLd(input: HowToSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.totalTime && { totalTime: input.totalTime }),
    ...(input.image && { image: input.image }),
    step: input.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
      ...(s.image && { image: s.image }),
      ...(s.url && { url: s.url })
    }))
  }
}
