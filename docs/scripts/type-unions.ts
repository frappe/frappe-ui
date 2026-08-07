/**
 * Canonicalises the member order of every union in a printed type, so two
 * printings of the same type compare equal.
 *
 * TypeScript prints union members in the order its checker happened to resolve
 * them, and that order shifts with how much of the program is loaded — adding
 * an unrelated component folder can turn `"error" | "success" | "info"` into
 * `"error" | "info" | "success"`. The type is the same either way, so the
 * freshness check has to ignore it.
 *
 * This is used only to compare. The generated tables carry the order the source
 * declares, which reads better than alphabetical: `top | right | bottom | left`
 * rather than `bottom | left | right | top`.
 */

const BRACKET_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

// Walks a printed type from `start` (an opening bracket) to its matching
// closing bracket, skipping brackets inside string literals and the `>` of an
// arrow. Returns -1 if the brackets are unbalanced — slot types are truncated
// to 100 characters, so that happens.
function findMatchingBracket(type: string, start: number) {
  const stack: string[] = []
  let quote: string | null = null

  for (let i = start; i < type.length; i++) {
    const char = type[i]

    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '=' && type[i + 1] === '>') {
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      stack.push(BRACKET_PAIRS[char])
      continue
    }
    if (stack.length > 0 && char === stack[stack.length - 1]) {
      stack.pop()
      if (stack.length === 0) return i
    }
  }

  return -1
}

// Splits a printed type on the given separators, ignoring the ones nested in
// brackets or string literals. Parts keep their surrounding whitespace, and
// the separators are returned alongside so the caller can put them back.
function splitTopLevel(type: string, separators: string) {
  const parts: string[] = []
  const seps: string[] = []
  const stack: string[] = []
  let quote: string | null = null
  let current = ''

  for (let i = 0; i < type.length; i++) {
    const char = type[i]

    if (quote) {
      current += char
      if (char === '\\') current += type[++i] ?? ''
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      current += char
      continue
    }
    if (char === '=' && type[i + 1] === '>') {
      current += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      stack.push(BRACKET_PAIRS[char])
      current += char
      continue
    }
    if (stack.length > 0 && char === stack[stack.length - 1]) {
      stack.pop()
      current += char
      continue
    }
    if (stack.length === 0 && separators.includes(char)) {
      parts.push(current)
      seps.push(char)
      current = ''
      continue
    }

    current += char
  }

  parts.push(current)
  return { parts, seps }
}

// Drops every balanced bracket group so a member can be checked on its own
// syntax: `Record<string, number>` collapses to `Record`, which has nothing
// position-dependent left in it.
function stripBracketGroups(member: string) {
  let result = ''
  let quote: string | null = null

  for (let i = 0; i < member.length; i++) {
    const char = member[i]

    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === '=' && member[i + 1] === '>') {
      result += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      const end = findMatchingBracket(member, i)
      if (end === -1) {
        result += char
        continue
      }
      i = end
      continue
    }

    result += char
  }

  return result
}

// Only plain type references and literals get reordered. Anything with a
// parameter list, an object member or an arrow left after the bracket groups
// are stripped is a member whose position may carry meaning, so leave it.
function isReorderableUnionMember(member: string) {
  const trimmed = member.trim()
  return (
    trimmed.length > 0 && !/[:;,(){}<>=?]/.test(stripBracketGroups(trimmed))
  )
}

// Compare by code point rather than locale so the result does not depend on
// the machine's ICU data.
function compareCodePoints(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0
}

// An object member, tuple element or named parameter keeps its label where it
// is; only the type after the label is a union.
const MEMBER_LABEL = /^\s*(?:readonly\s+)?[A-Za-z_$][\w$]*\??\s*:\s*/

/**
 * The top-level members of a printed union, trimmed. A type that is not a union
 * comes back as a single member.
 */
export function splitUnionMembers(type: string): string[] {
  return splitTopLevel(type, '|').parts.map((part) => part.trim())
}

export function normalizeUnionOrder(type: string): string {
  const { parts, seps } = splitTopLevel(type, ',;')
  return parts
    .map(normalizePart)
    .reduce((acc, part, i) => acc + seps[i - 1] + part)
}

function normalizePart(part: string): string {
  const label = part.match(MEMBER_LABEL)?.[0] ?? ''
  const rest = part.slice(label.length)

  const members = splitTopLevel(rest, '|').parts.map(normalizeInsideBrackets)
  if (members.length < 2 || !members.every(isReorderableUnionMember)) {
    return label + members.join('|')
  }

  const leading = members[0].match(/^\s*/)![0]
  const trailing = members[members.length - 1].match(/\s*$/)![0]
  const sorted = members.map((m) => m.trim()).sort(compareCodePoints)
  return `${label}${leading}${sorted.join(' | ')}${trailing}`
}

function normalizeInsideBrackets(member: string) {
  let result = ''
  let quote: string | null = null

  for (let i = 0; i < member.length; i++) {
    const char = member[i]

    if (quote) {
      result += char
      if (char === '\\') result += member[++i] ?? ''
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      result += char
      continue
    }
    if (char === '=' && member[i + 1] === '>') {
      result += '=>'
      i++
      continue
    }
    if (BRACKET_PAIRS[char]) {
      const end = findMatchingBracket(member, i)
      if (end === -1) {
        result += char
        continue
      }
      result +=
        char + normalizeUnionOrder(member.slice(i + 1, end)) + member[end]
      i = end
      continue
    }

    result += char
  }

  return result
}
