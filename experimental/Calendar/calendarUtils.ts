import type {
  CalendarColor,
  CalendarConfig,
  CalendarEvent,
  CalendarTimeFormat,
} from './types'

export function getCalendarDates(month: number, year: number): Date[] {
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let firstDay = new Date(year, month, 1)
  let leftPadding = firstDay.getDay()

  let datesInPreviousMonth = getBeforeDates(firstDay, leftPadding)
  let datesInCurrentMonth = getCurrentMonthDates(firstDay)
  let datesTillNow = [...datesInPreviousMonth, ...datesInCurrentMonth]
  let datesInNextMonth = getNextMonthDates(datesTillNow)

  let allDates = [...datesTillNow, ...datesInNextMonth]

  return allDates

  function getCurrentMonthDates(date: Date): Date[] {
    let month = date.getMonth()
    if (month == 1 && isLeapYear(date)) {
      daysInMonth[month] = 29
    }

    let numberOfDays = daysInMonth[month] + 1
    let allDates = getDatesAfter(date, 1, numberOfDays)
    return allDates
  }

  function getBeforeDates(firstDay: Date, leftPadding: number): Date[] {
    let allDates = getDatesAfter(firstDay, 0, leftPadding, -1)
    allDates = allDates.reverse()
    return allDates
  }

  function getNextMonthDates(currentAndPreviousMonthDates: Date[]): Date[] {
    const numberofDaysInCalendar =
      currentAndPreviousMonthDates.length > 35 ? 42 : 35
    let lengthOfDates = currentAndPreviousMonthDates.length
    let lastDate = currentAndPreviousMonthDates[lengthOfDates - 1]
    let diff = numberofDaysInCalendar - lengthOfDates + 1

    let allDates = getDatesAfter(lastDate, 1, diff, 1, true)
    return allDates
  }

  function getDatesAfter(
    date: Date,
    startIndex: number,
    counter: number,
    stepper = 1,
    getNextMonthDates = false,
  ): Date[] {
    let allDates: Date[] = []
    for (let index = startIndex; index < counter; index++) {
      let tempDate = new Date(
        date.getFullYear(),
        getNextMonthDates ? date.getMonth() + 1 : date.getMonth(),
        index * stepper,
      )
      allDates.push(tempDate)
    }
    return allDates
  }

  function isLeapYear(date: Date) {
    let year = date.getFullYear()
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
  }
}

export function groupBy<T>(
  obj: T[],
  fn: (value: T) => string | number,
): Record<string, T[]> {
  if (typeof fn !== 'function') throw new Error(`${fn} should be a function`)
  return obj.reduce(
    (acc, value) => {
      const group = String(fn(value))
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(value)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

export function calculateMinutes(time: string): number {
  let [hours, minutes] = time.split(':')
  return parseInt(hours) * 60 + parseInt(minutes)
}

export function convertMinutesToHours(minutes: number): string {
  let hours: number | string = Math.floor(minutes / 60)
  let remainingMinutes: number | string = minutes % 60
  if (hours < 10) hours = `0${hours}`
  if (remainingMinutes < 10) remainingMinutes = `0${remainingMinutes}`
  return `${hours}:${remainingMinutes}:00`
}

export function parseDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  let dd: number | string = date.getDate()
  let mm: number | string = date.getMonth() + 1
  let yyyy = date.getFullYear()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  return `${yyyy}-${mm}-${dd}`
}

export function parseDateEventPopupFormat(
  date: Date,
  showDay = true,
  showMonth = true,
  weekDay: 'short' | 'long' | 'narrow' = 'short',
): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
  }
  if (showMonth) {
    options.month = 'short'
  }

  if (showDay) {
    options.weekday = weekDay
  }
  return date.toLocaleDateString('en-US', options)
}

export function parseDateWithComma(date: Date, showDay = false): string {
  return parseDateEventPopupFormat(date, showDay).split(' ').join(', ')
}

export function parseDateWithDay(date: Date, fullDay = false): string {
  return fullDay
    ? daysListFull[date.getDay()] + ', ' + date.getDate()
    : daysList[date.getDay()] + ' ' + date.getDate()
}

export function calculateDiff(from: string, to: string): number {
  let fromMinutes = calculateMinutes(from)
  let toMinutes = calculateMinutes(to)
  return toMinutes - fromMinutes
}

export function handleSeconds(time: string): string {
  return time.split(':').slice(0, 2).join(':') + ':00'
}

/**
 * Below this the pill is held at `MINIMUM_EVENT_HEIGHT`, which is the height a
 * title and a time need to stay readable.
 */
export const EVENT_HEIGHT_THRESHOLD = 40
export const MINIMUM_EVENT_HEIGHT = 32.5

