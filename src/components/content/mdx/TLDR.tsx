type TLDRProps = {
  children: React.ReactNode
}

// Author-facing wrapper for the front-loaded summary at the top of a post.
// Front-loading is meaningful for AI search: roughly 44% of LLM citations come
// from the first 30% of a page, so this is the section most likely to be quoted.
export const TLDR: React.FC<TLDRProps> = ({ children }) => (
  <aside
    role='note'
    aria-label='Summary'
    className='not-prose my-8 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 px-5 py-4'
  >
    <p className='mb-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300'>TL;DR</p>
    <div className='text-gray-800 dark:text-gray-200 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0'>{children}</div>
  </aside>
)
