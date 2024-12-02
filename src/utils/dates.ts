import { DateTime } from 'luxon'

declare global {
  interface Window {
    timezone?: {
      system?: string
      user?: string
    }
  }
}

type DateConstructorParam = string | number | Date

function getDate(...args: DateConstructorParam[]): Date {
  return new Date(...(args as [DateConstructorParam]))
}

function getDateValue(date: Date | string) {
  if (!date || date.toString() === 'Invalid Date') return ''

  return luxonDate(date)
    .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    .toFormat('yyyy-MM-dd')
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

  const systemTimeZone = window.timezone?.system || null
  const userTimeZone = window.timezone?.user || null
  const isTimezoneEnabled = systemTimeZone && userTimeZone

  if (!isTimezoneEnabled) return formatDate(date, format)

  // Convert the date from system to the user's time zone
  let systemTimezoneDate = luxonDate(date).setZone(systemTimeZone, {
    keepLocalTime: true,
  })
  let userTimezoneDate = systemTimezoneDate.setZone(userTimeZone)

  return userTimezoneDate.toFormat(format)
}

function convertToSystemTimezone(date: string, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''

  const systemTimeZone = window.timezone?.system || null
  const userTimeZone = window.timezone?.user || null
  const isTimezoneEnabled = systemTimeZone && userTimeZone

  if (!isTimezoneEnabled) return formatDate(date, format)
  // Convert the date from user's to the system time zone
  let userTimezoneDate = luxonDate(date).setZone(userTimeZone, {
    keepLocalTime: true,
  })
  let systemTimezoneDate = userTimezoneDate.setZone(systemTimeZone)

  return systemTimezoneDate.toFormat(format)
}

function formatDate(date: string | Date, format: string) {
  return luxonDate(date).toFormat(format)
}

function luxonDate(date: string | Date | DateTime | null = null) {
  if (!date) return DateTime.local()
  if (typeof date === 'string') {
    date = new Date(date)
  } else if (date.isLuxonDateTime) {
    return date
  }
  return DateTime.fromJSDate(date)
}

export {
  getDate,
  getDateValue,
  getDatesAfter,
  getDaysInMonth,
  isLeapYear,
  convertToUserTimezone,
  convertToSystemTimezone,
  formatDate,
  luxonDate,
  DateTime,
}
