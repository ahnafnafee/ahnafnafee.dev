/** Encode JSON for an HTML script body, including inline JavaScript strings. */
export function serializeJsonForHtml(value: unknown): string {
  const json = JSON.stringify(value)
  if (json === undefined) throw new TypeError('Expected a JSON-serializable value')
  return json
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
