// Responsive column templates for the list family (frappe-ui/list).
//
// `<List :columns="{ base: […], md: […] }">` writes one inline custom property
// per supplied breakpoint (`--_list-columns-base`, `--_list-columns-md`, …).
// Those carriers mean nothing on their own: the rules built here are what turn
// them into the single resolved `--_list-columns` that rows and the header read.
//
// The rules have to be generated rather than shipped in the family's static
// `style.css` because the breakpoint names and widths belong to the *consuming
// app's* Tailwind config. An app that redefines `md` gets list columns that
// switch at the same width as its own `md:` visibility utilities, which is the
// whole point — a `md:hidden` cell and the track it lived in must disappear
// together.

const UNIT_PX = { px: 1, rem: 16, em: 16 }

// `base` is the required first tier of the prop, so it can never also name a
// screen; `DEFAULT` is Tailwind's own reserved key.
const RESERVED = new Set(['base', 'DEFAULT'])

/**
 * Screens that can drive a min-width media rule, ascending.
 *
 * Tailwind allows several screen shapes. Only ones with a min-width can join
 * the ladder — `raw` and max-width-only screens have no place in an ordering
 * that "applies upward until the next supplied breakpoint", so they are left
 * out and a `columns` key naming them simply never matches.
 *
 * @param {Record<string, unknown>} screens resolved `theme('screens')`
 * @returns {{ name: string, min: string }[]}
 */
export function listBreakpoints(screens = {}) {
  return Object.entries(screens)
    .filter(([name]) => !RESERVED.has(name))
    .map(([name, value]) => ({ name, min: minWidthOf(value) }))
    .filter((screen) => screen.min !== null)
    .map((screen) => ({ ...screen, px: toPixels(screen.min) }))
    .filter((screen) => screen.px !== null)
    .sort((a, b) => a.px - b.px)
    .map(({ name, min }) => ({ name, min }))
}

function minWidthOf(value) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return null // multi-range screens have no single floor
  if (value && typeof value === 'object' && typeof value.min === 'string') {
    // `{ min, max }` still has a floor; `{ max }` and `{ raw }` do not.
    return value.min
  }
  return null
}

function toPixels(length) {
  const match = /^(-?[\d.]+)(px|rem|em)$/.exec(length.trim())
  if (!match) return null
  const factor = UNIT_PX[match[2]]
  const number = Number(match[1])
  return Number.isFinite(number) ? number * factor : null
}

/**
 * Base-layer rules that resolve `--_list-columns` from the per-breakpoint
 * carriers.
 *
 * Two things happen on every list root, whether or not it has a `columns` prop:
 * every carrier is reset to `initial`, and `--_list-columns` is re-derived from
 * this root's own carriers. That is what gives each nested List its own
 * configuration — `initial` is the guaranteed-invalid value, so a root that set
 * nothing resolves `--_list-columns` to the guaranteed-invalid value too and the
 * use-site fallback (the default feed template) applies, instead of the value
 * inherited from an enclosing list.
 *
 * The selector is the bare attribute (0,1,0) rather than `:where()` (0,0,0) on
 * purpose: `frappe-ui/list`'s `style.css` carries a zero-specificity copy of the
 * base tier so the array form still works without this plugin, and the relative
 * source order of a package stylesheet and the app's Tailwind base layer is not
 * something either file can control. Winning on specificity is order-proof.
 *
 * @param {Record<string, unknown>} screens resolved `theme('screens')`
 */
export function listColumnRules(screens) {
  const breakpoints = listBreakpoints(screens)
  const root = { '--_list-columns-base': 'initial' }
  for (const { name } of breakpoints) {
    root[`--_list-columns-${name}`] = 'initial'
  }
  root['--_list-columns'] = 'var(--_list-columns-base)'

  const rules = { "[data-slot='list']": root }
  // Ascending, so a breakpoint's rule always follows the ones below it and wins
  // on source order where they overlap.
  breakpoints.forEach(({ name, min }, index) => {
    const ladder = breakpoints.slice(0, index + 1).map((screen) => screen.name)
    rules[`@media (min-width: ${min})`] = {
      "[data-slot='list']": { '--_list-columns': fallbackChain(ladder) },
    }
  })
  return rules
}

// `md` → `var(--_list-columns-md, var(--_list-columns-sm, var(--_list-columns-base)))`.
// An omitted breakpoint is guaranteed-invalid, so the chain falls through to the
// nearest lower supplied tier: each supplied array replaces the whole template
// and applies upward. Arrays are never merged track by track.
function fallbackChain(ladder) {
  // Ascending, so the highest tier ends up outermost and is tried first.
  return ladder.reduce(
    (fallback, name) => `var(--_list-columns-${name}, ${fallback})`,
    'var(--_list-columns-base)',
  )
}
