/**
 * TimePicker is a thin wrapper around Combobox that adds time-aware parsing,
 * generated options, and configurable display formatting. Canonical value is
 * always 24-hour `HH:mm` (or `HH:mm:ss` if seconds were typed).
 */

import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { InputSize, InputVariant } from '../../composables/inputTypes'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

/**
 * The shared input variants, under the picker's own name. It is an alias, not
 * a copy: a TimePicker-only scale would need a TimePicker-only renderer.
 */
export type Variant = InputVariant

export interface TimePickerProps extends InputLabelingProps {
  /** Controlled value, canonical `HH:mm` (or `HH:mm:ss`). */
  modelValue?: string

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

  /** Keeps the popover open after a time is selected. */
  keepOpen?: boolean

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
}

/**
 * `open` and `close` are gone: `update:open` carries the same two events with
 * the state in the payload. `input-invalid` and `invalid-change` are gone too
 * — typed text that does not parse reverts to the last valid value, which the
 * user sees, and nothing listened to either event (INP-Q3).
 */
export type TimePickerEmits = {
  (e: 'update:modelValue', value: string): void
  (e: 'update:open', value: boolean): void
  (e: 'change', value: string): void
}
