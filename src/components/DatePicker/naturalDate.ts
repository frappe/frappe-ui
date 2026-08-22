import { dayjsLocal } from '../../utils/dayjs'
import type { Dayjs } from 'dayjs/esm'

type Unit = 'day' | 'week' | 'month' | 'year'

// English vocabulary, kept in one table so a locale map can be added later.
const en = {
  // fixed keywords → day offset from now
  keywords: {
    today: 0,
    now: 0,
    tomorrow: 1,
    tmrw: 1,
    yesterday: -1,
  } as Record<string, number>,
  // next/last/this → direction
  modifiers: {
    next: 1,
    last: -1,
    this: 0,
  } as Record<string, number>,
  // unit words (singular + plural) for "in 3 days" / "3 days ago" / ranges
  units: {
    day: 'day',
    days: 'day',
    week: 'week',
    weeks: 'week',
    month: 'month',
    months: 'month',
    year: 'year',
    years: 'year',
  } as Record<string, Unit>,
  // single-letter units for "+5d" / "-2w"
  unitLetters: {
    d: 'day',
    w: 'week',
    m: 'month',
    y: 'year',
  } as Record<string, Unit>,
  weekdays: {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  } as Record<string, number>,
  // full + 3-letter month names → month index
  months: {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  } as Record<string, number>,
  in: 'in',
  ago: 'ago',
  since: 'since',
  quarter: 'quarter',
  // " to ", " - ", " – ", " — " (input whitespace is collapsed first)
  rangeSeparator: / (?:to|-|–|—) /,
}

interface ParsedDate {
  // resolved date; unset for bare month-day forms, which stay raw until the
  // range layer settles the year (so "feb 29 to mar 1 2024" can inherit 2024)
  date?: Dayjs
  hasExplicitYear: boolean
  monthDay?: { month: number; day: number; year: number | null }
}

// Resolve a parsed half to a date, validating month-day forms at the year
// they finally land on: explicit > inherited > now's year
function resolveDate(
  now: Dayjs,
  parsed: ParsedDate,
  inheritYear?: number,
): Dayjs | null {
  if (parsed.date) return parsed.date
  const md = parsed.monthDay
  if (!md) return null
  const year = md.year ?? inheritYear ?? now.year()
  return makeMonthDay(now, year, md.month, md.day)
}

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Build "may 4" on the given year, or null if the day overflows that month
function makeMonthDay(
  now: Dayjs,
  year: number,
  month: number,
  day: number,
): Dayjs | null {
  const base = now.year(year).month(month).date(1)
  if (day < 1 || day > base.daysInMonth()) return null
  return base.date(day)
}

function parseDateInternal(input: string, now: Dayjs): ParsedDate | null {
  const s = normalize(input)
  if (!s) return null

  const result = (date: Dayjs): ParsedDate => ({ date, hasExplicitYear: false })

  // today, tomorrow, tmrw, yesterday, now
  if (s in en.keywords) return result(now.add(en.keywords[s], 'day'))

  const words = s.split(' ')

  // next week, last month, next year, ...
  if (words.length === 2 && words[0] in en.modifiers) {
    const dir = en.modifiers[words[0]]
    const unit = en.units[words[1]]
    if (dir !== 0 && unit && unit !== 'day') {
      return result(now.add(dir, unit))
    }
    // next friday, last monday
    if (dir !== 0 && words[1] in en.weekdays) {
      return result(nearestWeekday(now, en.weekdays[words[1]], dir))
    }
  }

  // monday ... sunday → next occurrence strictly after today
  if (s in en.weekdays) return result(nearestWeekday(now, en.weekdays[s], 1))

  // in 3 days
  if (words.length === 3 && words[0] === en.in) {
    const n = parseCount(words[1])
    const unit = en.units[words[2]]
    if (n !== null && unit) return result(now.add(n, unit))
  }

  // 3 days ago
  if (words.length === 3 && words[2] === en.ago) {
    const n = parseCount(words[0])
    const unit = en.units[words[1]]
    if (n !== null && unit) return result(now.subtract(n, unit))
  }

  // +5d, -2w, +1m, +1y
  const signed = s.match(/^([+-])(\d+)([a-z])$/)
  if (signed) {
    const unit = en.unitLetters[signed[3]]
    if (unit) {
      const n = parseInt(signed[2], 10) * (signed[1] === '-' ? -1 : 1)
      return result(now.add(n, unit))
    }
  }

  // 1st, 2nd, 3rd, 15th → that day in now's month
  const ordinal = s.match(/^(\d{1,2})(?:st|nd|rd|th)$/)
  if (ordinal) {
    const day = parseInt(ordinal[1], 10)
    if (day < 1 || day > now.daysInMonth()) return null
    return result(now.date(day))
  }

  // may 4, 4 may, may 4 2025, 4 may 2025
  if (words.length === 2 || words.length === 3) {
    let month: number | undefined
    let day: number | null = null
    if (words[0] in en.months) {
      month = en.months[words[0]]
      day = parseCount(words[1])
    } else if (words[1] in en.months) {
      month = en.months[words[1]]
      day = parseCount(words[0])
    }
    if (month !== undefined && day !== null) {
      let year: number | null = null
      if (words.length === 3) {
        if (!/^\d{4}$/.test(words[2])) return null
        year = parseInt(words[2], 10)
      }
      // kept raw; resolveDate validates once the year is settled
      return {
        hasExplicitYear: year !== null,
        monthDay: { month, day, year },
      }
    }
  }

  return null
}

