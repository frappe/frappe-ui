import { dayjs } from '#utils/dayjs'
import { chartFont, measureTextWidth } from './measureText'

export type TimeGrain =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

const GRAIN_FORMATS: Record<TimeGrain, string> = {
  second: 'MMM D, YYYY h:mm:ss A',
  minute: 'MMM D, YYYY h:mm A',
  hour: 'MMM D, YYYY h:00 A',
  day: 'MMM D, YYYY',
  week: '[Week of] MMM D, YYYY',
  month: 'MMM YYYY',
  quarter: '[Q]Q YYYY',
  year: 'YYYY',
}

/** `total_sales` -> `Total Sales`. Used for series names and axis titles. */
export function formatLabel(name: string) {
  if (!name) return ''
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const ELLIPSIS = '…'

/**
 * Shortens to `maxChars` by dropping the middle: `Paid Search — Brand Campaigns
 * (EMEA)` -> `Paid Search…(EMEA)`.
 *
 * Category labels in one chart usually share a prefix — `Social — Organic` and
 * `Social — Paid` both end-truncate to `Social — …`, which reads as two rows
 * for the same thing. Keeping both ends keeps the part that tells them apart.
 */
export function truncateMiddle(text: string, maxChars: number): string {
  if (!text || text.length <= maxChars) return text
  if (maxChars <= 1) return ELLIPSIS
  const keep = maxChars - 1
  const head = Math.ceil(keep / 2)
  const tail = keep - head
  return text.slice(0, head) + ELLIPSIS + (tail ? text.slice(-tail) : '')
}

/**
 * Advance of a character in Inter at 1em, measured off the face. A flat average
 * cannot fit text to a pixel width — two labels of equal length can differ by a
 * third — and under-reading puts a second ellipsis on an already shortened
 * label, so every class is rounded up rather than down.
 *
 * Only reached with no DOM to measure in; see `estimateTextWidth`.
 */
function charWidthRatio(char: string): number {
  if (char === ' ') return 0.29
  if (char === '—') return 1
  if (/[ijltfI|!.,;:'`]/.test(char)) return 0.3
  if (char === 'r') return 0.38
  if (/[()[\]]/.test(char)) return 0.37
  if (/[mMW%@]/.test(char)) return 0.95
  if (char === 'w') return 0.83
  if (/[A-Z0-9$&–]/.test(char)) return 0.68
  if (/[a-z]/.test(char)) return 0.6
  // Anything else — CJK above all — is read as full width. It over-reads an
  // accented Latin letter by a little, which only costs a character.
  return 1
}

/**
 * What `text` takes to draw at `fontSize`. Measured in the DOM where there is
 * one, so the number matches what the SVG plot renders; the character table
 * above is the fallback for the contexts that have no DOM to measure in — SSR,
 * and option builders run under node in tests.
 */
export function estimateTextWidth(text: string, fontSize: number): number {
  const measured = measureTextWidth(text, chartFont(fontSize))
  if (measured !== null) return measured

  let ems = 0
  for (const char of text) ems += charWidthRatio(char)
  return ems * fontSize
}

/**
 * The longest middle-truncation of `text` that draws inside `maxWidth`.
 *
 * Searched a character at a time rather than divided out of an average width,
 * because which characters survive changes how wide the result is — dropping
 * the middle of a name can leave the capitals and take almost nothing off.
 */
export function truncateMiddleToWidth(
  text: string,
  maxWidth: number,
  fontSize: number,
): string {
  if (!text || estimateTextWidth(text, fontSize) <= maxWidth) return text
  for (let chars = text.length - 1; chars >= 2; chars--) {
    const candidate = truncateMiddle(text, chars)
    if (estimateTextWidth(candidate, fontSize) <= maxWidth) return candidate
  }
  return ELLIPSIS
}

export function formatValue(
  value: number,
  precision?: number,
  shorten = false,
) {
  if (value === null || value === undefined || isNaN(value)) return ''

  const locale = 'en-US'

  if (shorten) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: precision ?? 1,
    }).format(value)
  }

  const digits = precision ?? guessPrecision(value)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

/** `0.4` -> `<1%`: a rounded `0%` on a slice that is visibly there reads as a bug. */
export function formatPercent(percent: number) {
  if (!percent) return '0%'
  if (percent < 1) return '<1%'
  return `${Math.round(percent)}%`
}

/** Keeps whole numbers whole instead of forcing a `.00` on every tick. */
function guessPrecision(value: number) {
  if (!value || isNaN(value)) return 0
  const str = value.toString()
  const decimalIndex = str.indexOf('.')
  if (decimalIndex === -1) return 0
  return Math.min(str.length - decimalIndex - 1, 2)
}

export function formatDate(
  date: string | number | Date,
  grain: TimeGrain = 'day',
  format?: string,
) {
  if (date === null || date === undefined || date === '') return ''
  const parsed = dayjs(date)
  if (!parsed.isValid()) return String(date)
  return parsed.format(format || GRAIN_FORMATS[grain] || GRAIN_FORMATS.day)
}

/**
 * A `Date`, or a string that is unambiguously one: `2024-03-01`, with an
 * optional time after it. Loose parsing is deliberately out — dayjs reads
 * `"Q1 2024"` and `"12"` as dates, and a category column full of those would
 * silently land on a time axis.
 */
const ISO_DATE = /^\d{4}-\d{2}(-\d{2})?([T ]\d{2}:\d{2}(:\d{2})?)?/

function toDate(value: any): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return null
  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? null : parsed
}

