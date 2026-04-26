import { buildHowToJsonLd, type HowToSchemaInput } from '@/libs/seo/howToSchema'

type HowToProps = HowToSchemaInput & {
  title?: string
}

export const HowTo: React.FC<HowToProps> = ({ name, description, totalTime, image, steps, title }) => {
  if (!steps || steps.length === 0) return null

  const jsonLd = buildHowToJsonLd({ name, description, totalTime, image, steps })

  return (
    <section className='not-prose my-12 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 p-6'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>{title ?? name}</h2>
      {description && <p className='text-gray-700 dark:text-gray-300 mb-4'>{description}</p>}
      {totalTime && (
        <p className='text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-6'>
          Time required: {totalTime}
        </p>
      )}
      <ol className='space-y-5 list-decimal list-inside'>
        {steps.map((step, idx) => (
          <li key={idx} className='text-gray-800 dark:text-gray-200'>
            <span className='font-semibold'>{step.name}</span>
            <p className='mt-1 ml-6 text-gray-700 dark:text-gray-300 leading-relaxed'>{step.text}</p>
            {step.url && (
              <a
                href={step.url}
                className='ml-6 mt-1 inline-block text-sm text-purple-600 dark:text-purple-400 hover:underline'
              >
                Reference →
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
