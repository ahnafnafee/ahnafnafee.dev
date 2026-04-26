type Area = {
  label: string
  className: string
}

const AREAS: Area[] = [
  {
    label: 'AI for 3D Graphics',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200'
  },
  {
    label: 'Mesh Simplification',
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200'
  },
  {
    label: 'Geometric Processing',
    className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-200'
  },
  {
    label: 'ML for Graphics',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
  },
  {
    label: '3D Content Generation',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200'
  }
]

export const ResearchAreas: React.FunctionComponent = () => {
  return (
    <section className='mb-10 md:mb-12'>
      <h2 className='mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase md:text-base dark:border-gray-800 dark:text-gray-400'>
        Research Areas
      </h2>
      <div className='flex flex-wrap items-center gap-2'>
        {AREAS.map((area) => (
          <span
            key={area.label}
            className={`rounded-sm px-2 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase ${area.className}`}
          >
            {area.label}
          </span>
        ))}
      </div>
    </section>
  )
}
