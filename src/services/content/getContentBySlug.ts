import { readFile } from 'fs/promises'
import { relative, resolve } from 'path'

import { LOCATION_DIR, readDirectory } from '@/services/directory'

import { CONTENT_SECTIONS, isContentSlug } from './slugs'

import matter from 'gray-matter'

type GetContentBySlug<T> = { content: string; header: { slug: string } & T }

export const getContentBySlug = async <T>(
  /** the path to the directory folder, example: `/blog`
   * **NOTE!** that the slash on the string is required!
   */
  path: string,
  /**
   * read as file name
   */
  slug: string
): Promise<GetContentBySlug<T>> => {
  if (!CONTENT_SECTIONS.some((section) => section === path) || !isContentSlug(slug)) {
    throw new Error('Invalid content slug or section')
  }

  const filename = `${slug}.mdx`
  const root = resolve(LOCATION_DIR, path.slice(1))
  const dir = resolve(root, filename)
  if (relative(root, dir) !== filename || !(await readDirectory(path)).includes(filename)) {
    throw new Error('Content not found')
  }

  const file = await readFile(dir, 'utf8')

  // parse file content with gray matter, extract it's header and content
  const { content, data } = matter(file)

  return {
    header: { ...(data as T), slug },
    content
  }
}
