const AREAS = [
  'AI for 3D Graphics',
  'Mesh Simplification',
  'Geometric Processing',
  'ML for Graphics',
  '3D Content Generation'
]

export const ResearchAreas: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <h2 className='mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase md:text-base dark:border-gray-800 dark:text-gray-400'>
        Research Areas
      </h2>
      <div className='flex flex-wrap items-center gap-2'>
        {AREAS.map((label) => (
          <span
            key={label}
            className='rounded-sm bg-gray-200 px-2 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300'
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
