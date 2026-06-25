import type { Dayjs } from 'dayjs/esm'
import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

// Shared props for both single date and range pickers
export interface CommonDatePickerProps extends InputLabelingProps {
  // Positioning — aligned with Combobox/Dropdown vocabulary
  /** Preferred popover side relative to the trigger. */
  side?: PopoverSide

  /** Alignment of the popover along the trigger edge. */
  align?: PopoverAlign

  /** Gap between the trigger and popover content in pixels. */
  offset?: number

  /**
   * Preferred popover placement relative to the trigger.
   * @deprecated Use `side` and `align` instead.
   */
  placement?: DatePickerPlacement

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

  /**
   * Prevents manual typing while keeping the picker interactive.
   * @deprecated Use `typeable: false` instead.
   */
  readonly?: boolean

  /** Disables the trigger input and calendar interactions. */
  disabled?: boolean

  /** Shows clear and quick-action controls when enabled. */
  clearable?: boolean

  /** Keeps the popover open after a date is selected. Default: false. */
  keepOpen?: boolean

  /**
   * Closes the popover after a value is picked.
   * @deprecated Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`).
   */
  autoClose?: boolean

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

  // Deprecated
  /**
   * Allows users to type custom date text into the input.
   * @deprecated Use `typeable: false` instead.
   */
  allowCustom?: boolean

  /**
   * Additional classes applied to the trigger input.
   * @deprecated Apply `class` directly to the DatePicker component element to control width.
   */
  inputClass?: string | Array<string> | Record<string, boolean>
}

export interface DatePickerProps extends CommonDatePickerProps {
  /**
   * Uncontrolled initial value for the picker.
   * @deprecated Use `modelValue` with `v-model` instead.
   */
  value?: string

  /** Controlled value for the picker. */
  modelValue?: string
}

export interface DateRangePickerProps extends CommonDatePickerProps {
  /**
   * Uncontrolled initial range value as `[from, to]` in `YYYY-MM-DD` format.
   * @deprecated Use `modelValue` with `v-model` instead.
   */
  value?: string[]

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

  /**
   * Fired after the picker commits a normalized value.
   * @deprecated Functionally identical to `update:modelValue`. Bind via `v-model` instead.
   */
  (event: 'change', value: string): void
}

/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */
export type DateRangeValue = [string, string] | []

export type DateRangePickerEmits = {
  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */
  (event: 'update:modelValue', value: DateRangeValue): void

  /** Fired when the popover open state changes. */
  (event: 'update:open', value: boolean): void

  /**
   * Fired after the picker commits a normalized range value.
   * @deprecated Functionally identical to `update:modelValue`. Bind via `v-model` instead.
   */
  (event: 'change', value: DateRangeValue): void
}

export interface DateTimePickerProps extends CommonDatePickerProps {
  /**
   * Uncontrolled initial value for the picker.
   * @deprecated Use `modelValue` with `v-model` instead.
   */
  value?: string

  /** Controlled value for the picker. */
  modelValue?: string

  /**
   * Earliest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.
   * @deprecated Use `min` instead.
   */
  minDateTime?: string

  /**
   * Latest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.
   * @deprecated Use `max` instead.
   */
  maxDateTime?: string

  /** Allows typing a custom time into the embedded time picker. */
  allowCustomTime?: boolean
}

export type DateTimePickerEmits = DatePickerEmits

export type DatePickerPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

// ── Slot prop shapes ─────────────────────────────────────────────────────────

/** Props bound to the trigger / prefix / suffix slots on all three pickers. */
export interface DatePickerTriggerSlotProps {
  togglePopover: () => void
  isOpen: boolean
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
  setRange: (
    range: [string | Date | Dayjs, string | Date | Dayjs],
  ) => void
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

  /**
   * Custom trigger renderer for the picker.
   * @deprecated Use `#trigger` instead. `#target` remains as a back-compat alias through v1.x.
   */
  target?: (props: DatePickerTriggerSlotProps) => any

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

  /** @deprecated Use `#trigger` instead. */
  target?: (props: DatePickerTriggerSlotProps) => any

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

  /** @deprecated Use `#trigger` instead. */
  target?: (props: DatePickerTriggerSlotProps) => any

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