/** True when every value present in the column is a date, and at least one is. */
export function isTemporal(values: any[]): boolean {
  const present = values.filter(
    (v) => v !== null && v !== undefined && v !== '',
  )
  return present.length > 0 && present.every((v) => toDate(v) !== null)
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Spacing under which a series is read as being of that grain. */
const GRAIN_BY_SPACING: [number, TimeGrain][] = [
  [MINUTE, 'second'],
  [HOUR, 'minute'],
  [DAY, 'hour'],
  [7 * DAY, 'day'],
  [28 * DAY, 'week'],
  [90 * DAY, 'month'],
  [365 * DAY, 'quarter'],
]

/**
 * The grain a series of timestamps is sampled at, from the median gap between
 * them — the median rather than the mean so one missing month doesn't coarsen
 * the labels of the whole axis. Falls back to `'day'` when there is nothing to
 * measure, which is what a single-point series gets.
 */
export function inferTimeGrain(values: any[]): TimeGrain {
  const times = values
    .map(toDate)
    .filter((d): d is Date => d !== null)
    .map((d) => d.getTime())
    .sort((a, b) => a - b)
  if (times.length < 2) return 'day'

  const gaps = times.slice(1).map((time, i) => time - times[i])
  gaps.sort((a, b) => a - b)
  const median = gaps[Math.floor(gaps.length / 2)]

  const match = GRAIN_BY_SPACING.find(([limit]) => median < limit)
  return match ? match[1] : 'year'
}

/** How a value of the x column reads; values arrive raw from the row. */
export function formatAxisValue(
  value: any,
  type: 'category' | 'time' | 'value',
  grain?: TimeGrain,
) {
  if (type === 'time') return formatDate(value, grain)
  // Unshortened, unlike the tick that carries the same number: this is what the
  // tooltip prints, and a reading of 1.2K there loses the value being read.
  if (type === 'value') return formatValue(Number(value))
  return value === null || value === undefined ? '' : String(value)
}

/** Calendar units an axis tick can land on, coarsest first. */
const TICK_UNITS = ['year', 'month', 'day', 'hour', 'minute', 'second'] as const
type TickUnit = (typeof TICK_UNITS)[number]

/** How a tick reads once its own unit is known. Mirrors echarts' own defaults. */
const TICK_UNIT_FORMATS: Record<TickUnit, string> = {
  year: 'YYYY',
  month: 'MMM',
  day: 'D',
  hour: 'HH:mm',
  minute: 'HH:mm',
  second: 'HH:mm:ss',
}

/** The finest tick a series of this grain can say anything about. */
const GRAIN_TICK_UNIT: Record<TimeGrain, TickUnit> = {
  second: 'second',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'day',
  month: 'month',
  quarter: 'month',
  year: 'year',
}

/** The coarsest unit a timestamp sits exactly on: `2024-01-01` is a year. */
function tickUnit(date: ReturnType<typeof dayjs>): TickUnit {
  if (date.millisecond() || date.second()) return 'second'
  if (date.minute()) return 'minute'
  if (date.hour()) return 'hour'
  if (date.date() !== 1) return 'day'
  if (date.month()) return 'month'
  return 'year'
}

/**
 * One tick of a time axis, named by the coarsest unit it lands on — "Jan 2023,
 * Apr 2023, Jul 2023" repeats the year as noise, so the months read "Apr" and
 * the tick opening the year reads "2023". echarts marks that tick with a `level`
 * above zero, which the `primary` rich style sets apart. Ticks finer than the
 * grain go unlabelled: a monthly series says nothing about the 15th.
 */
export function formatTimeAxisLabel(
  value: any,
  grain: TimeGrain = 'day',
  level = 0,
) {
  const date = dayjs(value)
  if (!date.isValid()) return ''

  const unit = tickUnit(date)
  const finest = GRAIN_TICK_UNIT[grain] ?? 'day'
  if (TICK_UNITS.indexOf(unit) > TICK_UNITS.indexOf(finest)) return ''

  const label = date.format(TICK_UNIT_FORMATS[unit])
  return level > 0 ? `{primary|${label}}` : label
}
