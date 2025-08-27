/**
 * Utility function to generate URLs with base path for university deployment
 * In static export mode, we need to manually add the base path for proper routing
 */
export function createUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // In static export mode, we need to manually add the base path
  // This is only needed for university deployment
  if (typeof process !== 'undefined' && process.env.STATIC_EXPORT === 'true' && process.env.BASE_PATH) {
    return `${process.env.BASE_PATH}${normalizedPath}`
  }

  return normalizedPath
}
