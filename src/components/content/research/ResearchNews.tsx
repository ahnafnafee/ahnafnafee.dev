import { NewsTimeline } from '@/components/content/news'

import { NEWS } from '@/data/news'

// Thin wrapper preserved for the existing import in `src/app/research/page.tsx`.
// All rendering + collapse logic lives in `NewsTimeline`. The shared `NEWS` array
// in `src/data/news.tsx` is the single source of truth for both this surface
// and the home-page condensed view.
export const ResearchNews: React.FunctionComponent = () => <NewsTimeline items={NEWS} id='news' />
