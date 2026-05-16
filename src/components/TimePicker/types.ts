// Shared type definitions for TimePicker component

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

// Variant aligns with TextInput variants (ghost not supported there)
export type Variant = 'outline' | 'subtle'

export interface Option {
  value: string
  label: string
}

export interface ParsedTimeValid {
  valid: true
  hh24: string
  mm: string
  ss?: string
  total: number
}
export interface ParsedTimeInvalid {
  valid: false
}
export type ParsedTime = ParsedTimeValid | ParsedTimeInvalid

export interface TimePickerProps {
  /**
   * Uncontrolled initial value for the picker.
   * @deprecated Use `modelValue` with `v-model` instead.
   */
  value?: string

  /** Controlled value for the picker. */
  modelValue?: string

  /** Minute interval between options. */
  interval?: number

  /** Custom time options. */
  options?: Array<{ value: string; label?: string }>

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
  placement?: Placement

  /** Placeholder text when no value is selected. */
  placeholder?: string

  /** Visual style variant. */
  variant?: Variant

  /** Prevents manual typing while keeping the picker interactive. */
  readonly?: boolean

  /**
   * Allows users to type custom time values into the input.
   * @deprecated Use `readonly` instead (inverse semantics: `allowCustom: false` → `readonly: true`).
   */
  allowCustom?: boolean

  /** Keeps the popover open after a time is selected. Default: false. */
  keepOpen?: boolean

  /**
   * Closes the popover after a value is picked.
   * @deprecated Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`).
   */
  autoClose?: boolean

  /** Use 12-hour (AM/PM) format. */
  use12Hour?: boolean

  /** Disable the time picker. */
  disabled?: boolean

  /** Scroll behavior when opening the list. */
  scrollMode?: 'center' | 'start' | 'nearest'

  /** Minimum selectable time. */
  minTime?: string

  /** Maximum selectable time. */
  maxTime?: string
}

export type TimePickerEmits = {
  /** Emitted when v-model value changes */
  (e: 'update:modelValue', value: string): void

  /** Emitted when the time value changes */
  (e: 'change', value: string): void

  /** Emitted when user input is invalid */
  (e: 'input-invalid', input: string): void

  /** Emitted when invalid state changes */
  (e: 'invalid-change', invalid: boolean): void

  /** Emitted when the picker is opened */
  (e: 'open'): void

  /** Emitted when the picker is closed */
  (e: 'close'): void
}
