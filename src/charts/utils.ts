/**
 * Identity of the bucket a cap collapses its tail into, shared by `maxSeries`
 * and `maxSlices`. Reserved, so a group genuinely named "Others" in the data
 * cannot collide with it, and stable, so a caller can style the bucket through
 * `seriesConfig[OTHERS_KEY]`.
 */
export const OTHERS_KEY = '__others__'

/** Default display name for the collapsed bucket. `label` overrides it. */
export const OTHERS_LABEL = 'Others'

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

/**
 * What the mark under the keyboard cursor says, as one line for a live region.
 * The tooltip is drawn beside the pointer, which a reader walking the plot with
 * the arrow keys never has; this is the same reading in text.
 */
export function plotReading(
  label: string | undefined,
  readings: { label: string; value: string }[],
): string {
  const body = readings
    .map((reading) => `${reading.label} ${reading.value}`)
    .join(', ')
  return [label, body].filter(Boolean).join(': ')
}

/**
 * A data value as the name of a mark, for the keyboard cursor to hold on to.
 * Names are compared with `===`, and a refetch answers with a fresh `Date` for
 * the same instant, so a date reads as its time and everything else as itself.
 */
export function markName(value: unknown): string | number | undefined {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'string' || typeof value === 'number') return value
  return value === null || value === undefined ? undefined : String(value)
}

/** The center of an element in viewport coordinates, for a tooltip with no pointer to hang off. */
export function elementCenter(el: HTMLElement | undefined) {
  if (!el) return undefined
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/** Whether the reader has asked the OS for less movement. */
export function prefersReducedMotion(): boolean {
  return Boolean(
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
}

export function documentDir(): 'ltr' | 'rtl' {
  if (typeof document === 'undefined') return 'ltr'
  return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
}
