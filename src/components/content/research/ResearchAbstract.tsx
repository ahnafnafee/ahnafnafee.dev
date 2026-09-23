type ResearchAbstractProps = {
  abstract: string
}

export const ResearchAbstract: React.FunctionComponent<ResearchAbstractProps> = ({ abstract }) => {
  return (
    <section
      aria-labelledby='abstract-heading'
      className='not-prose border-border bg-card my-2 rounded-xl border p-5 md:p-6'
    >
      <div className='mb-3 flex items-center gap-3'>
        <span aria-hidden='true' className='h-0.5 w-7 rounded-full bg-purple-500' />
        <h2
          id='abstract-heading'
          className='m-0 text-sm font-bold tracking-[0.14em] text-purple-700 uppercase dark:text-purple-300'
        >
          Abstract
        </h2>
      </div>
      <p className='text-card-foreground m-0 text-sm leading-7 md:text-base'>{abstract.trim()}</p>
    </section>
  )
}
