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
 * It also merges weight classes: a `text-<size>` + `font-<weight>` in the same
 * static class list collapses to the combined `text-<size>-<weight>` style
 * class, which carries the correct per-weight letter-spacing (see
 * `mergeWeightClasses`).
 *
 *   Usage:  node tailwind/migrate-tokens-v2.js [--dry-run] [--force] <dir-or-file...>
 *
 * IMPORTANT: the token replacement is single-pass/simultaneous. Several renames
 * chain (outline red-2→3, red-3→4, red-4→5); applying them sequentially would
 * cascade (red-2 ending up as red-5). Run this script exactly once per
 * codebase — the v2 scheme reuses names (e.g. surface-gray-5 exists in both
 * scales with different values), so a second run would double-shift tokens. As
 * a guard, the script refuses to run on a codebase that looks already migrated
 * (v2-only tokens present, no pre-v2 tokens); pass --force to override.
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

// ---------- TYPOGRAPHY SIZE RENAMES ----------

// The espresso text scale gained 15px (`lg`) and 17px (`2xl`) stops, pushing
// every size from the old `lg` (16px) upward by two names. Each physical size
// keeps its meaning under a new name, so existing utility classes must be
// renamed to render identically (old `text-lg`/16px → `text-xl`, etc.). These
// chain (lg→xl, xl→3xl, …) and so MUST run in the same single simultaneous pass
// as the color renames below — a sequential pass would cascade.
//
// Caveat: these names (`text-lg` … `text-9xl`) coincide with stock Tailwind
// font-size utilities, so only point this at code using the espresso scale, and
// run exactly once (see header).
const TEXT_SIZE_SHIFT = [
  ['lg', 'xl'],
  ['xl', '3xl'],
  ['2xl', '4xl'],
  ['3xl', '5xl'],
  ['4xl', '6xl'],
  ['5xl', '7xl'],
  ['6xl', '8xl'],
  ['7xl', '9xl'],
  ['8xl', '10xl'],
  ['9xl', '11xl'],
  ['10xl', '12xl'],
  ['11xl', '13xl'],
  ['12xl', '14xl'],
  ['13xl', '15xl'],
  ['14xl', '16xl'],
  ['15xl', '17xl'],
]

// Each size surfaces as three utility forms: the size utility (`text-lg`), the
// paragraph variant (`text-p-lg`), and the medium-weight component class
// (`text-lg-medium`). All three shift together.
const TEXT_SIZE_RENAMES = Object.fromEntries(
  TEXT_SIZE_SHIFT.flatMap(([from, to]) => [
    [`text-${from}`, `text-${to}`],
    [`text-p-${from}`, `text-p-${to}`],
    [`text-${from}-medium`, `text-${to}-medium`],
  ]),
)

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
  ...TEXT_SIZE_RENAMES,
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

// ---------- WEIGHT-CLASS MERGE ----------

// Collapse a `text-<size>` and a `font-<weight>` that co-occur in the same
// static class list into the combined `text-<size>-<weight>` style class — the
// canonical way to express a weighted text style now that letter-spacing is
// tracked per weight (so `text-base font-medium` is NOT equivalent to
// `text-base-medium`). The two need not be adjacent; classes in between
// (`px-2 text-sm font-medium text-ink-gray-7`) are preserved, and color
// utilities like `text-ink-gray-7` are never mistaken for a size.
//
// Only *static* `class="…"` / `className="…"` attributes are touched. Dynamic
// `:class` / `v-bind:class` and conditional weights are skipped on purpose:
// merging a conditionally-applied weight into an unconditional size would be
// wrong. A class list with more than one size or more than one weight is
// ambiguous and left untouched.
const WEIGHT_SUFFIX = {
  'font-medium': 'medium',
  'font-semibold': 'semibold',
  'font-bold': 'bold',
  'font-extrabold': 'black',
  'font-normal': '', // regular — drop the weight; the bare `text-<size>` is regular
}

const TEXT_SIZES = [
  'tiny', '2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
  '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl', '13xl', '14xl', '15xl',
  '16xl', '17xl',
]
const SIZE_CLASS = new RegExp(`^text-(?:p-)?(?:${TEXT_SIZES.join('|')})$`)

