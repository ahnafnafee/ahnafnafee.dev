import { readDirectory } from '@/services/directory'

export const CONTENT_SECTIONS = ['/blog', '/portfolio', '/research'] as const

export function isContentSlug(slug: string): boolean {
  return slug.length <= 128 && slug.trim() === slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export async function isPublishedContentSlug(slug: string): Promise<boolean> {
  if (!isContentSlug(slug)) return false
  const directories = await Promise.all(CONTENT_SECTIONS.map((section) => readDirectory(section)))
  return directories.some((files) => files.includes(`${slug}.mdx`))
}
