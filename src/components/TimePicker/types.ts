/**
 * TimePicker is a thin wrapper around Combobox that adds time-aware parsing,
 * generated options, and configurable display formatting. Canonical value is
 * always 24-hour `HH:mm` (or `HH:mm:ss` if seconds were typed).
 */

import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { InputSize } from '../../composables/inputTypes'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export type Placement =
  | 'bottom-start'
  | 'top-start'
  | 'top-end'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

export type Variant = 'outline' | 'subtle'

export interface TimePickerProps extends InputLabelingProps {
  /** Controlled value, canonical `HH:mm` (or `HH:mm:ss`). */
  modelValue?: string

  /**
   * Uncontrolled initial value.
   * @deprecated Use `modelValue` with `v-model` instead.
   */
  value?: string

  /** Minute interval between generated options. */
  interval?: number

  /** Caller-provided option values; bypasses the generated grid. */
  options?: Array<{ value: string; label?: string }>

  /** Preferred popover side. */
  side?: PopoverSide

  /** Alignment of the popover along the trigger edge. */
  align?: PopoverAlign

  /** Gap between trigger and popover in pixels. */
  offset?: number

  /**
   * Combined side+align placement.
   * @deprecated Use `side` and `align` instead.
   */
  placement?: Placement

  /** Placeholder text when no value is selected. */
  placeholder?: string

  /** Visual style variant. */
  variant?: Variant

  /** Visual size of the trigger input. Forwarded to the underlying `TextInput`. */
  size?: InputSize

  /**
   * Whether the trigger input accepts typed input. When `false` the user can
   * still open the popover and pick a time, but cannot type a time manually.
   * Default: `true`.
   */
  typeable?: boolean

  /**
   * Prevents manual typing while keeping the picker interactive.
   * @deprecated Use `typeable: false` instead.
   */
  readonly?: boolean

  /**
   * Allows users to type custom time values.
   * @deprecated Use `typeable: false` instead.
   */
  allowCustom?: boolean

  /** Keeps the popover open after a time is selected. */
  keepOpen?: boolean

  /**
   * Closes the popover after a value is picked.
   * @deprecated Use `keepOpen` (inverse semantics).
   */
  autoClose?: boolean

  /**
   * Use 12-hour (am/pm) format for display.
   * @deprecated Use `format` instead.
   */
  use12Hour?: boolean

  /** Dayjs format string used for display. Default: `HH:mm`. */
  format?: string

  /** Disable the time picker. */
  disabled?: boolean

  /** Controlled popover open state. Use with `v-model:open` for two-way binding. */
  open?: boolean

  /** Opens the popover when the input receives focus. Default: false. */
  openOnFocus?: boolean

  /** Opens the popover when the input is clicked. Default: true. */
  openOnClick?: boolean

  /** Minimum selectable time as `HH:mm[:ss]`. */
  min?: string

  /** Maximum selectable time as `HH:mm[:ss]`. */
  max?: string

  /**
   * Minimum selectable time as `HH:mm[:ss]`.
   * @deprecated Use `min` instead.
   */
  minTime?: string

  /**
   * Maximum selectable time as `HH:mm[:ss]`.
   * @deprecated Use `max` instead.
   */
  maxTime?: string

  /**
   * Scroll behavior when opening the list.
   * @deprecated Scrolling is always centered now.
   */
  scrollMode?: 'center' | 'start' | 'nearest'
}

export type TimePickerEmits = {
  (e: 'update:modelValue', value: string): void
  (e: 'update:open', value: boolean): void
  (e: 'change', value: string): void
  (e: 'input-invalid', input: string): void
  (e: 'invalid-change', invalid: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
