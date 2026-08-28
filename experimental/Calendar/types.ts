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
  /**
   * First and last day, inclusive. An event whose `toDate` is later than
   * its `fromDate` spans those days: the Month view draws it as one bar,
   * the Week view puts it in the all-day row (or, for a timed event shorter
   * than a day, splits it at midnight in the time grid).
   */
  fromDate?: string
  toDate?: string
  fromTime?: string
  /** A timed event ending at `00:00` on `toDate` stops as that day begins. */
  toTime?: string
  fromDateTime?: string
  toDateTime?: string
  participant?: string
  venue?: string
  color?: string
  type?: string
  /** Ignores the times and covers `fromDate`..`toDate` whole. */
  isFullDay?: boolean
  /** Saved but not sent: drawn as a dashed outline instead of a filled pill. */
  isDraft?: boolean
  /**
   * The viewer said no. The title is struck through, and in the Week and Day
   * views the event claims no room: overlapping events lay out as if it were
   * not there and it sits full width beneath them.
   */
  isDeclined?: boolean
  startTime?: number
  endTime?: number
  hallNumber?: number
  idx?: number
  [key: string]: unknown
}

/**
 * One day's piece of an event in the time grid. The `seg*` fields place the
 * piece; the views set them and strip them again before an event leaves
 * through an emit.
 */
export interface CalendarDaySegment extends CalendarEvent {
  date: string
  segFromTime: string
  segToTime: string
  /** Whether this piece is the event's first / last day. */
  segIsStart: boolean
  segIsEnd: boolean
}

/** An event clipped to one row of days and packed into a lane. */
export interface CalendarRowBar {
  event: CalendarEvent
  /** First and last column the bar covers, inclusive. */
  startCol: number
  endCol: number
  /** Vertical slot; the same across every day of the row. */
  lane: number
  /** Whether the event begins / ends inside this row. */
  isStart: boolean
  isEnd: boolean
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
  /** Moves the calendar to a date, or to today when none is given. */
  setCalendarDate: (date?: Date | string) => void
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