/**
 * How tall a timed event is drawn, against how long it runs.
 *
 * An event shorter than the grid can draw is padded to a floor, so a quarter of
 * an hour ends a good deal further down the column than it does on the clock —
 * which is how two events that follow each other in time can still collide.
 */
export function paintedEventHeight(
  durationMinutes: number,
  minuteHeight: number,
): number {
  const height = durationMinutes * minuteHeight
  return height < EVENT_HEIGHT_THRESHOLD ? MINIMUM_EVENT_HEIGHT : height
}

/**
 * Lays a day's timed events out into overlap columns ("halls"), and says of
 * each which of its edges lie over another event.
 *
 * `hallNumber` is the column: 0 at the back, and anything past that is laid
 * over an event in an earlier column, since a new column is only opened for an
 * event that fits in none of the existing ones at its start — so its left edge
 * is on another pill by construction. `idx` is the event's place within its
 * column, where events follow each other in time and should not collide; they
 * do anyway, because an event shorter than the grid can draw is painted at a
 * floor, so a quarter of an hour ends a good deal further down the column than
 * it does on the clock and the next one starts under that padding.
 *
 * `over` is the events the pill is actually drawn on: those in earlier columns
 * and the one before it in its own, whose painted extent its own crosses —
 * judged in pixels, as the pills are, given `minuteHeight`; without it, in
 * minutes. The pill draws its cut against each of them from their geometry.
 * Two pills that only share an edge are not over each other.
 */
export function findOverlappingEventsCount(
  events: CalendarEvent[],
  minuteHeight?: number,
): CalendarEvent[] {
  // A declined event claims no room: the others lay out as if it were not
  // there, and it sits full width beneath them. Grid events all carry the same
  // z-index, so "beneath" is DOM order — the declined go first, before the
  // events they underlie.
  const declined = events
    .filter((event) => event.isDeclined)
    .map((event) => ({ ...event, hallNumber: 0, idx: -1 }))
  events = events.filter((event) => !event.isDeclined)

  // Sort events based on start time
  events = events.sort((a, b) => (a.startTime || 0) - (b.startTime || 0))

  let hallNumber = 0
  const result: CalendarEvent[][] = []

  for (const event of events) {
    const availableHall = result.find(
      (hall) => (hall[hall.length - 1].endTime || 0) <= (event.startTime || 0),
    )

    if (availableHall) {
      availableHall.push(event)
    } else {
      result.push([event])
      hallNumber++
    }
  }

  // Where an event starts and ends on the grid rather than on the clock: its
  // start, and its start plus the height it is actually painted at.
  const painted = (event: CalendarEvent): [number, number] => {
    const start = event.startTime || 0
    const minutes = (event.endTime || 0) - start
    const end = minuteHeight
      ? start + paintedEventHeight(minutes, minuteHeight) / minuteHeight
      : start + minutes
    return [start, end]
  }
  const crosses = (a: [number, number], b: [number, number]) =>
    a[0] < b[1] && b[0] < a[1]

  // flattening halls and events
  return declined.concat(
    result
      .map((hall, hallIdx) =>
        hall.map((event, eventIdx) => {
          // Everything drawn beneath this pill: the earlier columns, which run
          // under it in full, and the event before it in its own.
          const beneath = result
            .slice(0, hallIdx)
            .map((earlier, earlierIdx) =>
              earlier.map((other, otherIdx) => ({
                ...other,
                hallNumber: earlierIdx,
                idx: otherIdx,
              })),
            )
            .flat()
            .concat(
              hall
                .slice(Math.max(eventIdx - 1, 0), eventIdx)
                .map((other) => ({
                  ...other,
                  hallNumber: hallIdx,
                  idx: eventIdx - 1,
                })),
            )
          const own = painted(event)
          return {
            ...event,
            hallNumber: hallIdx,
            idx: eventIdx,
            over: beneath.filter((other) => crosses(painted(other), own)),
          }
        }),
      )
      .flat(),
  )
}

// Helpers

export const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const daysListFull = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
export const twelveHoursFormat = [
  '12 am',
  '1 am',
  '2 am',
  '3 am',
  '4 am',
  '5 am',
  '6 am',
  '7 am',
  '8 am',
  '9 am',
  '10 am',
  '11 am',
  '12 pm',
  '1 pm',
  '2 pm',
  '3 pm',
  '4 pm',
  '5 pm',
  '6 pm',
  '7 pm',
  '8 pm',
  '9 pm',
  '10 pm',
  '11 pm',
]
export const twentyFourHoursFormat = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export function formattedDuration(
  fromTime: string,
  toTime: string,
  timeFormat: CalendarTimeFormat,
): string {
  fromTime = formatTime(fromTime, timeFormat)
  toTime = formatTime(toTime, timeFormat)

  if (fromTime.split(' ')[1] === toTime.split(' ')[1]) {
    fromTime = fromTime.split(' ')[0]
  }

  // An en dash, as the design sets it: a range, not a subtraction.
  return fromTime + ' – ' + toTime
}

