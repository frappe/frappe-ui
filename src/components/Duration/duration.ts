// ---------------------------------------------------------------------------
// Duration helpers: convert between a seconds value and human-readable text.
// ---------------------------------------------------------------------------

import type {
  DurationFormat,
  DurationLargestUnit,
  DurationSmallestUnit,
  DurationUnits,
} from './types'

/**
 * Format a duration in seconds as text.
 *
 * `format` is either a named preset — which applies smart zero-omission and
 * (for `long`) pluralization — or a token template rendered literally:
 *
 *   formatDuration(5445)                    // "1h 30m 45s"   (short preset, default)
 *   formatDuration(90)                      // "1m 30s"       (preset omits zero parts)
 *   formatDuration(5445, 'long')            // "1 hour 30 minutes 45 seconds"
 *   formatDuration(5445, 'colon')           // "1:30:45"
 *   formatDuration(5445, "h'h' m'm' s's'")  // "1h 30m 45s"   (template, all parts)
 *   formatDuration(90,   "h'h' m'm' s's'")  // "0h 1m 30s"
 *   formatDuration(7323, 'hh:mm:ss')        // "02:02:03"
 *
 * `units` sets the unit range of the `short` and `long` presets:
 *
 *   formatDuration(93784, 'short', { largestUnit: 'day' })      // "1d 2h 3m 4s"
 *   formatDuration(93784, 'short', { smallestUnit: 'minute' })  // "26h 3m"
 */
export function formatDuration(
  totalSeconds: number | null | undefined,
  format: DurationFormat = 'short',
  units: DurationUnits = {},
): string {
  if (totalSeconds === null || totalSeconds === undefined) return ''

  const seconds = Number(totalSeconds)
  if (Number.isNaN(seconds)) return ''

  const { largestUnit = 'hour', smallestUnit = 'second' } = units
  const isPreset = format === 'short' || format === 'long'
  // `colon` and templates have no day token and show the seconds unrounded.
  const parts = isPreset
    ? splitDuration(seconds, largestUnit, smallestUnit)
    : splitDuration(seconds, 'hour', 'second')

  if (format === 'short') return formatShort(parts, smallestUnit)
  if (format === 'long') return formatLong(parts, smallestUnit)
  if (format === 'colon') return formatColon(parts)
  return renderTemplate(format, parts)
}

/** Round seconds to the smallest unit, as the presets show them. */
export function roundDuration(
  seconds: number,
  smallestUnit: DurationSmallestUnit,
): number {
  return smallestUnit === 'minute' ? Math.round(seconds / 60) * 60 : seconds
}

// ---------------------------------------------------------------------------
// Token template engine.
//
// Outside single quotes, runs of h / m / s are unit tokens; a run of length
// >= 2 zero-pads to two digits (`hh` → "02"). Single-quoted text is emitted
// literally so the unit letters can appear as labels (`'h'` → "h"); `''` is a
// literal apostrophe. Any other character passes through unchanged.
//
//   "h'h' m'm' s's'" → "1h 30m 45s"
//   "hh:mm:ss"       → "01:30:45"
// ---------------------------------------------------------------------------
function renderTemplate(template: string, parts: DurationParts): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  let out = ''
  let i = 0

  while (i < template.length) {
    const ch = template[i]

    if (ch === "'") {
      i++
      if (template[i] === "'") {
        out += "'"
        i++
        continue
      }
      while (i < template.length && template[i] !== "'") {
        out += template[i]
        i++
      }
      i++ // skip the closing quote
      continue
    }

    if (ch === 'h' || ch === 'm' || ch === 's') {
      let len = 1
      while (template[i + len] === ch) len++
      const unit = ch === 'h' ? 'hour' : ch === 'm' ? 'minute' : 'second'
      const value = parts[unit]
      out += len >= 2 ? pad(value) : String(value)
      i += len
      continue
    }

    out += ch
    i++
  }

  return out
}

type DurationPartUnit = 'day' | 'hour' | 'minute' | 'second'
type DurationParts = Record<DurationPartUnit, number>

const PART_UNITS: DurationPartUnit[] = ['day', 'hour', 'minute', 'second']
const SHORT_LABELS: Record<DurationPartUnit, string> = {
  day: 'd',
  hour: 'h',
  minute: 'm',
  second: 's',
}

