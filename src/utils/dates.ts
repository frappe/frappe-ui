type DateConstructorParam = string | number | Date

function getDate(...args: DateConstructorParam[]): Date {
  return new Date(...(args as [DateConstructorParam]))
}

function getDateValue(date: Date | string) {
  if (!date || date.toString() === 'Invalid Date') return ''

  if (typeof date === 'string') {
    date = new Date(date)
  }

  // toISOString is buggy and reduces the day by one
  // this is because it considers the UTC timestamp
  // in order to circumvent that we need to use luxon/moment
  // but that refactor could take some time, so fixing the time difference
  // as suggested in this answer.
  // https://stackoverflow.com/a/16084846/3541205
  date.setHours(0, -date.getTimezoneOffset(), 0, 0)
  return date.toISOString().slice(0, 10)
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

export { getDate, getDateValue, getDatesAfter, getDaysInMonth, isLeapYear }
