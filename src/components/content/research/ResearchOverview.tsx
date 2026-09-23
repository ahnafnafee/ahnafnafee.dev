import { SectionHeading } from './SectionHeading'

export const ResearchOverview: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <SectionHeading>Overview</SectionHeading>
      <p className='mb-4 text-base leading-7 text-gray-700 dark:text-gray-300'>
        My main research sits at the intersection of artificial intelligence and 3D computer graphics. I study how
        machine learning can augment graphics pipelines, from geometric processing to 3D content generation. Alongside
        that work, I investigate how to evaluate learned systems under the conditions in which people actually use them,
        including full-catalog recommendation.
      </p>
      <div className='rounded-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-gray-800/60 dark:to-gray-800/40'>
        <p className='mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase dark:text-gray-200'>
          Research focus
        </p>
        <ul className='space-y-1 text-sm leading-6 text-gray-700 md:text-base md:leading-7 dark:text-gray-300'>
          <li>
            <strong className='text-gray-900 dark:text-gray-100'>AI-driven creative workflows</strong> for 3D content
            generation.
          </li>
          <li>
            <strong className='text-gray-900 dark:text-gray-100'>Machine learning for graphics pipelines</strong> —
            automating UV mapping, NPR techniques, and modeling workflows.
          </li>
          <li>
            <strong className='text-gray-900 dark:text-gray-100'>Human-computer interaction</strong> in immersive
            environments.
          </li>
          <li>
            <strong className='text-gray-900 dark:text-gray-100'>Reliable recommendation</strong> through temporal
            evaluation, transparent baselines, and failure-aware routing.
          </li>
        </ul>
      </div>
    </section>
  )
}
