import { buildFaqJsonLd, type FAQItem } from '@/libs/seo/faqSchema'

type FAQProps = {
  items: FAQItem[]
  title?: string
}

export const FAQ: React.FC<FAQProps> = ({ items, title = 'Frequently Asked Questions' }) => {
  if (!items || items.length === 0) return null

  const jsonLd = buildFaqJsonLd(items)

  return (
    <section className='not-prose my-12 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>{title}</h2>
      <dl className='space-y-6'>
        {items.map((item, idx) => (
          <div key={idx}>
            <dt className='mb-2 font-semibold text-gray-900 dark:text-gray-100'>{item.q}</dt>
            <dd className='leading-relaxed text-gray-700 dark:text-gray-300'>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
