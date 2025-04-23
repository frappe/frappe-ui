export function getCalendarDates(month, year) {
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let firstDay = new Date(year, month, 1)
  let leftPadding = firstDay.getDay()

  let datesInPreviousMonth = getBeforeDates(firstDay, leftPadding)
  let datesInCurrentMonth = getCurrentMonthDates(firstDay)
  let datesTillNow = [...datesInPreviousMonth, ...datesInCurrentMonth]
  let datesInNextMonth = getNextMonthDates(datesTillNow)

  let allDates = [...datesTillNow, ...datesInNextMonth]

  return allDates

  function getCurrentMonthDates(date) {
    let month = date.getMonth()
    if (month == 1 && isLeapYear(date)) {
      daysInMonth[month] = 29
    }

    let numberOfDays = daysInMonth[month] + 1
    let allDates = getDatesAfter(date, 1, numberOfDays)
    return allDates
  }

  function getBeforeDates(firstDay, leftPadding) {
    let allDates = getDatesAfter(firstDay, 0, leftPadding, -1)
    allDates = allDates.reverse()
    return allDates
  }

  function getNextMonthDates(currentAndPreviousMonthDates) {
    const numberofDaysInCalendar =
      currentAndPreviousMonthDates.length > 35 ? 42 : 35
    let lengthOfDates = currentAndPreviousMonthDates.length
    let lastDate = currentAndPreviousMonthDates[lengthOfDates - 1]
    let diff = numberofDaysInCalendar - lengthOfDates + 1

    let allDates = getDatesAfter(lastDate, 1, diff, 1, true)
    return allDates
  }

  function getDatesAfter(
    date,
    startIndex,
    counter,
    stepper = 1,
    getNextMonthDates = false,
  ) {
    let allDates = []
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

  function isLeapYear(date) {
    let year = date.getFullYear()
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
  }
}

export function groupBy(obj, fn) {
  if (typeof fn !== 'function') throw new Error(`${fn} should be a function`)
  return Object.keys(obj).reduce((acc, key) => {
    const group = fn(obj[key])
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(obj[key])
    return acc
  }, {})
}

export function calculateMinutes(time) {
  let [hours, minutes] = time.split(':')
  return parseInt(hours) * 60 + parseInt(minutes)
}

export function convertMinutesToHours(minutes) {
  let hours = Math.floor(minutes / 60)
  let remainingMinutes = minutes % 60
  if (hours < 10) hours = `0${hours}`
  if (remainingMinutes < 10) remainingMinutes = `0${remainingMinutes}`
  return `${hours}:${remainingMinutes}:00`
}

export function parseDate(date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  let dd = date.getDate()
  let mm = date.getMonth() + 1
  let yyyy = date.getFullYear()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  return `${yyyy}-${mm}-${dd}`
}

export function parseDateEventPopupFormat(
  date,
  showDay = true,
  showMonth = true,
  weekDay = 'short',
) {
  const options = {
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

export function parseDateWithComma(date, showDay = false) {
  return parseDateEventPopupFormat(date, showDay).split(' ').join(', ')
}

export function parseDateWithDay(date, fullDay = false) {
  return fullDay
    ? daysListFull[date.getDay()] + ', ' + date.getDate()
    : daysList[date.getDay()] + ' ' + date.getDate()
}

export function calculateDiff(from, to) {
  let fromMinutes = calculateMinutes(from)
  let toMinutes = calculateMinutes(to)
  return toMinutes - fromMinutes
}

export function handleSeconds(time) {
  return time.split(':').slice(0, 2).join(':') + ':00'
}

export function findOverlappingEventsCount(events) {
  // Sort events based on start time
  events = events.sort((a, b) => a.startTime - b.startTime)

  let hallNumber = 0
  const result = []

  for (const event of events) {
    const availableHall = result.find(
      (hall) => hall[hall.length - 1].endTime <= event.startTime,
    )

    if (availableHall) {
      availableHall.push(event)
    } else {
      result.push([event])
      hallNumber++
    }
  }

  // flattening halls and events
  return result
    .map((hall, idx) =>
      hall.map((event, eventIdx) => ({
        ...event,
        hallNumber: idx,
        idx: eventIdx,
      })),
    )
    .flat()
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

export const colorMap = {
  blue: {
    bg_hex: '#ebf8ff',
    border_hex: '#3b82f6',
  },
  green: {
    bg_hex: '#bbf7d0',
    border_hex: '#22c55e',
  },
  red: {
    bg_hex: '#fee2e2',
    border_hex: '#ef4444',
  },
  orange: {
    bg_hex: '#ffedd5',
    border_hex: '#f97316',
  },
  yellow: {
    bg_hex: '#fefcbf',
    border_hex: '#eab308',
  },
  teal: {
    bg_hex: '#cffafe',
    border_hex: '#14b8a6',
  },
  violet: {
    bg_hex: '#e0e7ff',
    border_hex: '#8b5cf6',
  },
  cyan: {
    bg_hex: '#cffafe',
    border_hex: '#06b6d4',
  },
  purple: {
    bg_hex: '#f3e8ff',
    border_hex: '#a855f7',
  },
  pink: {
    bg_hex: '#fbcfe8',
    border_hex: '#ec4899',
  },
  amber: {
    bg_hex: '#fefcbf',
    border_hex: '#f59e0b',
  },
}

export function formattedDuration(from_time, to_time, timeFormat) {
  from_time = formatTime(from_time, timeFormat)
  to_time = formatTime(to_time, timeFormat)

  if (from_time.split(' ')[1] === to_time.split(' ')[1]) {
    from_time = from_time.split(' ')[0]
  }

  return from_time + ' - ' + to_time
}

export function formatTime(time, format) {
  if (format === '12h') {
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours)
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

export function hexToHSL(hex) {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((x) => x + x)
      .join('')
  }

  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  return { h, s: s * 100, l: l * 100 }
}

export function hslToHex(h, s, l) {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let [r, g, b] = [0, 0, 0]

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0]
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0]
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x]
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c]
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c]
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x]

  r = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, '0')
  g = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, '0')
  b = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${r}${g}${b}`
}

export function getContrastingSameColor(hex) {
  const hsl = hexToHSL(hex)
  // Flip lightness: if it's dark, make it light and vice versa
  hsl.l = hsl.l > 50 ? 25 : 80
  return hslToHex(hsl.h, hsl.s, hsl.l)
}
