import {
  toZonedTime,
  fromZonedTime,
  format as formatTimezone,
} from 'date-fns-tz'
import {
  formatDistanceToNowStrict,
  formatDistanceStrict,
  format as _format,
  set as setDate,
} from 'date-fns'

declare global {
  interface Window {
    timezone?: {
      system?: string
      user?: string
    }
  }
}

type DateConstructorParam = string | number | Date

const systemTimeZone = window.timezone?.system || null
const userTimeZone = window.timezone?.user || null
const isTimezoneEnabled = systemTimeZone && userTimeZone

function getDate(...args: DateConstructorParam[]): Date {
  return new Date(...(args as [DateConstructorParam]))
}

function getDateValue(date: Date | string) {
  if (!date || date.toString() === 'Invalid Date') return ''

  if (typeof date === 'string') {
    date = new Date(date)
  }

  date = setDate(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  return formatDate(date, 'yyyy-MM-dd')
}

function getDatesAfter(date: Date, count: number) {
  let incrementer = 1
  if (count < 0) {
    incrementer = -1
    count = Math.abs(count)
  }
  const dates: Date[] = []

  while (count) {
    date = getDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + incrementer,
    )
    dates.push(date)
    count--
  }

  if (incrementer === -1) {
    return dates.reverse()
  }
  return dates
}

function getDaysInMonth(monthIndex: number, year: number) {
  const daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const daysInMonth = daysInMonthMap[monthIndex]
  if (monthIndex === 1 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth
}

function isLeapYear(year: number) {
  if (year % 400 === 0) return true
  if (year % 100 === 0) return false
  if (year % 4 === 0) return true
  return false
}

function convertToUserTimezone(date: string, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''

  if (!isTimezoneEnabled) return formatDate(new Date(date), format)

  // Convert the date from system to UTC to the user's time zone
  const systemTimezoneInUTC = fromZonedTime(date, systemTimeZone)
  const userTimezoneDate = toZonedTime(systemTimezoneInUTC, userTimeZone)

  return formatDate(userTimezoneDate, format)
}

function convertToSystemTimezone(date: string, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''

  if (!isTimezoneEnabled) return formatDate(new Date(date), format)

  // Convert the date from user's to UTC to the system time zone
  const userTimezoneInUTC = fromZonedTime(date, userTimeZone)
  const systemTimezoneDate = toZonedTime(userTimezoneInUTC, systemTimeZone)

  return formatDate(systemTimezoneDate, format)
}

function formatAsTimeAgo(date: string) {
  if (!date) return ''

  if (!isTimezoneEnabled)
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true })

  const userTimezoneDate = convertToUserTimezone(date)
  const nowInUserTimezone = toZonedTime(new Date(), userTimeZone)

  return formatDistanceStrict(userTimezoneDate, nowInUserTimezone, {
    addSuffix: true,
  })
}

function formatDate(date: Date, format: string) {
  if (!date) return ''

  if (!isTimezoneEnabled) return _format(date, format)

  return formatTimezone(date, format)
}

export {
  getDate,
  getDateValue,
  getDatesAfter,
  getDaysInMonth,
  isLeapYear,
  convertToUserTimezone,
  convertToSystemTimezone,
  formatAsTimeAgo,
  fromZonedTime,
  toZonedTime,
  formatDate,
  setDate,
}
