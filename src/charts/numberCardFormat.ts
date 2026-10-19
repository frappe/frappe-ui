import { formatValue } from './format'
import type { NumberCardConfig } from './types'

/** Which way the number moved. Independent of whether that is good. */
export type DeltaDirection = 'up' | 'down' | 'flat'

/** Whether the move is good news. Green, red, or neither. */
export type DeltaTone = 'positive' | 'negative' | 'neutral'

type DeltaConfig = Pick<
  NumberCardConfig,
  'delta' | 'deltaPrefix' | 'deltaSuffix' | 'deltaFormat' | 'negativeIsBetter'
>

/**
 * A delta that prints the way zero does is flat: an arrow beside "0%" would
 * point at a move the reader cannot see.
 */
export function deltaDirection(config: DeltaConfig): DeltaDirection {
  const { delta } = config
  if (!isPresent(delta)) return 'flat'
  if (formatCardDelta(config, delta) === formatCardDelta(config, 0)) {
    return 'flat'
  }
  return delta > 0 ? 'up' : 'down'
}

/**
 * `negativeIsBetter` flips the colors without touching the arrow: churn falling
 * still points down, it just stops being red.
 */
export function deltaTone(config: DeltaConfig): DeltaTone {
  const direction = deltaDirection(config)
  if (direction === 'flat') return 'neutral'
  const better = config.negativeIsBetter ? 'down' : 'up'
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
  config: DeltaConfig,
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
