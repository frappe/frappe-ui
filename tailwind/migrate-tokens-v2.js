/**
 * Espresso v2 token migration codemod.
 *
 * Renames old semantic token names (frappe-ui v0.1.278 era) to their espresso
 * v2 equivalents, per the "Frappe tokens v2 migration" mapping from design.
 * Works on any text occurrence of a token name — tailwind utilities
 * (`bg-surface-white`, `text-ink-red-2`, `border-outline-gray-modals`) and CSS
 * variables (`var(--surface-white)`) alike — so it can be pointed at app
 * codebases too.
 *
 *   Usage:  node tailwind/migrate-tokens-v2.js [--dry-run] <dir-or-file...>
 *
 * IMPORTANT: the replacement is single-pass/simultaneous. Several renames
 * chain (outline red-2→3, red-3→4, red-4→5); applying them sequentially would
 * cascade (red-2 ending up as red-5). Run this script exactly once per
 * codebase — the v2 scheme reuses names (e.g. surface-gray-5 exists in both
 * scales with different values), so a second run would double-shift tokens.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ---------- MAPPING ----------

// Per-category renames: old suffix → new suffix.
// `cards` / `gray-modals` are code-side legacy aliases of Figma's
// `card` / `gray-modal` — both spellings map to the same v2 token.
const shift = (families, pairs) =>
  Object.fromEntries(
    families.flatMap((f) => pairs.map(([from, to]) => [`${f}-${from}`, `${f}-${to}`])),
  )

const ACCENTS = ['red', 'blue', 'green', 'amber', 'violet']

const SURFACE_RENAMES = {
  white: 'base',
  'menu-bar': 'sidebar',
  card: 'elevation-1',
  cards: 'elevation-1',
  modal: 'elevation-2',
  selected: 'elevation-3',
  // legacy code-side token; resolved to the same values as elevation-3 in both modes
  'gray-2-contrast': 'elevation-3',
  ...shift(['gray'], [[5, 8], [6, 9], [7, 10]]),
  ...shift(ACCENTS, [[5, 7], [6, 8], [7, 9]]),
}

const INK_RENAMES = {
  white: 'base',
  ...shift(ACCENTS, [[2, 5], [3, 6], [4, 8]]),
}

const OUTLINE_RENAMES = {
  white: 'base',
  'gray-modal': 'elevation-2',
  'gray-modals': 'elevation-2',
  ...shift(['gray'], [[5, 7]]),
  ...shift(ACCENTS, [[2, 3], [3, 4], [4, 5]]),
}

// The alpha categories only kept their neutral ramps in v2.
const SURFACE_ALPHA_RENAMES = {
  white: 'base',
  'menu-bar': 'sidebar',
  card: 'elevation-1',
  cards: 'elevation-1',
  modal: 'elevation-2',
  selected: 'elevation-3',
  ...shift(['gray'], [[5, 8], [6, 9], [7, 10]]),
}

const OUTLINE_ALPHA_RENAMES = {
  white: 'base',
  'gray-modal': 'elevation-2',
  'gray-modals': 'elevation-2',
  ...shift(['gray'], [[5, 7]]),
}

// Full old token name → full new token name. NOTE: alpha categories must come
// before their base category when building the alternation so that e.g.
// `surface-alpha-gray-5` is never half-matched by a `surface-…` rule (the
// longest-first sort below also guarantees this).
export const TOKEN_RENAMES = {
  ...prefix('surface-alpha', SURFACE_ALPHA_RENAMES),
  ...prefix('outline-alpha', OUTLINE_ALPHA_RENAMES),
  ...prefix('surface', SURFACE_RENAMES),
  ...prefix('ink', INK_RENAMES),
  ...prefix('outline', OUTLINE_RENAMES),
}

// Tokens dropped in v2 with no replacement — usage is reported, never rewritten.
export const REMOVED_TOKENS = [
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => `surface-alpha-red-${n}`),
  ...[2, 3, 4].map((n) => `outline-alpha-red-${n}`),
]

// Legacy names with no v2 mapping decided yet — reported for manual review.
export const WATCH_TOKENS = []

function prefix(category, renames) {
  return Object.fromEntries(
    Object.entries(renames).map(([from, to]) => [
      `${category}-${from}`,
      `${category}-${to}`,
    ]),
  )
}

// ---------- REPLACEMENT ----------

// Token names are matched whole: not preceded by a letter/digit (a leading `-`
// is expected — `bg-surface-white`, `var(--surface-white)`) and not followed by
// anything that could extend the name (`gray-1` must not match in `gray-10`,
// `card` not in `cards`, `gray-modal` not in `gray-modals`,
// `surface-gray-2` not in `surface-gray-2-contrast`).
const byLengthDesc = (a, b) => b.length - a.length

const RENAME_REGEX = new RegExp(
  `(?<![a-zA-Z0-9])(${Object.keys(TOKEN_RENAMES).sort(byLengthDesc).join('|')})(?![a-zA-Z0-9-])`,
  'g',
)
const FLAG_REGEX = new RegExp(
  `(?<![a-zA-Z0-9])(${[...REMOVED_TOKENS, ...WATCH_TOKENS].sort(byLengthDesc).join('|')})(?![a-zA-Z0-9-])`,
  'g',
)

export function migrateTokens(content) {
  const replacements = []
  const migrated = content.replace(RENAME_REGEX, (match, _token, offset) => {
    const to = TOKEN_RENAMES[match]
    replacements.push({ from: match, to, line: lineAt(content, offset) })
    return to
  })

  const flagged = []
  for (const m of content.matchAll(FLAG_REGEX)) {
    flagged.push({ token: m[0], line: lineAt(content, m.index) })
  }

  return { migrated, replacements, flagged }
}

function lineAt(content, offset) {
  let line = 1
  for (let i = 0; i < offset; i++) if (content[i] === '\n') line++
  return line
}

// ---------- CLI ----------

const EXTENSIONS = new Set([
  '.vue', '.ts', '.tsx', '.js', '.jsx', '.md', '.css', '.scss', '.html',
])
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'cache', 'generated', 'espresso-v2-design-tokens',
])

function* walk(target) {
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    yield target
    return
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full)
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      yield full
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const targets = args.filter((a) => a !== '--dry-run')

  if (targets.length === 0) {
    console.error('Usage: node tailwind/migrate-tokens-v2.js [--dry-run] <dir-or-file...>')
    process.exit(1)
  }

  let filesChanged = 0
  let totalReplacements = 0
  const allFlagged = []

  for (const target of targets) {
    for (const file of walk(target)) {
      const content = fs.readFileSync(file, 'utf8')
      const { migrated, replacements, flagged } = migrateTokens(content)

      for (const f of flagged) allFlagged.push({ file, ...f })
      if (replacements.length === 0) continue

      filesChanged++
      totalReplacements += replacements.length
      if (dryRun) {
        console.log(`${file} (${replacements.length})`)
        for (const r of replacements) {
          console.log(`  L${r.line}: ${r.from} -> ${r.to}`)
        }
      } else {
        fs.writeFileSync(file, migrated)
        console.log(`${file} (${replacements.length})`)
      }
    }
  }

  console.log(
    `\n${dryRun ? '[dry-run] would update' : 'Updated'} ${filesChanged} files, ${totalReplacements} replacements`,
  )

  if (allFlagged.length > 0) {
    console.log('\n⚠ Tokens needing manual attention (removed in v2 or unmapped):')
    for (const f of allFlagged) {
      console.log(`  ${f.file}:L${f.line}  ${f.token}`)
    }
  }
}

const isCLI = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isCLI) main()
