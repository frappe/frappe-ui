import { computed, ref } from 'vue'
import { getDate, getDatesAfter, getDaysInMonth } from './dates'

export function useDatePicker() {
  const currentYear = ref<number>(0)
  const currentMonth = ref<number>(0)

  const today = computed(() => getDate())

  const dates = computed(() => {
    if (!(currentYear.value && currentMonth.value)) {
      return []
    }
    const monthIndex = currentMonth.value - 1
    const year = currentYear.value

    const firstDayOfMonth = getDate(year, monthIndex, 1)
    const lastDayOfMonth = getDate(year, monthIndex + 1, 0)
    const leftPaddingCount = firstDayOfMonth.getDay()
    const rightPaddingCount = 6 - lastDayOfMonth.getDay()

    const leftPadding = getDatesAfter(firstDayOfMonth, -leftPaddingCount)
    const rightPadding = getDatesAfter(lastDayOfMonth, rightPaddingCount)
    const daysInMonth = getDaysInMonth(monthIndex, year)
    const datesInMonth = getDatesAfter(firstDayOfMonth, daysInMonth - 1)

    let dates = [
      ...leftPadding,
      firstDayOfMonth,
      ...datesInMonth,
      ...rightPadding,
    ]

    if (dates.length < 42) {
      const lastDate = dates.at(-1)
      if (lastDate) {
        const finalPadding = getDatesAfter(lastDate, 42 - dates.length)
        dates = dates.concat(...finalPadding)
      }
    }
    return dates
  })

  const datesAsWeeks = computed(() => {
    const datesAsWeeks: Date[][] = []
    const computedDates = dates.value.slice()
    while (computedDates.length) {
      const week = computedDates.splice(0, 7)
      datesAsWeeks.push(week)
    }
    return datesAsWeeks
  })

  const formattedMonth = computed(() => {
    if (!(currentYear.value && currentMonth.value)) {
      return ''
    }
    const date = getDate(currentYear.value, currentMonth.value - 1, 1)
    const month = date.toLocaleString('en-US', {
      month: 'long',
    })
    return `${month}, ${date.getFullYear()}`
  })

  function prevMonth() {
    changeMonth(-1)
  }

  function nextMonth() {
    changeMonth(1)
  }

  function changeMonth(adder: number) {
    currentMonth.value = currentMonth.value + adder
    if (currentMonth.value < 1) {
      currentMonth.value = 12
      currentYear.value = currentYear.value - 1
    }
    if (currentMonth.value > 12) {
      currentMonth.value = 1
      currentYear.value = currentYear.value + 1
    }
  }

  return {
    currentYear,
    currentMonth,
    today,
    dates,
    datesAsWeeks,
    formattedMonth,
    prevMonth,
    nextMonth,
    changeMonth,
  }
}
