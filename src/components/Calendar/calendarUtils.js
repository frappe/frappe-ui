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

export function formattedDuration(fromTime, toTime, timeFormat) {
  fromTime = formatTime(fromTime, timeFormat)
  toTime = formatTime(toTime, timeFormat)

  if (fromTime.split(' ')[1] === toTime.split(' ')[1]) {
    fromTime = fromTime.split(' ')[0]
  }

  return fromTime + ' - ' + toTime
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

export const colorMap = {
  amber: {
    color: '#DB7706',
    border: '#DB7706',
    borderActive: '#FBCC55',
    text: '#91400D',
    subtext: '#AD8460',
    subtextActive: '#FAEBD0',
    bg: '#FFF7D3',
    bgHover: '#FEEDA9',
    bgActive: '#E79913',
  },
  violet: {
    color: '#6846E3',
    border: '#6846E3',
    borderActive: '#B3A1F5',
    text: '#5F46C7',
    subtext: '#766D9B',
    subtextActive: '#E4DCFD',
    bg: '#F0EBFF',
    bgHover: '#DBD5FF',
    bgActive: '#7A51F4',
  },
  pink: {
    color: '#E34AA6',
    border: '#E34AA6',
    borderActive: '#F6A7D6',
    text: '#CF3A96',
    subtext: '#B26997',
    subtextActive: '#F9DBED',
    bg: '#FDE8F5',
    bgHover: '#FFD5F0',
    bgActive: '#E34AA6',
  },
  cyan: {
    color: '#3BBDE5',
    border: '#3BBDE5',
    borderActive: '#72D5F3',
    text: '#267A94',
    subtext: '#668E9C',
    subtextActive: '#D6EDF4',
    bg: '#DDF7FF',
    bgHover: '#B3E8F7',
    bgActive: '#32A4C7',
  },
  blue: {
    color: '#0289F7',
    border: '#0289F7',
    borderActive: '#A7D7FD',
    text: '#007BE0',
    subtext: '#5C8DB3',
    subtextActive: '#CCE7FD',
    bg: '#E6F4FF',
    bgHover: '#C8E6FF',
    bgActive: '#0289F7',
  },
  orange: {
    color: '#E86C13',
    border: '#E86C13',
    borderActive: '#FFCBA3',
    text: '#E86C13',
    subtext: '#A67765',
    subtextActive: '#FAE2D0',
    bg: '#FFEFE4',
    bgHover: '#FFDEC5',
    bgActive: '#E86C13',
  },
  green: {
    color: '#30A66D',
    border: '#30A66D',
    borderActive: '#88D5A5',
    text: '#137949',
    subtext: '#678877',
    subtextActive: '#D6EDE2',
    bg: '#E4FAEB',
    bgHover: '#CBF3D7',
    bgActive: '#30A66D',
  },
}

export const colorMapDark = {
  amber: {
    color: '#DB7706',
    border: '#C57411',
    borderActive: '#C57411',
    text: '#C57411',
    textActive: '#824108',
    subtext: '#988356',
    subtextActive: '#8E6026',
    bg: '#371E06',
    bgHover: '#4B2606',
    bgActive: '#F8D16E',
  },
  violet: {
    color: '#6846E3',
    border: '#A384EC',
    borderActive: '#8867E8',
    text: '#A384EC',
    textActive: '#4639A6',
    subtext: '#9389AE',
    subtextActive: '#332978',
    bg: '#221C42',
    bgHover: '#281E5D',
    bgActive: '#C4AFEE',
  },
  pink: {
    color: '#E34AA6',
    border: '#CB4394',
    borderActive: '#CB4394',
    text: '#E359AB',
    textActive: '#822A5F',
    subtext: '#B07E99',
    subtextActive: '#935277',
    bg: '#471432',
    bgHover: '#68204B',
    bgActive: '#F6C5DE',
  },
  cyan: {
    color: '#3BBDE5',
    border: '#2B8DAB',
    borderActive: '#2B8DAB',
    text: '#3CB8DC',
    textActive: '#155266',
    subtext: '#819FA8',
    subtextActive: '#3A6E7D',
    bg: '#0B252D',
    bgHover: '#0E3B49',
    bgActive: '#A0E6F7',
  },
  blue: {
    color: '#0289F7',
    border: '#3294E3',
    borderActive: '#1580D8',
    text: '#5AAEF2',
    textActive: '#155999',
    subtext: '#7F95AC',
    subtextActive: '#386A99',
    bg: '#10243E',
    bgHover: '#052B53',
    bgActive: '#ADD2F5',
  },
  orange: {
    color: '#E86C13',
    border: '#C45A0E',
    borderActive: '#C45A0E',
    text: '#DE6D1B',
    textActive: '#823906',
    subtext: '#B3876B',
    subtextActive: '#955528',
    bg: '#401F07',
    bgHover: '#532707',
    bgActive: '#FFA873',
  },
  green: {
    color: '#30A66D',
    border: '#35AE74',
    borderActive: '#35AE74',
    text: '#58C08E',
    textActive: '#0B6139',
    subtext: '#7CA490',
    subtextActive: '#0B6139',
    bg: '#0B2E1C',
    bgHover: '#0A3F27',
    bgActive: '#9BE6C1',
  },
}

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

export function getWeekendDays(config) {
  // Support both weekendDays (preferred) and weekends (legacy) keys
  const raw = config?.weekendDays || config?.weekends
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [0]
  return raw
    .map((d) => {
      if (typeof d === 'number') return d
      if (typeof d === 'string') {
        const key = d.trim().toLowerCase()
        if (_weekdayNameToIndex.hasOwnProperty(key))
          return _weekdayNameToIndex[key]
      }
      return null
    })
    .filter((v) => v !== null && v >= 0 && v <= 6)
}

export function isWeekend(date, config) {
  const day = new Date(date).getDay()
  const weekendDays = getWeekendDays(config)
  return weekendDays.includes(day)
}

// Format single month & year (e.g., "August, 2025")
export function formatMonthYear(month, year) {
  return `${monthList[month]} ${year}`
}

// Extract ordered unique {month, year} pairs from a week of dates
export function getWeekMonthParts(weekDates) {
  const parts = []
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
