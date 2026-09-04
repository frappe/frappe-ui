export { default as Calendar } from './Calendar.vue'
export { colorMap as CalendarColorMap } from './calendarUtils'
export { activeEvent as CalendarActiveEvent } from './composables/useCalendarData'
// A consumer filling `#event-description` still wants the calendar's own note
// about an event running past the day, placed where its own line wants it.
export { continuesTo as calendarContinuesTo } from './eventRow'
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
