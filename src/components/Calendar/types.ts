import type { Component, InjectionKey, Ref } from 'vue'

export type CalendarMode = 'Day' | 'Week' | 'Month'
export type CalendarTimeFormat = '12h' | '24h'

export interface CalendarColor {
  color: string
  border: string
  borderActive: string
  text: string
  textActive?: string
  subtext: string
  subtextActive: string
  bg: string
  bgHover: string
  bgActive: string
}

export interface CalendarEvent {
  id?: string | number
  name?: string | number
  title?: string
  date?: string
  fromDate?: string
  toDate?: string
  fromTime?: string
  toTime?: string
  fromDateTime?: string
  toDateTime?: string
  participant?: string
  venue?: string
  color?: string
  type?: string
  isFullDay?: boolean
  startTime?: number
  endTime?: number
  hallNumber?: number
  idx?: number
  [key: string]: unknown
}

export interface CalendarConfig {
  scrollToHour: number
  disableModes: CalendarMode[]
  defaultMode: CalendarMode
  isEditMode: boolean
  eventIcons: Record<string, Component>
  hourHeight: number
  enableShortcuts: boolean
  showIcon: boolean
  timeFormat: CalendarTimeFormat
  weekends: string[]
  noBorder?: boolean
}

export interface CalendarCellClickData {
  e: MouseEvent
  view: CalendarMode
  date: Date | string
  time: string
  isFullDay: boolean
}

export interface CalendarPublicProps {
  events: CalendarEvent[]
  config?: Partial<CalendarConfig>
  onClick?: (data: { e: MouseEvent; calendarEvent: CalendarEvent }) => void
  onDblClick?: (data: {
    e: MouseEvent | null
    calendarEvent: CalendarEvent
  }) => void
  onCellClick?: (data: CalendarCellClickData) => void
}

export interface CalendarActions {
  createNewEvent: (event: CalendarEvent) => void
  updateEventState: (event: CalendarEvent) => void
  deleteEvent: (eventID: CalendarEvent['id']) => void
  handleCellClick: (
    e: MouseEvent,
    date: Date | string,
    time?: string,
    isFullDay?: boolean,
  ) => void
  updateActiveView: (
    value: CalendarMode,
    date?: Date,
    isPreviousMonth?: boolean,
    isNextMonth?: boolean,
  ) => void
  props: CalendarPublicProps
}

export type GroupedCalendarEvents = Record<string, CalendarEvent[]>

export const ACTIVE_VIEW_KEY = Symbol(
  'frappe-ui.calendar.active-view',
) as InjectionKey<Ref<CalendarMode>>

export const CALENDAR_CONFIG_KEY = Symbol(
  'frappe-ui.calendar.config',
) as InjectionKey<CalendarConfig>

export const CALENDAR_ACTIONS_KEY = Symbol(
  'frappe-ui.calendar.actions',
) as InjectionKey<CalendarActions>
