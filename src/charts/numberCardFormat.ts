import { formatValue } from './format'
import type { NumberCardConfig } from './types'

/** Which way the number moved. Independent of whether that is good. */
export type DeltaDirection = 'up' | 'down' | 'flat'

/** Whether the move is good news. Green, red, or neither. */
export type DeltaTone = 'positive' | 'negative' | 'neutral'

export function deltaDirection(
  delta: number | null | undefined,
): DeltaDirection {
  if (!isPresent(delta)) return 'flat'
  if (delta > 0) return 'up'
  if (delta < 0) return 'down'
  return 'flat'
}

/**
 * `negativeIsBetter` flips the colors without touching the arrow: churn falling
 * still points down, it just stops being red.
 */
export function deltaTone(
  delta: number | null | undefined,
  negativeIsBetter = false,
): DeltaTone {
  const direction = deltaDirection(delta)
  if (direction === 'flat') return 'neutral'
  const better = negativeIsBetter ? 'down' : 'up'
  return direction === better ? 'positive' : 'negative'
}

/** The big number, with its prefix and suffix. Empty when there is no value. */
export function formatCardValue(
  config: Pick<NumberCardConfig, 'prefix' | 'suffix' | 'format'>,
  value: number | string | null | undefined,
): string {
  // A string is already the reading the caller wants shown, so nothing here has
  // anything to add to it.
  if (typeof value === 'string') return value
  if (!isPresent(value)) return ''
  const formatted = config.format ? config.format(value) : formatValue(value)
  return `${config.prefix ?? ''}${formatted}${config.suffix ?? ''}`
}

/**
 * The delta, unsigned: the arrow beside it already carries the direction, so a
 * `-3.1%` next to a down arrow would say it twice.
 */
export function formatCardDelta(
  config: Pick<NumberCardConfig, 'deltaPrefix' | 'deltaSuffix' | 'deltaFormat'>,
  delta: number | null | undefined,
): string {
  if (!isPresent(delta)) return ''
  const magnitude = Math.abs(delta)
  const formatted = config.deltaFormat
    ? config.deltaFormat(magnitude)
    : formatValue(magnitude, undefined, true)
  return `${config.deltaPrefix ?? ''}${formatted}${config.deltaSuffix ?? ''}`
}

function isPresent(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && !isNaN(value)
}
