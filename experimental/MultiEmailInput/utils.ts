// Row + sizing class helpers shared with the built-in selection components, so
// MultiEmailInput's dropdown rows match Combobox / MultiSelect exactly.
export {
  inputFontSizeClasses,
  itemClasses,
  itemRootSizeClasses,
  toItemListSize,
} from '../../src/components/shared/selection/utils'

/**
 * Practical email validation, copied verbatim from Zod v4
 * (`packages/zod/src/v4/core/regexes.ts`). Rejects a leading dot and consecutive
 * dots, and requires a dotted domain with a 2+ character TLD. Kept as a flat,
 * anchored `RegExp` literal so other variants can be added Zod-style later.
 */
export const emailRegex: RegExp =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

/** Default validator for typed addresses. */
export function isValidEmail(value: string): boolean {
  return emailRegex.test(value.trim())
}

/**
 * Split a free-text blob into candidate tokens on comma, semicolon, newline and
 * tab, keeping a quoted display name intact so `"Doe, John" <a@b.com>` (which
 * contains a comma inside quotes) stays one token. Plain spaces are NOT
 * separators for that reason — paste a comma/newline-separated list.
 */
export function splitEmailTokens(input: string): string[] {
  const parts: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of input) {
    if (char === '"') {
      inQuotes = !inQuotes
      current += char
    } else if (
      (char === ',' ||
        char === ';' ||
        char === '\n' ||
        char === '\r' ||
        char === '\t') &&
      !inQuotes
    ) {
      if (current.trim()) parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

/** Reduce a `Name <email>` token to the bare address. */
export function extractEmail(token: string): string {
  const match = token.match(/<([^>]+)>/)
  return (match ? match[1] : token).trim()
}
