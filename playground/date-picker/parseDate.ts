// Reads a date the way people type one (the user's call 2026-10-13: "whatever
// format I type the date, it should get selected"). Returns `YYYY-MM-DD`, or
// null when the text isn't a date. Covers:
//   words       today, tomorrow, yesterday, day after tomorrow
//   relative    in 3 days, 2 weeks ago, +5d, next month, last year
//   weekdays    monday, next friday, last tue, this sat
//   written     5 jun, jun 5, 5th june 2024, june 5th, 2024 jun 5
//   numeric     2024-06-05, 5/6/2024, 5.6.24, 5-6 (day first), 20240605
//   partial     jun (the 1st), jun 2024, 5 (the 5th of the shown month)
import dayjs from 'dayjs/esm'
import type { Dayjs } from 'dayjs/esm'

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const UNITS: Record<string, dayjs.ManipulateType> = {
  d: 'day',
  day: 'day',
  days: 'day',
  w: 'week',
  wk: 'week',
  week: 'week',
  weeks: 'week',
  m: 'month',
  mo: 'month',
  month: 'month',
  months: 'month',
  y: 'year',
  yr: 'year',
  year: 'year',
  years: 'year',
}
const WORD_NUMBERS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
}

const monthIndex = (word: string) =>
  word.length >= 3 ? MONTHS.indexOf(word.slice(0, 3)) : -1
const dayIndex = (word: string) =>
  word.length >= 2 ? DAYS.findIndex((d) => d.startsWith(word.slice(0, 3))) : -1
const out = (d: Dayjs | null) =>
  d && d.isValid() ? d.format('YYYY-MM-DD') : null

/** `anchor` is today; `shown` is the month on screen, for a bare day. */
export function parseDate(
  input: string,
  anchor: Dayjs = dayjs(),
  shown: Dayjs = anchor,
): string | null {
  const text = input
    .trim()
    .toLowerCase()
    .replace(/,/g, ' ')
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1')
    .replace(/\bof\b/g, ' ')
    .replace(/\s+/g, ' ')
  if (!text) return null
  const today = anchor.startOf('day')

  // words
  if (text === 'today' || text === 'now' || text === 'tod') return out(today)
  if (text === 'tomorrow' || text === 'tmrw' || text === 'tom')
    return out(today.add(1, 'day'))
  if (text === 'yesterday' || text === 'yday')
    return out(today.subtract(1, 'day'))
  if (text === 'day after tomorrow') return out(today.add(2, 'day'))
  if (text === 'day before yesterday') return out(today.subtract(2, 'day'))

  // relative: in 3 days · 3 days ago · +3d · -2w · 3 days from now
  let m = text.match(
    /^(?:in )?([+-])?(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten) ?([a-z]+)( ago| from now| later| before| after)?$/,
  )
  if (m && UNITS[m[3]]) {
    const n = /\d/.test(m[2]) ? Number(m[2]) : WORD_NUMBERS[m[2]]
    const back = m[1] === '-' || m[4] === ' ago' || m[4] === ' before'
    return out(today.add(back ? -n : n, UNITS[m[3]]))
  }
  // next / last / this + unit
  m = text.match(/^(next|last|this|coming|previous) (day|week|month|year)$/)
  if (m) {
    const n =
      m[1] === 'this' ? 0 : m[1] === 'last' || m[1] === 'previous' ? -1 : 1
    return out(today.add(n, m[2] as dayjs.ManipulateType))
  }
  // weekdays: friday · next fri · last tuesday · this sat
  m = text.match(/^(?:(next|last|this|coming|previous) )?([a-z]+)$/)
  if (m && dayIndex(m[2]) >= 0 && monthIndex(m[2]) < 0) {
    const target = dayIndex(m[2])
    const diff = (target - today.day() + 7) % 7
    if (m[1] === 'last' || m[1] === 'previous')
      return out(today.subtract((today.day() - target + 7) % 7 || 7, 'day'))
    if (m[1] === 'next' || m[1] === 'coming')
      return out(today.add(diff || 7, 'day'))
    return out(today.add(diff, 'day'))
  }

  // numeric, year first: 2024-06-05 · 2024/6/5 · 20240605
  m =
    text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/) ??
    text.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (m) return strict(+m[1], +m[2] - 1, +m[3])
  // numeric, day first: 5/6/2024 · 5.6.24 · 5-6 (this year)
  m = text.match(/^(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{2}|\d{4}))?$/)
  if (m) {
    const year = m[3] ? fullYear(+m[3]) : today.year()
    // day first; fall back to month first when the day-first reading fails
    return strict(year, +m[2] - 1, +m[1]) ?? strict(year, +m[1] - 1, +m[2])
  }

  // written: tokens of a day, a month name and a year in any order
  const tokens = text.split(/[\s/.-]+/).filter(Boolean)
  let day: number | null = null
  let month: number | null = null
  let year: number | null = null
  for (const t of tokens) {
    if (/^\d+$/.test(t)) {
      const n = Number(t)
      if (t.length >= 3 || n > 31) year = fullYear(n)
      else if (day === null) day = n
      else year = fullYear(n)
    } else if (monthIndex(t) >= 0 && month === null) month = monthIndex(t)
    else if (dayIndex(t) >= 0)
      continue // "fri 5 jun": the weekday is noise
    else return null
  }
  if (month !== null) return strict(year ?? today.year(), month, day ?? 1)
  // a bare day: the shown month's
  if (day !== null && year === null)
    return strict(shown.year(), shown.month(), day)
  return null
}

function fullYear(n: number) {
  return n < 100 ? 2000 + n : n
}
/** The date only if it exists (no 31 Feb rolling into March). */
function strict(year: number, month: number, day: number) {
  if (month < 0 || month > 11 || day < 1) return null
  const d = dayjs(new Date(year, month, day))
  return d.month() === month && d.date() === day ? d.format('YYYY-MM-DD') : null
}
