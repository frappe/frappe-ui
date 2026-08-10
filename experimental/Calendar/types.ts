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
  /** Hour (0-23) the Week and Day views scroll to on mount. */
  scrollToHour: number

  /** Views removed from the view switcher in the default header. */
  disableModes: CalendarMode[]

  /** View shown when the calendar mounts. */
  defaultMode: CalendarMode

  /**
   * Enables editing: create events by clicking a cell, edit on double
   * click, drag to move, resize, and delete with the keyboard.
   */
  isEditMode: boolean

  /** Icons keyed by an event's `type` field. */
  eventIcons: Record<string, Component>

  /** Pixel height of one hour row in the Week and Day views. */
  hourHeight: number

  /**
   * Enables keyboard shortcuts: `m`/`w`/`d` switch views, `t` jumps to
   * today, arrow keys navigate, Delete removes the open event.
   */
  enableShortcuts: boolean

  /** Shows the event's `eventIcons` icon on its card. */
  showIcon: boolean

  /** Clock format for time labels: `'12h'` or `'24h'`. */
  timeFormat: CalendarTimeFormat

  /**
   * Days shaded as weekend. Weekday names (`'sunday'`) or indexes
   * (0 = Sunday).
   */
  weekends: string[]

  /** Removes the outer grid border. */
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
  /** Events to render. Each needs an `id`, a title, and date/time fields. */
  events: CalendarEvent[]

  /** Behavior overrides, merged over the defaults. */
  config?: Partial<CalendarConfig>

  /**
   * Replaces the default single-click behavior (opening the event
   * popover) with your own handler.
   */
  onClick?: (data: { e: MouseEvent; calendarEvent: CalendarEvent }) => void

  /**
   * Replaces the default double-click behavior (opening the edit
   * modal) with your own handler.
   */
  onDblClick?: (data: {
    e: MouseEvent | null
    calendarEvent: CalendarEvent
  }) => void

  /**
   * Replaces the default cell-click behavior (opening the new-event
   * modal in edit mode) with your own handler.
   */
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
