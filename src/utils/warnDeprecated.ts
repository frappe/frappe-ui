const warned = new Set<string>()

export function warnDeprecated(
  name: string,
  replacement: string,
  docHref?: string,
) {
  if (import.meta.env.PROD) return
  if (warned.has(name)) return
  warned.add(name)
  const suffix = docHref ? ` See ${docHref}` : ''
  console.warn(
    `[frappe-ui] ${name} is deprecated. Use ${replacement} instead.${suffix}`,
  )
}

/** Test-only: clear the dedup set so each test sees a fresh warning surface. */
export function _resetWarnDeprecated() {
  warned.clear()
}
