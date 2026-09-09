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
//
// Keeping that promise means copying what Tailwind does with `screens`, in two
// places, rather than assuming every screen is a min-width:
//
//   1. The condition. A tier is emitted under the same media query Tailwind's
//      own variant for that screen uses, so the tier applies exactly where
//      `<screen>:hidden` applies. A screen can be a width (`'768px'`), a band
//      that ends (`{ min, max }`), a ceiling (`{ max }`), any media query at
//      all (`{ raw }`), or an array of those.
//   2. The order, which is what decides the winner where two screens match at
//      the same time. Tailwind sorts screen variants by min-width only when
//      every screen is a plain string in one unit; with an object screen or
//      mixed units it cannot sort them and leaves them in the order the config
//      declares. Same here, so the tier that wins is always the one whose
//      utilities win.

// `base` is the required first tier of the prop, so it can never also name a
// screen; `DEFAULT` is Tailwind's own reserved key.
const RESERVED = new Set(['base', 'DEFAULT'])

/**
 * The screens a `columns` key can name, lowest priority first.
 *
 * A screen is dropped only when it has no condition to emit at all (`{}`), or
 * when its name is reserved. Every other shape gets a tier.
 *
 * @param {Record<string, unknown> | string[]} screens resolved `theme('screens')`
 * @returns {{ name: string, media: string }[]}
 */
export function listScreens(screens = {}) {
  const normalized = normalizeScreens(screens)
  const tiers = normalized
    .filter(({ name }) => !RESERVED.has(name))
    .map(({ name, values }) => ({
      name,
      media: buildMediaQuery(values),
      min: values[0]?.min,
    }))
    .filter(({ media }) => media !== '')
  // Sortable screens are all plain widths in one unit, so `parseFloat` orders
  // them the way Tailwind orders its own `min-width` variants. Anything else
  // keeps declaration order — Tailwind's own fallback.
  if (sortsByWidth(screens, normalized)) {
    tiers.sort((a, z) => parseFloat(a.min) - parseFloat(z.min))
  }
  return tiers.map(({ name, media }) => ({ name, media }))
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
 * Each screen then gets one media rule that copies its carrier into a tier var,
 * `--_list-tier-<screen>`. That indirection is what lets a tier stop: outside
 * the screen's media query nothing declares the tier var, so it stays
 * guaranteed-invalid and the chain falls through to the next tier down, exactly
 * as if that tier had never been supplied. A tier is live where its screen
 * matches and nowhere else — which is the definition of the screen's own
 * variants — so bands, ceilings and raw queries all work without the resolved
 * template ever disagreeing with the utilities. Priority is carried by the
 * nesting of the chain rather than by the source order of the media rules, so
 * overlapping screens resolve the same way whatever order they are emitted in.
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
  const tiers = listScreens(screens)
  const root = { '--_list-columns-base': 'initial' }
  for (const { name } of tiers) {
    root[`--_list-columns-${name}`] = 'initial'
  }
  // Ascending priority, so the highest-priority tier ends up outermost in the
  // chain and is tried first. An unsupplied tier is guaranteed-invalid, and so
  // is a supplied one whose screen does not currently match, so the chain lands
  // on the highest live tier and falls to `base` when none is:
  // `var(--_list-tier-md, var(--_list-tier-sm, var(--_list-columns-base)))`.
  // Each supplied array replaces the whole template; arrays are never merged
  // track by track.
  root['--_list-columns'] = tiers.reduce(
    (fallback, { name }) => `var(--_list-tier-${name}, ${fallback})`,
    'var(--_list-columns-base)',
  )
  // Every key the chain above actually reads, published so the component can
  // check a `columns` object against it. A key naming no screen writes a
  // carrier no rule reads, so its template never applies and the list silently
  // stays on the tier below — and `<List>` cannot see the app's Tailwind config
  // to catch that itself. Reading the resolved style is the only route, so the
  // names go out as a custom property. `--_list` prefix: internal, like the
  // carriers it describes, and read by nothing in production (List.vue's check
  // is behind `import.meta.env.DEV`).
  root['--_list-screens'] = ['base', ...tiers.map(({ name }) => name)].join(' ')

  const rules = { "[data-slot='list']": root }
  for (const { name, media } of tiers) {
    // Two screens can share one condition (`{ sm: '640px', tablet: '640px' }`),
    // so declarations merge into the block instead of replacing it.
    const query = (rules[`@media ${media}`] ??= { "[data-slot='list']": {} })
    // No reset for the tier vars: this declaration lands on *every* list root
    // whenever the screen matches, and nothing declares them when it doesn't,
    // so a tier can never carry across from an enclosing list. On a nested root
    // it resolves against that root's own reset carrier.
    query["[data-slot='list']"][`--_list-tier-${name}`] =
      `var(--_list-columns-${name})`
  }
  return rules
}

// The shapes `screens` accepts, flattened to the one Tailwind normalizes them
// to: `{ name, values: [{ min, max, raw }] }`. Mirrors Tailwind's own
// `normalizeScreens`, including naming an array entry after its own value.
function normalizeScreens(screens) {
  const entries = Array.isArray(screens)
    ? screens.map((screen) => [String(screen), screen])
    : Object.entries(screens ?? {})
  return entries.map(([name, value]) => ({
    name,
    values: (Array.isArray(value) ? value : [value]).map(resolveValue),
  }))
}

function resolveValue(value) {
  if (typeof value === 'string') return { min: value }
  const { 'min-width': minWidth, min = minWidth, max, raw } = value ?? {}
  return { min, max, raw }
}

// The media query Tailwind emits for a screen: a raw value verbatim, a width
// pair joined with `and`, and several values as a media query list.
function buildMediaQuery(values) {
  return values
    .map(({ min, max, raw }) =>
      raw !== undefined
        ? raw
        : [min && `(min-width: ${min})`, max && `(max-width: ${max})`]
            .filter(Boolean)
            .join(' and '),
    )
    .filter(Boolean)
    .join(', ')
}

// Tailwind only sorts its screen variants when every screen is a plain string
// (`areSimpleScreens`) and every width shares one unit
// (`screensUseConsistentUnits`); otherwise the variants keep the order the
// config declares them in. Both checks read the whole config, reserved names
// included, because that is what Tailwind's own ordering depends on.
function sortsByWidth(screens, normalized) {
  const simple = Object.values(screens ?? {}).every(
    (value) => typeof value === 'string',
  )
  if (!simple) return false
  const units = new Set()
  for (const { values } of normalized) {
    for (const { min, max } of values) {
      if (min !== undefined) units.add(unitOf(min))
      if (max !== undefined) units.add(unitOf(max))
    }
  }
  return units.size <= 1
}

function unitOf(value) {
  return String(value).match(/(\D+)$/)?.[1] ?? '(none)'
}
