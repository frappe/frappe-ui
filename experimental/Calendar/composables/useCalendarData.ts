import { ref, computed } from 'vue'
import { calculateMinutes, findOverlappingEventsCount } from '../calendarUtils'
import { daySegments, isAllDayLike } from '../eventSpan'
import type { CalendarEvent, GroupedCalendarEvents } from '../types'

export const activeEvent = ref<string | number>('')

/**
 * Splits events between the time grid and the all-day row.
 *
 * `timedEvents` holds one entry per day, each the day's pieces of the events
 * that belong in the time grid (an overnight event contributes a piece to
 * each of its two days) laid out into overlap columns. `allDayEvents` is the
 * rest: full-day events and multi-day timed ones, which the views pack into
 * lanes per row with `layoutRow`.
 */
export default function useCalendarData(events: CalendarEvent[] = []) {
  const timedEvents = computed(() => {
    const grouped: GroupedCalendarEvents = {}
    for (const event of events) {
      if (isAllDayLike(event)) continue
      for (const segment of daySegments(event)) {
        segment.startTime = calculateMinutes(segment.segFromTime)
        segment.endTime = calculateMinutes(segment.segToTime)
        ;(grouped[segment.date] ||= []).push(segment)
      }
    }
    for (const [date, segments] of Object.entries(grouped)) {
      grouped[date] = findOverlappingEventsCount(segments)
    }
    return grouped
  })

  const allDayEvents = computed(() => events.filter(isAllDayLike))

  return { timedEvents, allDayEvents }
}
