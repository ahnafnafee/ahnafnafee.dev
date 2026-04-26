type Area = {
  label: string
  dotClass: string
}

const AREAS: Area[] = [
  { label: 'AI for 3D Graphics', dotClass: 'bg-blue-500' },
  { label: 'Mesh Simplification', dotClass: 'bg-rose-400' },
  { label: 'Geometric Processing', dotClass: 'bg-cyan-400' },
  { label: 'ML for Graphics', dotClass: 'bg-emerald-300' },
  { label: '3D Content Generation', dotClass: 'bg-amber-400' }
]

export const ResearchAreas: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <h2 className='mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase md:text-base dark:border-gray-800 dark:text-gray-400'>
        Research Areas
      </h2>
      <ul className='flex flex-wrap gap-2'>
        {AREAS.map((area) => (
          <li
            key={area.label}
            className='dark:bg-theme-800 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-xs dark:border-gray-800 dark:text-gray-200'
          >
            <span aria-hidden='true' className={`size-2 rounded-full ${area.dotClass}`} />
            {area.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
