import { LOCATION_DIR, readDirectory } from '@/services'

import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { join } from 'path'

export type GetContentHeader<T> = { header: { slug: string } & T }

/**
 * Reads only the frontmatter for every entry under `path` and discards the
 * MDX body. Use this when a caller needs slugs, titles, dates, etc. but does
 * not need to render or count the content (e.g. prev/next nav, sitemap walks,
 * search indexes). Avoids holding ~tens of KB of MDX strings in memory per
 * post on every render that consumes the list.
 */
export const getContentHeaders = async <T>(path: string): Promise<Array<GetContentHeader<T>>> => {
  const fileContents = await readDirectory(path)

  const files = fileContents.map(async (p) => {
    const dir = join(`${LOCATION_DIR}/${path}`, p)
    const file = await readFile(dir, 'utf8')
    const { data } = matter(file)

    return {
      header: {
        ...(data as T),
        slug: p.replace('.mdx', '')
      }
    }
  })

  return Promise.all(files)
}
