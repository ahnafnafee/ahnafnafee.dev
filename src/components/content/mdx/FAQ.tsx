import { buildFaqJsonLd, type FAQItem } from '@/libs/seo/faqSchema'

type FAQProps = {
  items: FAQItem[]
  title?: string
}

export const FAQ: React.FC<FAQProps> = ({ items, title = 'Frequently Asked Questions' }) => {
  if (!items || items.length === 0) return null

  const jsonLd = buildFaqJsonLd(items)

  return (
    <section className='not-prose my-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-6'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{title}</h2>
      <dl className='space-y-6'>
        {items.map((item, idx) => (
          <div key={idx}>
            <dt className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{item.q}</dt>
            <dd className='text-gray-700 dark:text-gray-300 leading-relaxed'>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