// Static class/className attribute value — not `:class` / `v-bind:class` (the
// negative lookbehind rejects a preceding `:` or `-`).
const CLASS_ATTR = /(?<![:\w-])(class(?:Name)?)(\s*=\s*)(["'])([^"']*)\3/g

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Whole-token matcher within a space-separated class list (consumes one leading
// space so removing a mid-list token doesn't leave a double space).
const tokenRe = (tok) => new RegExp(`(?:^|\\s)${escapeRe(tok)}(?=\\s|$)`)

export function mergeWeightClasses(content) {
  const merges = []
  const migrated = content.replace(CLASS_ATTR, (full, name, eq, quote, value, offset) => {
    const words = value.split(/\s+/).filter(Boolean)
    const sizes = words.filter((w) => SIZE_CLASS.test(w))
    const weights = words.filter((w) => w in WEIGHT_SUFFIX)
    if (sizes.length !== 1 || weights.length !== 1) return full

    const size = sizes[0]
    const weight = weights[0]
    const suffix = WEIGHT_SUFFIX[weight]
    const merged = suffix ? `${size}-${suffix}` : size

    const newValue = value
      .replace(new RegExp(`(^|\\s)${escapeRe(size)}(?=\\s|$)`), (m, pre) => `${pre}${merged}`)
      .replace(tokenRe(weight), '')
    merges.push({ from: `${size} + ${weight}`, to: merged, line: lineAt(content, offset) })
    return `${name}${eq}${quote}${newValue}${quote}`
  })
  return { migrated, merges }
}

// ---------- ALREADY-MIGRATED DETECTION ----------

// Tokens that exist ONLY pre-migration (renamed away) vs ONLY post-migration. A
// codebase with the post-migration names and none of the pre-migration ones has
// almost certainly been migrated already — and re-running is destructive (the
// color renames reuse names, so a second pass double-shifts them).
const PRE_MIGRATION_TOKENS = [
  'surface-white', 'ink-white', 'outline-white', 'surface-menu-bar',
  'surface-card', 'surface-cards', 'surface-modal', 'surface-selected',
  'outline-gray-modal', 'outline-gray-modals',
]
const POST_MIGRATION_TOKENS = [
  'surface-base', 'ink-base', 'outline-base', 'surface-sidebar',
  'surface-elevation-1', 'surface-elevation-2', 'surface-elevation-3',
  'outline-elevation-2',
]
const sentinelRegex = (tokens) =>
  new RegExp(`(?<![a-zA-Z0-9])(?:${tokens.slice().sort(byLengthDesc).join('|')})(?![a-zA-Z0-9-])`, 'g')
const PRE_REGEX = sentinelRegex(PRE_MIGRATION_TOKENS)
const POST_REGEX = sentinelRegex(POST_MIGRATION_TOKENS)

function detectAlreadyMigrated(files) {
  let pre = 0
  let post = 0
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    pre += (content.match(PRE_REGEX) || []).length
    post += (content.match(POST_REGEX) || []).length
  }
  return { pre, post, likelyMigrated: post > 0 && pre === 0 }
}

export function migrateTokens(content) {
  const replacements = []
  let migrated = content.replace(RENAME_REGEX, (match, _token, offset) => {
    const to = TOKEN_RENAMES[match]
    replacements.push({ from: match, to, line: lineAt(content, offset) })
    return to
  })

  // Merge weight classes on the post-rename text so `text-lg font-medium`
  // becomes `text-xl-medium` (size shift first, then merge).
  const { migrated: weightMerged, merges } = mergeWeightClasses(migrated)
  migrated = weightMerged

  const flagged = []
  for (const m of content.matchAll(FLAG_REGEX)) {
    flagged.push({ token: m[0], line: lineAt(content, m.index) })
  }

  return { migrated, replacements, merges, flagged }
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
  const force = args.includes('--force')
  const targets = args.filter((a) => !a.startsWith('--'))

  if (targets.length === 0) {
    console.error('Usage: node tailwind/migrate-tokens-v2.js [--dry-run] [--force] <dir-or-file...>')
    process.exit(1)
  }

  const files = []
  for (const target of targets) for (const file of walk(target)) files.push(file)

  // Guard against a destructive second pass (the color renames reuse names).
  const { pre, post, likelyMigrated } = detectAlreadyMigrated(files)
  if (likelyMigrated) {
    console.warn('\n⚠  This codebase looks ALREADY MIGRATED to espresso v2.')
    console.warn(`   Found ${post} v2-only token(s) and 0 pre-v2 token(s).`)
    console.warn('   This migration is NOT idempotent — the color renames reuse names,')
    console.warn('   so a second pass would double-shift tokens (e.g. surface-gray-5 → -8 → -11).')
    if (!force && !dryRun) {
      console.warn('   Refusing to run. Pass --force to override, or --dry-run to preview.\n')
      process.exit(2)
    }
    console.warn(dryRun ? '   (--dry-run: previewing only.)\n' : '   (--force: proceeding anyway.)\n')
  }

  let filesChanged = 0
  let totalReplacements = 0
  let totalMerges = 0
  const allFlagged = []

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const { migrated, replacements, merges, flagged } = migrateTokens(content)

    for (const f of flagged) allFlagged.push({ file, ...f })
    const changeCount = replacements.length + merges.length
    if (changeCount === 0) continue

    filesChanged++
    totalReplacements += replacements.length
    totalMerges += merges.length
    if (dryRun) {
      console.log(`${file} (${changeCount})`)
      for (const r of replacements) console.log(`  L${r.line}: ${r.from} -> ${r.to}`)
      for (const m of merges) console.log(`  L${m.line}: ${m.from} => ${m.to}`)
    } else {
      fs.writeFileSync(file, migrated)
      console.log(`${file} (${changeCount})`)
    }
  }

  console.log(
    `\n${dryRun ? '[dry-run] would update' : 'Updated'} ${filesChanged} files, ` +
      `${totalReplacements} token renames, ${totalMerges} weight-class merges`,
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