// Occurrence of the given weekday strictly after (dir=1) or before (dir=-1) now
function nearestWeekday(now: Dayjs, weekday: number, dir: number): Dayjs {
  const diff = (dir * (weekday - now.day()) + 7) % 7 || 7
  return now.add(dir * diff, 'day')
}

function parseCount(word: string): number | null {
  return /^\d+$/.test(word) ? parseInt(word, 10) : null
}

// Full quarter containing now, shifted by offset quarters
function quarterRange(now: Dayjs, offset: number): [Dayjs, Dayjs] {
  const start = now
    .date(1)
    .month(Math.floor(now.month() / 3) * 3)
    .startOf('month')
    .add(offset * 3, 'month')
  return [start, start.add(2, 'month').endOf('month')]
}

export function parseNaturalDate(input: string, now?: Dayjs): Dayjs | null {
  const anchor = now ?? dayjsLocal()
  const parsed = parseDateInternal(input, anchor)
  return parsed ? resolveDate(anchor, parsed) : null
}

export function parseNaturalRange(
  input: string,
  now?: Dayjs,
): [Dayjs, Dayjs] | null {
  const anchor = now ?? dayjsLocal()
  const s = normalize(input)
  if (!s) return null

  // today, yesterday, tomorrow → that single day
  if (s in en.keywords && s !== 'now') {
    const d = anchor.add(en.keywords[s], 'day')
    return [d, d]
  }

  const words = s.split(' ')

  // this week, last month, next year, this quarter, ...
  if (words.length === 2 && words[0] in en.modifiers) {
    const dir = en.modifiers[words[0]]
    if (words[1] === en.quarter) return quarterRange(anchor, dir)
    const unit = en.units[words[1]]
    if (unit && unit !== 'day') {
      const base = anchor.add(dir, unit)
      return [base.startOf(unit), base.endOf(unit)]
    }
  }

  // last 7 days, next 2 weeks, ...
  if (words.length === 3 && words[0] in en.modifiers) {
    const dir = en.modifiers[words[0]]
    const n = parseCount(words[1])
    const unit = en.units[words[2]]
    if (dir !== 0 && n !== null && unit) {
      return dir === 1
        ? [anchor, anchor.add(n, unit)]
        : [anchor.subtract(n, unit), anchor]
    }
  }

  // since may 4
  if (s.startsWith(en.since + ' ')) {
    const from = parseNaturalDate(s.slice(en.since.length + 1), anchor)
    if (!from) return null
    return from.isAfter(anchor) ? [anchor, from] : [from, anchor]
  }

  // may 4 to next friday — split once on the first separator
  const sep = s.match(en.rangeSeparator)
  if (!sep || sep.index === undefined) return null
  const a = parseDateInternal(s.slice(0, sep.index), anchor)
  const b = parseDateInternal(s.slice(sep.index + sep[0].length), anchor)
  if (!a || !b) return null

  // may 4 to may 26 2024 → the yearless half inherits the explicit year,
  // before day-of-month validation (so feb 29 to mar 1 2024 works)
  const yearOf = (p: ParsedDate) =>
    p.hasExplicitYear ? (p.monthDay?.year ?? undefined) : undefined
  const start = resolveDate(anchor, a, yearOf(b))
  const end = resolveDate(anchor, b, yearOf(a))
  if (!start || !end) return null

  return start.isAfter(end) ? [end, start] : [start, end]
}
