import { SectionHeading } from './SectionHeading'

export const ResearchOverview: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <SectionHeading>Overview</SectionHeading>
      <p className='text-base leading-7 text-gray-700 dark:text-gray-300'>
        My work sits at the intersection of artificial intelligence and 3D computer graphics. I focus on how machine
        learning can accelerate and augment traditional graphics pipelines — particularly mesh simplification, geometric
        processing, and AI-driven 3D content generation. I&apos;m drawn to questions about how digital geometry and
        learned models can co-exist in production-grade rendering and content workflows.
      </p>
    </section>
  )
}
