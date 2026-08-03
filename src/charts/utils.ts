function isPlainObject(value: any): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Recursive merge for the `echartOptions` escape hatch. Arrays replace rather
 * than merge — index-wise merging of `series` or `xAxis` arrays produces
 * half-overridden entries that are impossible to reason about.
 */
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  ...sources: (Record<string, any> | undefined)[]
): T {
  let output: Record<string, any> = { ...target }

  for (const source of sources) {
    if (!isPlainObject(source)) continue
    for (const key of Object.keys(source)) {
      const value = source[key]
      output[key] =
        isPlainObject(value) && isPlainObject(output[key])
          ? mergeDeep(output[key], value)
          : value
    }
  }

  return output as T
}

/**
 * Accessible name for a plot, which is drawn as an image a reader cannot walk
 * into. Falls back to a generic name so the region is never left unnamed.
 */
export function chartAriaLabel(title?: string, subtitle?: string): string {
  return [title, subtitle].filter(Boolean).join(', ') || 'Chart'
}

export function documentDir(): 'ltr' | 'rtl' {
  if (typeof document === 'undefined') return 'ltr'
  return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
}
