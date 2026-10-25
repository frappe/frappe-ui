/**
 * How well `text` matches `query`, lower is better. Case-insensitive.
 *
 * 0: exact match, or an empty query
 * 1: `text` starts with the query
 * 2: a word in `text` starts with the query (words split on anything that is
 *    not a letter or digit)
 * 3: any other match
 */
export function rankMatch(text: string, query: string): number {
  const normalizedText = text.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  if (!normalizedQuery || normalizedText === normalizedQuery) return 0
  if (normalizedText.startsWith(normalizedQuery)) return 1
  const words = normalizedText.split(/[^\p{L}\p{N}]+/u)
  if (words.some((word) => word.startsWith(normalizedQuery))) return 2
  return 3
}
