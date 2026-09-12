import type { Dayjs } from 'dayjs/esm'
import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

// Re-exported, not redeclared: `index.ts` does `export * from './types'`, so a
// local copy publishes a second structurally identical `PopoverSide` at the
// package root that can drift from `Popover`'s without a compile error.
import type { PopoverAlign, PopoverSide } from '../Popover/types'
export type { PopoverAlign, PopoverSide }

// Shared props for both single date and range pickers
export interface CommonDatePickerProps extends InputLabelingProps {
  // Positioning — aligned with Combobox/Dropdown vocabulary
  /** Preferred popover side relative to the trigger. */
  side?: PopoverSide

  /** Alignment of the popover along the trigger edge. */
  align?: PopoverAlign

  /** Gap between the trigger and popover content in pixels. */
  offset?: number

  // Display
  /** Display format used for the input text. */
  format?: string

  /** Size of the trigger input. */
  size?: InputSize

  /** Visual style variant passed through to the input. */
  variant?: InputVariant

  /** Placeholder text shown when no value is selected. */
  placeholder?: string

  // Interaction
  /** Controls popover open state (for controlled usage). */
  open?: boolean

  /** Opens the popover when the input receives focus. Default: false. */
  openOnFocus?: boolean

  /** Opens the popover when the input is clicked. Default: true. */
  openOnClick?: boolean

  /**
   * Whether the trigger input accepts typed input. When `false` the user can
   * still open the popover and pick a date, but cannot type a date manually.
   * Default: `true`.
   */
  typeable?: boolean

  /** Disables the trigger input and calendar interactions. */
  disabled?: boolean

  /** Shows clear and quick-action controls when enabled. */
  clearable?: boolean

  /** Keeps the popover open after a date is selected. Default: false. */
  keepOpen?: boolean

  // Constraints
  /**
   * Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,
   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).
   */
  min?: string

  /**
   * Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,
   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).
   */
  max?: string

  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */
  isDateUnavailable?: (date: Dayjs) => boolean
}

export interface DatePickerProps extends CommonDatePickerProps {
  /** Controlled value for the picker. */
  modelValue?: string
}

export interface DateRangePickerProps extends CommonDatePickerProps {
  /** Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection. */
  modelValue?: string[]

  /** Render two calendar panels side by side (current month + next month). */
  dualPane?: boolean
}

export type DatePickerEmits = {
  /** Fired when the picker value changes. */
  (event: 'update:modelValue', value: string): void

  /** Fired when the popover open state changes. */
  (event: 'update:open', value: boolean): void

  /** Fired after the picker commits a normalized value. */
  (event: 'change', value: string): void
}

/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */
export type DateRangeValue = [string, string] | []

export type DateRangePickerEmits = {
  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */
  (event: 'update:modelValue', value: DateRangeValue): void

  /** Fired when the popover open state changes. */
  (event: 'update:open', value: boolean): void

  /** Fired after the picker commits a normalized range value. */
  (event: 'change', value: DateRangeValue): void
}

export interface DateTimePickerProps extends CommonDatePickerProps {
  /** Controlled value for the picker. */
  modelValue?: string

  /** Allows typing a custom time into the embedded time picker. */
  allowCustomTime?: boolean
}

export type DateTimePickerEmits = DatePickerEmits

// ── Slot prop shapes ─────────────────────────────────────────────────────────

/** Props bound to the trigger / prefix / suffix slots on all three pickers. */
export interface DatePickerTriggerSlotProps {
  /** Flips the popover open state, or sets it when passed a boolean. */
  toggle: (flag?: boolean | Event) => void
  /** Whether the popover is currently open. */
  open: boolean
  displayLabel: string
  inputValue: string
}

/** Props bound to the `actions` slot on `DatePicker`. */
export interface DatePickerActionsSlotProps {
  selected: string
  setDate: (date: string | Date | Dayjs) => void
  clear: () => void
  close: () => void
}

/** Props bound to the `actions` slot on `DateRangePicker`. */
export interface DateRangePickerActionsSlotProps {
  fromDate: string
  toDate: string
  /**
   * Commits one endpoint, mirroring a calendar cell click:
   * first call sets `from`, second call sets `to`.
   */
  setDate: (date: string | Date | Dayjs) => void
  /**
   * Commits both endpoints atomically. Normalizes order so the earlier
   * date becomes `from`. Use for fixed-window presets ("Last 7 days").
   */
  setRange: (range: [string | Date | Dayjs, string | Date | Dayjs]) => void
  clear: () => void
  close: () => void
}

/** Props bound to the `actions` slot on `DateTimePicker`. */
export interface DateTimePickerActionsSlotProps {
  selected: string
  time: string
  setDate: (date: string | Date | Dayjs) => void
  clear: () => void
  close: () => void
}

export interface DatePickerSlots {
  /** Custom trigger renderer for the picker. */
  trigger?: (props: DatePickerTriggerSlotProps) => any

  /** Content rendered before the trigger input value. */
  prefix?: (props: DatePickerTriggerSlotProps) => any

  /** Content rendered after the trigger input value. */
  suffix?: (props: DatePickerTriggerSlotProps) => any

  /**
   * Sidebar rendered to the left of the calendar. Use for date shortcuts
   * ("Today", "Tomorrow", "Last 7 days") and other preset actions. When
   * omitted, the popover shows the calendar only.
   */
  actions?: (props: DatePickerActionsSlotProps) => any
}

export interface DateRangePickerSlots {
  trigger?: (props: DatePickerTriggerSlotProps) => any

  prefix?: (props: DatePickerTriggerSlotProps) => any
  suffix?: (props: DatePickerTriggerSlotProps) => any

  /**
   * Sidebar rendered to the left of the calendar. Use for range shortcuts
   * ("Last 7 days", "Last 12 months") and other preset actions. When
   * omitted, the popover shows the calendar only.
   */
  actions?: (props: DateRangePickerActionsSlotProps) => any
}

export interface DateTimePickerSlots {
  trigger?: (props: DatePickerTriggerSlotProps) => any

  prefix?: (props: DatePickerTriggerSlotProps) => any
  suffix?: (props: DatePickerTriggerSlotProps) => any

  /**
   * Sidebar rendered to the left of the calendar. Use for date-time
   * shortcuts ("Now", "Tomorrow 9am") and other preset actions. When
   * omitted, the popover shows the calendar and time picker only.
   */
  actions?: (props: DateTimePickerActionsSlotProps) => any
}

export type DatePickerViewMode = 'date' | 'monthYear'

export interface DatePickerDateObj {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}

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
  /** Fired when the today button is pressed, before today's date is committed. */
  today: []
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
  /** Fired when the today button is pressed, before today's range is committed. */
  today: []
}

// ── CalendarPanel ────────────────────────────────────────────────────────────

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