function splitDuration(
  totalSeconds: number,
  largestUnit: DurationLargestUnit,
  smallestUnit: DurationSmallestUnit,
): DurationParts {
  const seconds = roundDuration(totalSeconds, smallestUnit)
  const day = largestUnit === 'day' ? Math.floor(seconds / 86400) : 0
  return {
    day,
    hour: Math.floor((seconds - day * 86400) / 3600),
    minute: Math.floor((seconds % 3600) / 60),
    second: seconds % 60,
  }
}

function formatShort(
  parts: DurationParts,
  smallestUnit: DurationPartUnit,
): string {
  const text = PART_UNITS.filter((unit) => parts[unit]).map(
    (unit) => `${parts[unit]}${SHORT_LABELS[unit]}`,
  )
  return text.length ? text.join(' ') : `0${SHORT_LABELS[smallestUnit]}`
}

function formatLong(
  parts: DurationParts,
  smallestUnit: DurationPartUnit,
): string {
  const text = PART_UNITS.filter((unit) => parts[unit]).map((unit) =>
    parts[unit] === 1 ? `1 ${unit}` : `${parts[unit]} ${unit}s`,
  )
  return text.length ? text.join(' ') : `0 ${smallestUnit}s`
}

function formatColon({ hour, minute, second }: DurationParts): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  if (hour) return `${hour}:${pad(minute)}:${pad(second)}`
  return `${minute}:${pad(second)}`
}

// ---------------------------------------------------------------------------
// Parse: human-readable string → seconds (integer) or null if invalid.
//
// Supported formats (case-insensitive, spaces optional, any unit order):
//   1h 30m 45s | 4m 3h 4s | 4sec 3hour 4min | 1h30m45s | 1d 2h | 2 days
//   1:30:45    | 1:30     | :45
//   90         | 90s
//
// A bare integer and the last colon group are read in the smallest unit:
// `90` is 90 seconds and `1:30` is 1m 30s by default, but with
// `smallestUnit: 'minute'` `90` is 90 minutes and `1:30` is 1h 30m.
// `1:30:45` is always h:m:s, and named units (`90s`) always keep their unit.
// ---------------------------------------------------------------------------
export function parseDuration(
  str: string,
  units: DurationUnits = {},
): number | null {
  const input = str.trim().toLowerCase()
  if (!input) return null

  const unitSeconds = units.smallestUnit === 'minute' ? 60 : 1

  const colonSeconds = parseColon(input, unitSeconds)
  if (colonSeconds !== null) return colonSeconds

  if (/^\d+$/.test(input)) return parseInt(input, 10) * unitSeconds

  return parseUnits(input)
}

// Colon-separated: h:m:s, or two groups ending in the smallest unit (m:s or
// h:m), or one such group (:s or :m). Groups are not bounded to 0-59:
// out-of-range parts overflow by design. In seconds mode "1:75" parses to 135s
// (1m + 75s) and "5:99" to 399s; in minute mode "1:75" is 8100s (1h + 75m).
// This mirrors stopwatch-style entry and is harmless.
function parseColon(input: string, unitSeconds: number): number | null {
  const match = input.match(/^(\d+):(\d+):(\d+)$|^(\d+):(\d+)$|^:(\d+)$/)
  if (!match) return null

  if (match[1] !== undefined) {
    return (
      parseInt(match[1], 10) * 3600 +
      parseInt(match[2], 10) * 60 +
      parseInt(match[3], 10)
    )
  }
  if (match[4] !== undefined) {
    return (parseInt(match[4], 10) * 60 + parseInt(match[5], 10)) * unitSeconds
  }
  return parseInt(match[6], 10) * unitSeconds
}

// Named units in any order: scan (number)(unit) tokens left-to-right and
// verify no unexpected text exists between tokens. Rejects duplicate units.
function parseUnits(input: string): number | null {
  const tokenRe =
    /(\d+)\s*(days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)/g
  const tokens: { value: number; unit: string }[] = []
  let lastEnd = 0
  let match: RegExpExecArray | null

  while ((match = tokenRe.exec(input)) !== null) {
    if (input.slice(lastEnd, match.index).trim() !== '') return null
    tokens.push({ value: parseInt(match[1], 10), unit: match[2][0] })
    lastEnd = match.index + match[0].length
  }

  if (input.slice(lastEnd).trim() !== '') return null
  if (tokens.length === 0) return null

  const seen = new Set<string>()
  let total = 0
  for (const { value, unit } of tokens) {
    if (seen.has(unit)) return null
    seen.add(unit)
    if (unit === 'd') total += value * 86400
    else if (unit === 'h') total += value * 3600
    else if (unit === 'm') total += value * 60
    else total += value
  }
  return total
}
