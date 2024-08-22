import { computed } from 'vue'
import {
  groupBy,
  calculateMinutes,
  findOverlappingEventsCount,
} from '../calendarUtils'

export default function useCalendarData(events, view = '') {
  const timedEvents = computed(() => {
    let groupByDate = groupBy(events, (row) => row.date)
    let sortedArray = {}
    if (view === 'Month') {
      for (const [key, value] of Object.entries(groupByDate)) {
        sortedArray[key] = sortMonthlyEvents(value)
      }
    } else {
      for (let [key, value] of Object.entries(groupByDate)) {
        value = value.filter((event) => !event.isFullDay)
        value.forEach((task) => {
          task.startTime = calculateMinutes(task.from_time)
          task.endTime = calculateMinutes(task.to_time)
        })
        let sortedEvents = value.sort((a, b) => a.startTime - b.startTime)
        sortedArray[key] = findOverlappingEventsCount(sortedEvents)
      }
    }
    return sortedArray
  })

  const fullDayEvents = computed(() => {
    let fullDay = events.filter((event) => event.isFullDay)
    let dateGroup = groupBy(fullDay, (row) => row.date)
    return dateGroup
  })

  return { timedEvents, fullDayEvents }
}

function sortMonthlyEvents(events) {
  let fullDayEvents = events.filter((event) => event.isFullDay)
  let timedEvents = events
    .filter((event) => !event.isFullDay)
    .sort((a, b) =>
      a.from_time !== b.from_time
        ? calculateMinutes(a.from_time) > calculateMinutes(b.from_time)
          ? 1
          : -1
        : calculateMinutes(a.to_time) > calculateMinutes(b.to_time)
          ? 1
          : -1,
    )
  // full day events should be at the top in month view
  return [...fullDayEvents, ...timedEvents]
}
