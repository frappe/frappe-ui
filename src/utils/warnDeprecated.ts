const warned = new Set<string>()

/**
 * Dev-only `console.warn`, deduped by `key`. For a break that cannot be
 * phrased as "X was removed, use Y" — e.g. one reported from data the caller
 * may legitimately own.
 */
export function warnOnce(key: string, message: string) {
  if (import.meta.env.PROD) return
  if (warned.has(key)) return
  warned.add(key)
  console.warn(message)
}

export function warnDeprecated(
  name: string,
  replacement: string,
  docHref?: string,
) {
  const suffix = docHref ? ` See ${docHref}` : ''
  warnOnce(
    `deprecated:${name}`,
    `[frappe-ui] ${name} is deprecated. Use ${replacement} instead.${suffix}`,
  )
}

export function warnRemoved(
  name: string,
  replacement: string,
  docHref?: string,
) {
  const suffix = docHref ? ` See ${docHref}` : ''
  warnOnce(
    `removed:${name}`,
    `[frappe-ui] ${name} was removed. Use ${replacement} instead.${suffix}`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetWarnDeprecated() {
  warned.clear()
}
