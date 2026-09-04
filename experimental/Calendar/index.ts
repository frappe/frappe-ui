export { default as Calendar } from './Calendar.vue'
export { colorMap as CalendarColorMap } from './calendarUtils'
export { activeEvent as CalendarActiveEvent } from './composables/useCalendarData'
// A consumer filling `#event-description` still wants the calendar's own note
// about a multi-day event — which day of the stay this row is — placed where
// its own line wants it.
export { daySpan as calendarDaySpan } from './eventRow'
export type {
  CalendarActions,
  CalendarCellClickData,
  CalendarConfig,
  CalendarEvent,
  CalendarMode,
  CalendarPublicProps,
  CalendarTimeFormat,
  GroupedCalendarEvents,
} from './types'
