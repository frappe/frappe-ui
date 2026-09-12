import type { Dayjs } from 'dayjs/esm'
import type {
  DatePickerDateObj,
  DatePickerViewMode,
  DateRangeValue,
} from './types'

// Types for the calendars. Not in `types.ts`, which `index.ts` re-exports: the
// calendars ship from `frappe-ui/experimental`, and `CalendarPanel` is internal.

// ── DateCalendar ─────────────────────────────────────────────────────────────

export interface DateCalendarProps {
  /**
   * Earliest selectable date in `YYYY-MM-DD` format. Also bounds keyboard
   * navigation and the year list.
   */
  min?: string

  /**
   * Latest selectable date in `YYYY-MM-DD` format. Also bounds keyboard
   * navigation and the year list.
   */
  max?: string

  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */
  isDateUnavailable?: (date: Dayjs) => boolean

  /** Label for the action that selects today. Empty hides the button. Default: `Today`. */
  todayLabel?: string
}

export type DateCalendarEmits = {
  /** Fired on every date click, even when it re-selects the current value. */
  select: [date: string]

  /** Fired when the Today button is pressed, with today's date. */
  today: [date: string]
}

export interface DateCalendarExposed {
  /** Move keyboard focus into the day grid. */
  focus(): void
}

// ── DateRangeCalendar ────────────────────────────────────────────────────────

export interface DateRangeCalendarProps {
  /**
   * Earliest selectable date in `YYYY-MM-DD` format. Also bounds keyboard
   * navigation and the year list.
   */
  min?: string

  /**
   * Latest selectable date in `YYYY-MM-DD` format. Also bounds keyboard
   * navigation and the year list.
   */
  max?: string

  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */
  isDateUnavailable?: (date: Dayjs) => boolean

  /** Label for the action that selects today. Empty hides the button. Default: `Today`. */
  todayLabel?: string

  /** Render two calendar panels side by side (current month + next month). */
  dualPane?: boolean
}

export type DateRangeCalendarEmits = {
  /**
   * Fired on every endpoint click, even when the range is unchanged. After the
   * first click it carries `[from, '']`.
   */
  select: [range: DateRangeValue]

  /** Fired when the Today button is pressed, with `[today, today]`. */
  today: [range: DateRangeValue]
}

export interface DateRangeCalendarExposed {
  /** Move keyboard focus into the day grid. */
  focus(): void
}

// ── CalendarPanel (internal) ─────────────────────────────────────────────────

/** A single day cell in the calendar grid. */
export interface CalendarPanelCell extends DatePickerDateObj {
  /** The date cannot be selected (outside `min`/`max`, or `isDateUnavailable`). */
  isUnavailable: boolean
  /** Start endpoint of a range selection. */
  isRangeStart?: boolean
  /** End endpoint of a range selection. */
  isRangeEnd?: boolean
  /** Between the two endpoints of a range selection. */
  inRange?: boolean
}

export interface CalendarPanelProps {
  /** Day grid or the month-year split view. */
  view: DatePickerViewMode
  /** Year the grid shows. */
  currentYear: number
  /** Month the grid shows, 0-indexed. */
  currentMonth: number
  /** The grid to render. The parent owns the selection and computes it. */
  weeks: CalendarPanelCell[][]
  /** Label for the optional Today/Now action button between prev/next. Empty/undefined hides it. */
  todayLabel?: string
  /** Hide the prev nav button — used in dual-pane right side. */
  hidePrev?: boolean
  /** Hide the next nav button — used in dual-pane left side. */
  hideNext?: boolean
  /** Hide the Today/Now button — used in dual-pane to avoid duplicates. */
  hideToday?: boolean
  /** Render out-of-month cells as empty placeholders — used in dual-pane to avoid showing the same date in both panes. */
  hideOutOfMonth?: boolean
  /**
   * Render a slim header with prev/next flanking a centered, non-clickable
   * month label. Used in dual-pane so the two panels read as
   * `< First Month | Second Month >`.
   */
  centerHeader?: boolean
  /** Earliest selectable date in YYYY-MM-DD format. Used to bound keyboard nav. */
  min?: string
  /** Latest selectable date in YYYY-MM-DD format. Used to bound keyboard nav. */
  max?: string
  /**
   * The date that currently holds the roving tabindex. Controlled — parent
   * owns the state, panel emits `update:focusedDate` when arrow keys land on
   * a new cell. Multiple panels (e.g. dual-pane DateRangePicker) can share
   * the same value; each panel only renders `tabindex=0` if the date falls
   * inside its own visible weeks.
   */
  focusedDate?: Dayjs | null
}

/** What a `CalendarPanel` ref gives its parent. */
export interface CalendarPanelExposed {
  focusInitialCell: () => void
}
