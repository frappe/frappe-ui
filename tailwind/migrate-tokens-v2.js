#!/usr/bin/env node
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
 *   Usage:  tokens-v2 [--dry-run] [--force] <dir-or-file...>
 *
 * IMPORTANT: the token replacement is single-pass/simultaneous. Several renames
 * chain (outline red-2→3, red-3→4, red-4→5); applying them sequentially would
 * cascade (red-2 ending up as red-5). Color renames must run exactly once per
 * codebase — the v2 scheme reuses names (e.g. surface-gray-5 exists in both
 * scales with different values), so a second full run would double-shift tokens.
 * As a guard, the script detects already-migrated codebases and runs only the
 * typography correction (`text-lg` → `text-md`, `text-xl` → `text-lg`, ...).
 * Pass --force to run the full migration anyway.
 *
 * `tiny` and `13xl`-`16xl` were dropped as unused vocabulary in a pre-1.0
 * audit (#940) — no utility ships for them anymore. A class that would have
 * shifted onto one of them is left untouched and reported under "needs
 * manual attention" instead of being rewritten to a dead class.
 *
 * Radius aliases (`rounded`, `rounded-sm/md/lg/xl/2xl`, and their directional
 * forms) were removed in 1.0.0 per ADR-0006. The codemod renames them to the
 * numbered tokens (`rounded-4`, `rounded-1/5/6/7/8`). These renames are
 * idempotent and run in every mode. `rounded-none` and `rounded-full` are
 * kept tokens and stay untouched. The bare word `rounded` is also plain
 * English, so it is only rewritten in class-like contexts (inside a quoted
 * string or an `@apply` rule) — prose and comments keep their words.
 *
 * A codebase that already ran BOTH the color migration and the typography
 * correction must not run either again (both shift names). Pass
 * --radius-only there: it runs only the (idempotent) radius renames and the
 * removed-token report.
 *
 * The `text-<size>-black` style classes were removed in 1.0.0 (#998, zero
 * usage; the Figma weights behind them were corrupt export data). Existing
 * `text-*-black` usage is flagged, never renamed, and a `font-extrabold` /
 * `font-black` next to a text size is flagged instead of merged.
 *
 * --ink-shift (#1016): the updated espresso v2 Figma export shifts every
 * chromatic ink scale down one level (new `ink-red-1` = old `ink-red-2`;
 * `ink-gray` is its own 9-step scale and does NOT shift). This mode renames
 * `ink-<family>-N` → `ink-<family>-(N-1)` for N in 2..10, chromatic families
 * only, and runs NOTHING else — no color renames, no typography, no radius,
 * no weight merges. Like the color migration, there is no sentinel that can
 * tell whether the shift already ran (`ink-red-5` is a valid name on both
 * sides), so --ink-shift MUST run exactly once per codebase — a second run
 * would double-shift. --ink-shift takes directory targets only; a real run
 * writes a `.tokens-v2-ink-shift` marker file in each target directory and
 * refuses to run again while one exists there, in any ancestor directory,
 * or anywhere in the target subtree. Symlinks that leave the target subtree
 * are skipped and reported, never rewritten — an external package must be
 * migrated directly so it gets its own marker.
 * Old `ink-<family>-1` (the neutral-white step) has no
 * automatic destination (the new `-1` is a light tint, not white); it is
 * flagged for manual attention, never rewritten.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const USAGE = 'Usage: tokens-v2 [--dry-run] [--force] [--radius-only | --ink-shift] <dir-or-file...>'

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

// The espresso text scale gained 15px (`md`) and 17px (`xl`) stops. Each
// physical size keeps its meaning under a new name, so existing utility classes
// must be renamed to render identically. These chain and so MUST run in a single
// simultaneous pass — a sequential pass would cascade.
//
// Caveat: these names (`text-lg` … `text-9xl`) coincide with stock Tailwind
// font-size utilities, so only point this at code using the espresso scale, and
// run exactly once (see header).

// `tiny` and `13xl`-`16xl` were removed as unused vocabulary in #940 — no
// utility ships for them anymore. Must stay in sync with `DROPPED_SIZES` in
// `figma-tokens-to-theme.js`. Filtered out of the shift tables below so the
// codemod can never *rename a class onto one of these dead sizes*; see the
// "no destination" handling further down for reporting pre-existing usage.
const DEAD_SIZES = ['tiny', '13xl', '14xl', '15xl', '16xl']

const UNMIGRATED_TEXT_SIZE_SHIFT_ALL = [
  ['xl', '2xl'],
  ['2xl', '3xl'],
  ['3xl', '4xl'],
  ['4xl', '5xl'],
  ['5xl', '6xl'],
  ['6xl', '7xl'],
  ['7xl', '8xl'],
  ['8xl', '9xl'],
  ['9xl', '10xl'],
  ['10xl', '11xl'],
  ['11xl', '12xl'],
  ['12xl', '13xl'],
  ['13xl', '14xl'],
  ['14xl', '15xl'],
  ['15xl', '16xl'],
]
// Old-scale `12xl`-`15xl` would have shifted onto a size dropped in #940 —
// capped here so they're left untouched (and flagged, see below) instead of
// renamed to a class that no longer emits CSS.
const UNMIGRATED_TEXT_SIZE_SHIFT = UNMIGRATED_TEXT_SIZE_SHIFT_ALL.filter(
  ([, to]) => !DEAD_SIZES.includes(to),
)

// Apps that already ran the original v2 codemod use the temporary typography
// names where `text-lg` was 15px and `text-xl` was 16px. Shift those one step
// down into the corrected names without touching color tokens.
const MIGRATED_TEXT_SIZE_SHIFT_ALL = [
  ['lg', 'md'],
  ['xl', 'lg'],
  ['2xl', 'xl'],
  ['3xl', '2xl'],
  ['4xl', '3xl'],
  ['5xl', '4xl'],
  ['6xl', '5xl'],
  ['7xl', '6xl'],
  ['8xl', '7xl'],
  ['9xl', '8xl'],
  ['10xl', '9xl'],
  ['11xl', '10xl'],
  ['12xl', '11xl'],
  ['13xl', '12xl'],
  ['14xl', '13xl'],
  ['15xl', '14xl'],
  ['16xl', '15xl'],
  ['17xl', '16xl'],
]
// Temp-scale `14xl`-`17xl` would have corrected onto a size dropped in #940 —
// capped for the same reason as above.
const MIGRATED_TEXT_SIZE_SHIFT = MIGRATED_TEXT_SIZE_SHIFT_ALL.filter(
  ([, to]) => !DEAD_SIZES.includes(to),
)

// Each size surfaces as a bare size utility, a paragraph variant, and weighted
// component classes. All forms shift together. `-black` is absent on purpose:
// the black style classes were removed in #998, so a `text-*-black` is never
// renamed — it's flagged (see BLACK_STYLE_TOKENS below).
const textSizeRenames = (shift) => Object.fromEntries(
  shift.flatMap(([from, to]) => [
    [`text-${from}`, `text-${to}`],
    [`text-p-${from}`, `text-p-${to}`],
    [`text-${from}-medium`, `text-${to}-medium`],
    [`text-p-${from}-medium`, `text-p-${to}-medium`],
    [`text-${from}-semibold`, `text-${to}-semibold`],
    [`text-p-${from}-semibold`, `text-p-${to}-semibold`],
    [`text-${from}-bold`, `text-${to}-bold`],
    [`text-p-${from}-bold`, `text-p-${to}-bold`],
  ]),
)

const UNMIGRATED_TEXT_SIZE_RENAMES = textSizeRenames(UNMIGRATED_TEXT_SIZE_SHIFT)
const MIGRATED_TEXT_SIZE_RENAMES = textSizeRenames(MIGRATED_TEXT_SIZE_SHIFT)

// ---------- RADIUS RENAMES ----------

// ADR-0006 / #998: the named radius aliases are removed in 1.0.0 in favor of
// the numbered scale. The map is deterministic (bare `rounded` = 8px =
// `rounded-4`; sm→1, md→5, lg→6, xl→7, 2xl→8). `rounded-none` and
// `rounded-full` are kept tokens, never touched. Unlike the color renames,
// these are idempotent (no numbered token appears on the left), so they run in
// every mode.
const RADIUS_STEP_BY_ALIAS = { sm: '1', md: '5', lg: '6', xl: '7', '2xl': '8' }
const RADIUS_BARE_STEP = '4'
// Every side prefix Tailwind derives from the borderRadius scale, including
// the 3.3+ logical sides. Numbered directional utilities (`rounded-t-6`,
// `rounded-ss-1`, …) exist for all of them.
const RADIUS_SIDES = ['t', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl', 's', 'e', 'ss', 'se', 'es', 'ee']

export const RADIUS_RENAMES = {}
for (const side of RADIUS_SIDES.map((s) => `-${s}`)) {
  // Bare directional alias: `rounded-t` = `rounded-t-4`. (The side-less bare
  // `rounded` is also plain English — see BARE_ROUNDED_REGEX below.)
  RADIUS_RENAMES[`rounded${side}`] = `rounded${side}-${RADIUS_BARE_STEP}`
}
for (const side of ['', ...RADIUS_SIDES.map((s) => `-${s}`)]) {
  for (const [alias, step] of Object.entries(RADIUS_STEP_BY_ALIAS)) {
    RADIUS_RENAMES[`rounded${side}-${alias}`] = `rounded${side}-${step}`
  }
}

// The bare `rounded` utility is an ordinary English word ("values are rounded
// to px"), so a global text rename would corrupt prose and comments. It is
// rewritten only in class-like contexts — see isClassContext().
const BARE_ROUNDED_REGEX = /(?<![a-zA-Z0-9])rounded(?![a-zA-Z0-9-])/g

// A bare `rounded` at `offset` counts as a class when its line puts it inside
// a quoted string (class attributes, JS class lists, template literals) or in
// an `@apply` rule. Prose in markdown and comments has neither. Known gap: a
// class list inside a multi-line template literal has no quote on its own
// line and is skipped — grep for bare `rounded` after running the codemod.

// An apostrophe inside a word (`row's`, `it's`) is not a string delimiter —
// without this, `// the row's corners are rounded when it's hovered` would
// count as "inside quotes" and get rewritten.
const stripContractions = (s) => s.replace(/(?<=\w)'(?=\w)/g, '')

function isClassContext(content, offset) {
  const lineStart = content.lastIndexOf('\n', offset - 1) + 1
  const lineEndIdx = content.indexOf('\n', offset)
  const lineEnd = lineEndIdx === -1 ? content.length : lineEndIdx
  const before = content.slice(lineStart, offset)
  const after = content.slice(offset, lineEnd)
  if (/@apply[^;]*$/.test(before)) return true
  for (const quote of ['"', "'", '`']) {
    const b = quote === "'" ? stripContractions(before) : before
    const a = quote === "'" ? stripContractions(after) : after
    const opensBefore = (b.split(quote).length - 1) % 2 === 1
    if (opensBefore && a.includes(quote)) return true
  }
  return false
}

// Full old token name → full new token name. NOTE: alpha categories must come
// before their base category when building the alternation so that e.g.
// `surface-alpha-gray-5` is never half-matched by a `surface-…` rule (the
// longest-first sort below also guarantees this).
export const COLOR_TOKEN_RENAMES = {
  ...prefix('surface-alpha', SURFACE_ALPHA_RENAMES),
  ...prefix('outline-alpha', OUTLINE_ALPHA_RENAMES),
  ...prefix('surface', SURFACE_RENAMES),
  ...prefix('ink', INK_RENAMES),
  ...prefix('outline', OUTLINE_RENAMES),
}

export const TOKEN_RENAMES = {
  ...COLOR_TOKEN_RENAMES,
  ...UNMIGRATED_TEXT_SIZE_RENAMES,
  ...RADIUS_RENAMES,
}

// Radius renames are idempotent, so they also run when the color/typography
// migration is already done.
const MIGRATED_MODE_RENAMES = {
  ...MIGRATED_TEXT_SIZE_RENAMES,
  ...RADIUS_RENAMES,
}

// The full text-size vocabulary ever seen by the codemod (live, dead, and
// temp-scale names). Used for weight merging and the black-style flag list.
const TEXT_SIZES = [
  'tiny', '2xs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl',
  '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl', '13xl', '14xl',
  '15xl', '16xl', '17xl',
]

// A dead size surfaces as a bare size utility and weighted component classes
// (no `text-p-*` form — paragraph styles only ever went up to `4xl` and never
// had a `tiny`, so those combinations never existed).
const deadSizeTokens = (sizes) => sizes.flatMap((s) => [
  `text-${s}`, `text-${s}-medium`, `text-${s}-semibold`, `text-${s}-bold`, `text-${s}-black`,
])

// #998: the black weight styles were removed with zero usage. Any literal
// `text-*-black` is dead in every mode — flagged, never renamed.
const BLACK_STYLE_TOKENS = TEXT_SIZES.flatMap((s) => [
  `text-${s}-black`,
  `text-p-${s}-black`,
])

// Tokens dropped in v2 with no replacement — usage is reported, never rewritten.
export const REMOVED_TOKENS = [
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => `surface-alpha-red-${n}`),
  ...[2, 3, 4].map((n) => `outline-alpha-red-${n}`),
  // #940: dead in every mode — either the v2 name directly, or (for `tiny`,
  // which never shifted) the only name it ever had.
  ...deadSizeTokens(DEAD_SIZES),
  ...BLACK_STYLE_TOKENS,
]

// Old-scale `12xl` is only dead in *unmigrated* content: there it's the size
// that used to shift onto the now-dead v2 `13xl` (see the capped shift table
// above). In already-migrated content, literal `text-12xl` is the healthy,
// current v2 name and must not be flagged.
const UNMIGRATED_REMOVED_TOKENS = [...REMOVED_TOKENS, ...deadSizeTokens(['12xl'])]
// The migrated-temp-scale `17xl` never shipped as a real token in any mode —
// it only ever existed as the pre-correction name that used to correct onto
// the now-dead v2 `16xl`.
const MIGRATED_REMOVED_TOKENS = [...REMOVED_TOKENS, ...deadSizeTokens(['17xl'])]

// Legacy names with no v2 mapping decided yet — reported for manual review.
export const WATCH_TOKENS = []

// ---------- INK SCALE SHIFT (#1016) ----------

// The updated espresso v2 export drops the neutral-white `-1` step from every
// chromatic ink scale, so each level moves down one (new `-1` = old `-2`, …,
// new `-9` = old `-10`; the scales now end at `-9`). `ink-gray` keeps its own
// 9-step scale and does not shift. The shift is bounded to N=2..10 with
// whole-token maps on purpose: an unbounded numeric rewrite would corrupt a
// stale non-v2 token like `ink-blue-600` into `ink-blue-599`.
const CHROMATIC_INK_FAMILIES = [
  'red', 'green', 'blue', 'amber', 'violet', 'yellow', 'orange', 'teal',
  'cyan', 'purple', 'pink',
]

export const INK_SHIFT_RENAMES = prefix(
  'ink',
  shift(CHROMATIC_INK_FAMILIES, [
    [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 7], [9, 8], [10, 9],
  ]),
)

// Old `ink-<family>-1` was neutral/white in both themes. The new `-1` is a
// light tint (100), and rewriting the token text to `white` would corrupt
// `var(--ink-red-1)` into `var(--white)` (which doesn't exist) — so these are
// flagged for manual attention, never rewritten.
export const INK_SHIFT_FLAGGED_TOKENS = CHROMATIC_INK_FAMILIES.map(
  (f) => `ink-${f}-1`,
)

// `ink-red-5` is a valid name before and after the shift, so file content
// cannot reveal a prior run. A marker file anchored to the migrated target
// (not the caller's working directory — the codemod is often run from
// elsewhere with an explicit path) is the only guard against a silent
// double-shift.
export const INK_SHIFT_MARKER = '.tokens-v2-ink-shift'

// Search the directory and every ancestor: a run on a repo root must also
// block a later run on one of its subdirectories.
// `ignore` holds the markers this run wrote itself. The claim-then-verify
// pass searches again after writing, and must not stop on its own marker.
export function findInkShiftMarker(dir, { ignore = new Set() } = {}) {
  // realpath, not resolve: a symlink alias must share the identity of its
  // target, or it bypasses the guard.
  let current = fs.realpathSync(dir)
  for (;;) {
    const file = path.join(current, INK_SHIFT_MARKER)
    if (fs.existsSync(file) && !ignore.has(file)) return file
    const parent = path.dirname(current)
    if (parent === current) return null
    current = parent
  }
}

// True when a real path is one of the roots or sits inside one.
function isInsideRoots(real, roots) {
  return roots.some((r) => real === r || real.startsWith(r + path.sep))
}

// Search the subtree: a run on a subdirectory must also block a later run on
// its parent, or the already-shifted subtree double-shifts. Mirrors walk()'s
// directory skip list and its symlink rule — the search must cover exactly
// what the run would rewrite. A link out of the target subtrees is skipped:
// walk() does not rewrite it, so a marker there belongs to another codebase
// and must not block this run.
export function findInkShiftMarkerBelow(
  dir,
  { roots = null, seenDirs = new Set(), ignore = new Set() } = {},
) {
  const resolved = fs.realpathSync(dir)
  const bounds = roots ?? [resolved]
  if (seenDirs.has(resolved)) return null
  seenDirs.add(resolved)
  const file = path.join(resolved, INK_SHIFT_MARKER)
  if (fs.existsSync(file) && !ignore.has(file)) return file
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(resolved, entry.name)
    let isDirectory = entry.isDirectory()
    if (!isDirectory && entry.isSymbolicLink()) {
      try {
        isDirectory = fs.statSync(full).isDirectory()
      } catch {
        continue // broken symlink
      }
      if (isDirectory && !isInsideRoots(fs.realpathSync(full), bounds)) continue
    }
    if (!isDirectory) continue
    const found = findInkShiftMarkerBelow(full, { roots: bounds, seenDirs, ignore })
    if (found) return found
  }
  return null
}

// `wx` fails when the file exists, so the create is the claim. Reading the
// guard and then writing leaves a window in which two concurrent runs both
// pass and both shift the same files; an exclusive create closes it for the
// target directories. Nested targets (a root run against a subdirectory run)
// still race — the ancestor and subtree searches cannot be atomic — which is
// why the guide says to run the shift once, per package root.
export function writeInkShiftMarker(dir) {
  fs.writeFileSync(
    path.join(dir, INK_SHIFT_MARKER),
    `The ink scale shift (tokens-v2 --ink-shift, #1016) ran here on ${new Date().toISOString()}.\n` +
      'A second run would double-shift every chromatic ink token.\n' +
      'Delete this file only to re-run the shift on purpose.\n',
    { flag: 'wx' },
  )
}

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

const renameRegexFor = (renames) => new RegExp(
  `(?<![a-zA-Z0-9])(${Object.keys(renames).sort(byLengthDesc).join('|')})(?![a-zA-Z0-9-])`,
  'g',
)
const buildFlagRegex = (tokens) => new RegExp(
  `(?<![a-zA-Z0-9])(${[...tokens, ...WATCH_TOKENS].sort(byLengthDesc).join('|')})(?![a-zA-Z0-9-])`,
  'g',
)
// Which "no replacement" tokens to flag depends on mode — see the `12xl` /
// `17xl` note above. Radius-only content is presumed migrated (a literal
// `text-12xl` there is the healthy v2 name), so it shares the migrated list.
const FULL_FLAG_REGEX = buildFlagRegex(UNMIGRATED_REMOVED_TOKENS)
const MIGRATED_FLAG_REGEX = buildFlagRegex(MIGRATED_REMOVED_TOKENS)
// Ink-shift mode flags only the destination-less `ink-<family>-1` tokens —
// the v1→v2 removed-token report belongs to the other modes.
const INK_SHIFT_FLAG_REGEX = buildFlagRegex(INK_SHIFT_FLAGGED_TOKENS)
const flagRegexFor = (mode) => {
  if (mode === 'ink-shift') return INK_SHIFT_FLAG_REGEX
  return mode === 'full' ? FULL_FLAG_REGEX : MIGRATED_FLAG_REGEX
}

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
  'font-normal': '', // regular — drop the weight; the bare `text-<size>` is regular
}

// #998 removed the `text-*-black` styles, so the black-ish weight utilities
// have no style class to merge onto. A size + one of these is flagged for
// manual attention instead of merged (`font-extrabold` was the old merge
// source for `-black`; `font-black` is Tailwind's 900, which never had an
// espresso style).
const BLACK_WEIGHT_CLASSES = ['font-extrabold', 'font-black']
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
  const flagged = []
  const migrated = content.replace(CLASS_ATTR, (full, name, eq, quote, value, offset) => {
    const words = value.split(/\s+/).filter(Boolean)
    const sizes = words.filter((w) => SIZE_CLASS.test(w))
    const weights = words.filter((w) => w in WEIGHT_SUFFIX)
    const blacks = words.filter((w) => BLACK_WEIGHT_CLASSES.includes(w))
    if (sizes.length === 1 && blacks.length > 0) {
      // Would have merged onto a removed `text-*-black` class — flag instead.
      flagged.push({
        token: `${sizes[0]} + ${blacks[0]}`,
        line: lineAt(content, offset),
      })
      return full
    }
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
  return { migrated, merges, flagged }
}

// ---------- ALREADY-MIGRATED DETECTION ----------

// Tokens that exist ONLY pre-migration (renamed away) vs ONLY post-migration. A
// codebase with post-migration names has almost certainly been migrated already
// or partially. Re-running color renames is destructive because the color
// renames reuse names, so default to typography-only when v2 sentinels exist.
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

export function detectMigrationState(files) {
  let pre = 0
  let post = 0
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    pre += (content.match(PRE_REGEX) || []).length
    post += (content.match(POST_REGEX) || []).length
  }
  return { pre, post, likelyMigrated: post > 0 }
}

export function getMigrationMode(
  { likelyMigrated },
  { force = false, radiusOnly = false, inkShift = false } = {},
) {
  if (inkShift) return 'ink-shift'
  if (radiusOnly) return 'radius-only'
  return likelyMigrated && !force ? 'migrated-typography' : 'full'
}

const RENAMES_BY_MODE = {
  full: TOKEN_RENAMES,
  'migrated-typography': MIGRATED_MODE_RENAMES,
  'radius-only': RADIUS_RENAMES,
  'ink-shift': INK_SHIFT_RENAMES,
}

export function migrateTokens(content, { mode = 'full' } = {}) {
  const tokenRenames = RENAMES_BY_MODE[mode]
  const renameRegex = renameRegexFor(tokenRenames)
  const replacements = []
  let migrated = content.replace(renameRegex, (match, _token, offset) => {
    const to = tokenRenames[match]
    replacements.push({ from: match, to, line: lineAt(content, offset) })
    return to
  })

  // Bare `rounded` → `rounded-4`, class contexts only (see isClassContext).
  // Not in ink-shift mode — that mode runs ONLY the ink scale shift.
  if (mode !== 'ink-shift') {
    migrated = migrated.replace(BARE_ROUNDED_REGEX, (match, offset) => {
      if (!isClassContext(migrated, offset)) return match
      const to = `rounded-${RADIUS_BARE_STEP}`
      replacements.push({ from: match, to, line: lineAt(migrated, offset) })
      return to
    })
  }

  let merges = []
  const flagged = []
  if (mode === 'full') {
    // Merge weight classes on the post-rename text so `text-xl font-medium`
    // becomes `text-2xl-medium` (size shift first, then merge).
    const result = mergeWeightClasses(migrated)
    migrated = result.migrated
    merges = result.merges
    flagged.push(...result.flagged)
  }

  for (const m of content.matchAll(flagRegexFor(mode))) {
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

// Symlinks — directories and files alike — are followed only while their real
// path stays inside one of the run's target subtrees. A link to an external
// package is skipped and reported instead of rewritten: rewriting it would
// leave it without a run-once marker of its own, and a later direct
// --ink-shift run on that package would double-shift it. `ctx.seenDirs` is the
// cycle guard — an internal link back to an ancestor must not recurse forever.
function makeWalkContext(targets) {
  return {
    roots: targets.map((t) => fs.realpathSync(t)),
    seenDirs: new Set(),
    externals: [],
  }
}

function* walk(target, ctx = makeWalkContext([target])) {
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    yield target
    return
  }
  const real = fs.realpathSync(target)
  if (ctx.seenDirs.has(real)) return
  ctx.seenDirs.add(real)
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name)
    let isDirectory = entry.isDirectory()
    if (entry.isSymbolicLink()) {
      let real
      try {
        real = fs.realpathSync(full)
        isDirectory = fs.statSync(full).isDirectory()
      } catch {
        continue // broken symlink
      }
      // Only links the run would otherwise rewrite are worth reporting.
      const wouldRewrite = isDirectory
        ? !SKIP_DIRS.has(entry.name)
        : EXTENSIONS.has(path.extname(entry.name))
      if (wouldRewrite && !isInsideRoots(real, ctx.roots)) {
        ctx.externals.push(full)
        continue
      }
    }
    if (isDirectory) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full, ctx)
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      yield full
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  const help = args.includes('--help') || args.includes('-h')
  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')
  const radiusOnly = args.includes('--radius-only')
  const inkShift = args.includes('--ink-shift')
  const targets = args.filter((a) => !a.startsWith('--'))

  if (help) {
    console.log(USAGE)
    return
  }

  // --ink-shift is a separate run-once pass — mixing it with the v1→v2
  // migration flags would hide which renames ran.
  if (inkShift && (force || radiusOnly)) {
    console.error('--ink-shift cannot be combined with --force or --radius-only.')
    console.error(USAGE)
    process.exit(1)
  }

  if (targets.length === 0) {
    console.error(USAGE)
    process.exit(1)
  }

  // Dedupe by real path: overlapping targets (`src src/components`) or a
  // symlink alias of one must not process a shared file once per target — in
  // ink-shift mode a second pass is a double-shift.
  const files = []
  const seenFiles = new Set()
  const walkCtx = makeWalkContext(targets)
  for (const target of targets) {
    for (const file of walk(target, walkCtx)) {
      const resolved = fs.realpathSync(file)
      if (seenFiles.has(resolved)) continue
      seenFiles.add(resolved)
      files.push(file)
    }
  }

  // Guard against a destructive second full pass (the color renames reuse names).
  const { pre, post, likelyMigrated } = detectMigrationState(files)
  const mode = getMigrationMode({ likelyMigrated }, { force, radiusOnly, inkShift })
  // realpath so a symlink alias and its target share one identity.
  const inkShiftMarkerDirs =
    mode === 'ink-shift' ? [...new Set(targets.map((t) => fs.realpathSync(t)))] : []
  if (mode === 'ink-shift') {
    // The marker records "this subtree shifted" — a file target would make it
    // over-claim the whole directory, so only directory targets are allowed.
    const fileTarget = inkShiftMarkerDirs.find((t) => !fs.statSync(t).isDirectory())
    if (fileTarget) {
      console.error(`\n✗  --ink-shift takes directory targets only, got a file: ${fileTarget}`)
      console.error(`   The ${INK_SHIFT_MARKER} run-once marker guards a directory subtree.\n`)
      process.exit(1)
    }
    const marker =
      inkShiftMarkerDirs.map((d) => findInkShiftMarker(d)).find(Boolean) ||
      inkShiftMarkerDirs
        .map((d) => findInkShiftMarkerBelow(d, { roots: inkShiftMarkerDirs }))
        .find(Boolean)
    // Both branches print this. Keep one source and let each pass its writer;
    // two copies drift.
    const printVendoredHint = (write) => {
      write('   If the marker sits in a vendored copy outside node_modules, targeting')
      write(`   any ancestor of it finds it again — target directories that do not contain ${marker}.\n`)
    }
    if (marker && !dryRun) {
      console.error(`\n✗  ${marker} found: --ink-shift already ran on this target.`)
      console.error('   A second run would double-shift every chromatic ink token.')
      console.error('   Delete the marker only to re-run the shift on purpose.')
      printVendoredHint(console.error)
      process.exit(1)
    }
    if (marker) {
      console.warn(`\n⚠  ${marker} found: --ink-shift already ran on this target.`)
      console.warn('   A real run would double-shift and will refuse to start.')
      printVendoredHint(console.warn)
    } else {
      console.warn('\n⚠  Ink scale shift (#1016): this must run exactly once per codebase.')
      console.warn(
        dryRun
          ? `   A real run writes a ${INK_SHIFT_MARKER} marker file in each target directory; --dry-run writes nothing.\n`
          : `   A ${INK_SHIFT_MARKER} marker file in each target directory will record this run.\n`,
      )
    }
  }
  if (likelyMigrated && !radiusOnly && !inkShift) {
    console.warn('\n⚠  This codebase looks already or partially migrated to espresso v2.')
    console.warn(`   Found ${post} v2-only token(s) and ${pre} pre-v2 token(s).`)
    if (force) {
      console.warn('   --force set: running the full migration anyway. Color tokens may double-shift.\n')
    } else {
      if (pre > 0) {
        console.warn(`   ${pre} pre-v2 color token(s) will be left untouched.`)
        console.warn('   Pass --force to run the color migration too. Review carefully: color tokens may double-shift.')
      }
      console.warn('   Running only the typography correction (`text-lg` → `text-md`, ...) and the radius renames.')
      console.warn('   Already ran the typography correction too? Use --radius-only instead.\n')
    }
  }

  // Write the markers BEFORE any file rewrite so an interrupted run fails
  // closed: the retry refuses instead of double-shifting the files that were
  // already rewritten. Recovery: restore with git, delete the marker, re-run.
  if (mode === 'ink-shift' && !dryRun) {
    // All or nothing: a marker write that fails leaves no rewrite behind it,
    // so the markers already written must go too. Keeping them would refuse a
    // retry on targets that never shifted.
    const written = []
    const rollBack = () => {
      for (const file of written) {
        try {
          fs.unlinkSync(file)
        } catch {
          console.error(`   Could not remove ${file} — delete it before you re-run.`)
        }
      }
    }
    try {
      for (const dir of inkShiftMarkerDirs) {
        writeInkShiftMarker(dir)
        written.push(path.join(dir, INK_SHIFT_MARKER))
      }
    } catch (err) {
      rollBack()
      if (err.code === 'EEXIST') {
        console.error(`\n✗  Another --ink-shift run claimed ${err.path} first.`)
        console.error('   No file was rewritten here. Let that run finish.\n')
      } else {
        console.error(`\n✗  Could not write the ${INK_SHIFT_MARKER} marker: ${err.message}`)
        console.error('   No file was rewritten. Fix the permission and re-run.\n')
      }
      process.exit(1)
    }

    // Claim, then verify. An exclusive create only serialises runs on the SAME
    // directory. Nested targets — a repo root against one of its
    // subdirectories — claim different directories, so both could pass the
    // first check. Searching again after the claim finds the other run's
    // marker, which the first check could not have seen. Both runs may abort;
    // that is the safe outcome, because neither has rewritten a file yet.
    const ours = new Set(written)
    const rival =
      inkShiftMarkerDirs.map((d) => findInkShiftMarker(d, { ignore: ours })).find(Boolean) ||
      inkShiftMarkerDirs
        .map((d) => findInkShiftMarkerBelow(d, { roots: inkShiftMarkerDirs, ignore: ours }))
        .find(Boolean)
    if (rival) {
      rollBack()
      console.error(`\n✗  ${rival} appeared while this run was claiming its targets.`)
      console.error('   Another --ink-shift run overlaps this one. No file was rewritten.')
      console.error('   Let it finish, then re-run only what is still unshifted.\n')
      process.exit(1)
    }

    console.log(
      `Wrote ${INK_SHIFT_MARKER} in ${inkShiftMarkerDirs.join(', ')} — it blocks an accidental second run.\n`,
    )
  }

  let filesChanged = 0
  let totalReplacements = 0
  let totalMerges = 0
  const allFlagged = []

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const { migrated, replacements, merges, flagged } = migrateTokens(content, { mode })

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
      `${totalReplacements} token renames, ${totalMerges} weight-class merges` +
      (mode === 'migrated-typography' ? ' (typography correction + radius renames)' : '') +
      (mode === 'radius-only' ? ' (radius renames only)' : '') +
      (mode === 'ink-shift' ? ' (ink scale shift only)' : ''),
  )

  if (allFlagged.length > 0) {
    console.log('\n⚠ Tokens needing manual attention (removed in v2 or unmapped):')
    for (const f of allFlagged) {
      console.log(`  ${f.file}:L${f.line}  ${f.token}`)
    }
  }

  if (walkCtx.externals.length > 0) {
    console.log('\n⚠ Symlinks to external packages were NOT migrated:')
    for (const link of walkCtx.externals) {
      console.log(`  ${link} -> ${fs.realpathSync(link)}`)
    }
    console.log('  Run the codemod on each real package root directly.')
  }
}

const scriptPath = fileURLToPath(import.meta.url)
const invokedPath = process.argv[1]
const isCLI = invokedPath && fs.realpathSync(invokedPath) === fs.realpathSync(scriptPath)
if (isCLI) main()
