import { buildHowToJsonLd, type HowToSchemaInput } from '@/libs/seo/howToSchema'

type HowToProps = HowToSchemaInput & {
  title?: string
}

export const HowTo: React.FC<HowToProps> = ({ name, description, totalTime, image, steps, title }) => {
  if (!steps || steps.length === 0) return null

  const jsonLd = buildHowToJsonLd({ name, description, totalTime, image, steps })

  return (
    <section className='not-prose my-12 rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-900/50 dark:bg-purple-900/10'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>{title ?? name}</h2>
      {description && <p className='mb-4 text-gray-700 dark:text-gray-300'>{description}</p>}
      {totalTime && (
        <p className='mb-6 text-xs font-bold tracking-wider text-purple-700 uppercase dark:text-purple-300'>
          Time required: {totalTime}
        </p>
      )}
      <ol className='list-inside list-decimal space-y-5'>
        {steps.map((step, idx) => (
          <li key={idx} className='text-gray-800 dark:text-gray-200'>
            <span className='font-semibold'>{step.name}</span>
            <p className='mt-1 ml-6 leading-relaxed text-gray-700 dark:text-gray-300'>{step.text}</p>
            {step.url && (
              <a
                href={step.url}
                className='mt-1 ml-6 inline-block text-sm text-purple-600 hover:underline dark:text-purple-400'
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
