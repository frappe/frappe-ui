/**
 * Resolve a prop value against a lookup table, falling back to the
 * component's own default when the value is not a key of that table.
 *
 * Components pick class names with table lookups like
 * `{ gray: …, blue: … }[props.theme]`. A value outside the prop's union makes
 * that return `undefined`. Where the result is indexed again — `Badge` indexes
 * by theme, then by variant — the `undefined` throws a `TypeError` mid-render,
 * which Vue propagates up and which takes the parent render down with it. So a
 * typo, a stale theme name in a status map, or a value renamed by the library
 * crashes a page instead of mis-colouring one badge.
 *
 * TypeScript still rejects these values at the call site. This is the runtime
 * net for JS call sites and for bound values (`:theme="statusMap[s]"`) that
 * TypeScript cannot see through.
 */

const warned = new Set<string>()

export function resolvePropValue<T, K extends string>(
  table: Record<K, T>,
  value: string | undefined,
  fallback: K,
  context: { component: string; prop: string },
): T {
  if (value !== undefined && Object.prototype.hasOwnProperty.call(table, value))
    return table[value as K]

  warnUnsupportedPropValue(table, value, fallback, context)
  return table[fallback]
}

function warnUnsupportedPropValue(
  table: Record<string, unknown>,
  value: string | undefined,
  fallback: string,
  { component, prop }: { component: string; prop: string },
) {
  // `undefined` means the prop was simply not passed, which `withDefaults`
  // normally covers. Nothing to report.
  if (value === undefined) return
  if (import.meta.env.PROD) return

  // These fire from computeds on every recompute; warn once per offending
  // value, not once per render.
  const key = `${component}.${prop}=${value}`
  if (warned.has(key)) return
  warned.add(key)

  console.warn(
    `[frappe-ui] ${component}.${prop}="${value}" is not a supported value — ` +
      `falling back to "${fallback}". Supported: ${Object.keys(table).join(', ')}.`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetResolvePropValue() {
  warned.clear()
}
