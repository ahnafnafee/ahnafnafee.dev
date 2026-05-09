import { SectionHeading } from './SectionHeading'

export const ResearchOverview: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <SectionHeading>Overview</SectionHeading>
      <p className='mb-4 text-base leading-7 text-gray-700 dark:text-gray-300'>
        My work sits at the intersection of artificial intelligence and 3D computer graphics. I focus on how machine
        learning can accelerate and augment traditional graphics pipelines — particularly mesh simplification, geometric
        processing, and AI-driven 3D content generation. I&apos;m drawn to questions about how digital geometry and
        learned models can co-exist in production-grade rendering and content workflows.
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
        </ul>
      </div>
    </section>
  )
}
