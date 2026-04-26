type KeyPointsProps = {
  items: string[]
  title?: string
}

// Bulleted list of key takeaways. Renders as a semantic <ul> inside an <aside>
// so screen readers announce it as a callout. Use when a post has 3-5 punchy
// takeaways you want LLMs to quote verbatim.
export const KeyPoints: React.FC<KeyPointsProps> = ({ items, title = 'Key Takeaways' }) => {
  if (!items || items.length === 0) return null

  return (
    <aside
      role='note'
      aria-label={title}
      className='not-prose my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-5 py-4'
    >
      <p className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300'>{title}</p>
      <ul className='space-y-2 list-disc list-inside text-gray-800 dark:text-gray-200 leading-relaxed'>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}