export function formatTime(time: string, format: CalendarTimeFormat): string {
  if (format === '12h') {
    let [hoursValue, minutes] = time.split(':')
    let hours: number | string = parseInt(hoursValue)
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'

    // if minutes is 00, remove it
    if (minutes === '00') {
      return `${hours} ${ampm}`
    }
    time = `${hours}:${minutes} ${ampm}`
  }
  return time
}

export const colorMap: Record<string, CalendarColor> = {
  amber: {
    color: 'var(--ink-amber-6)',
    border: 'var(--ink-amber-6)',
    borderActive: 'var(--outline-amber-2)',
    text: 'var(--ink-amber-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-amber-1)',
    bgHover: 'var(--surface-amber-1)',
    bgActive: 'var(--surface-amber-2)',
  },
  violet: {
    color: 'var(--ink-violet-6)',
    border: 'var(--ink-violet-6)',
    borderActive: 'var(--outline-violet-2)',
    text: 'var(--ink-violet-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-violet-1)',
    bgHover: 'var(--surface-violet-1)',
    bgActive: 'var(--surface-violet-2)',
  },
  pink: {
    color: 'var(--ink-pink-6)',
    border: 'var(--ink-pink-6)',
    borderActive: 'var(--outline-pink-2)',
    text: 'var(--ink-pink-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-pink-1)',
    bgHover: 'var(--surface-pink-1)',
    bgActive: 'var(--surface-pink-2)',
  },
  cyan: {
    color: 'var(--ink-cyan-6)',
    border: 'var(--ink-cyan-6)',
    borderActive: 'var(--outline-cyan-2)',
    text: 'var(--ink-cyan-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-cyan-1)',
    bgHover: 'var(--surface-cyan-1)',
    bgActive: 'var(--surface-cyan-2)',
  },
  blue: {
    color: 'var(--ink-blue-6)',
    border: 'var(--ink-blue-6)',
    borderActive: 'var(--outline-blue-2)',
    text: 'var(--ink-blue-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-blue-1)',
    bgHover: 'var(--surface-blue-1)',
    bgActive: 'var(--surface-blue-2)',
  },
  orange: {
    color: 'var(--ink-orange-6)',
    border: 'var(--outline-orange-1)',
    borderActive: 'var(--outline-orange-2)',
    text: 'var(--ink-orange-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-orange-1)',
    bgHover: 'var(--surface-orange-1)',
    bgActive: 'var(--surface-orange-2)',
  },
  green: {
    color: 'var(--ink-green-6)',
    border: 'var(--ink-green-6)',
    borderActive: 'var(--outline-green-2)',
    text: 'var(--ink-green-6)',
    subtext: 'var(--ink-gray-6)',
    bg: 'var(--surface-green-1)',
    bgHover: 'var(--surface-green-1)',
    bgActive: 'var(--surface-green-2)',
  },
}

export const colorMapDark: Record<string, CalendarColor> = colorMap

// config.weekends can be array of numbers [0-6] (0=Sun) or weekday names (e.g., 'Saturday').
// Falls back to [0] (Sunday) if not provided / invalid.
const _weekdayNameToIndex = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export function getWeekendDays(
  config?: Partial<CalendarConfig> & { weekendDays?: Array<number | string> },
): number[] {
  // Support both weekendDays (preferred) and weekends (legacy) keys
  const raw = config?.weekendDays || config?.weekends
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [0]
  return raw
    .map((d) => {
      if (typeof d === 'number') return d
      if (typeof d === 'string') {
        const key = d.trim().toLowerCase()
        if (Object.prototype.hasOwnProperty.call(_weekdayNameToIndex, key))
          return _weekdayNameToIndex[key as keyof typeof _weekdayNameToIndex]
      }
      return null
    })
    .filter((v): v is number => v !== null && v >= 0 && v <= 6)
}

export function isWeekend(
  date: Date | string,
  config?: CalendarConfig,
): boolean {
  const day = new Date(date).getDay()
  const weekendDays = getWeekendDays(config)
  return weekendDays.includes(day)
}

// Format single month & year (e.g., "August, 2025")
export function formatMonthYear(month: number, year: number): string {
  return `${monthList[month]} ${year}`
}

// Extract ordered unique {month, year} pairs from a week of dates
export function getWeekMonthParts(weekDates?: Date[]) {
  const parts: Array<{ key: string; month: number; year: number }> = []
  for (const d of weekDates || []) {
    const dt = new Date(d)
    const m = dt.getMonth()
    const y = dt.getFullYear()
    const key = `${y}-${m}`
    if (!parts.find((p) => p.key === key))
      parts.push({ key, month: m, year: y })
  }
  return parts
}
