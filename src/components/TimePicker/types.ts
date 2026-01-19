// Shared type definitions for TimePicker component

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
  /** Selected time (uncontrolled) */
  value?: string

  /** Selected time (v-model) */
  modelValue?: string

  /** Minute interval between options */
  interval?: number

  /** Custom time options */
  options?: Array<{ value: string; label?: string }>

  /** Popover placement */
  placement?: Placement

  /** Placeholder text when no value is selected */
  placeholder?: string

  /** Visual style variant */
  variant?: Variant

  /** Allow entering custom time values */
  allowCustom?: boolean

  /** Close picker automatically after selection */
  autoClose?: boolean

  /** Use 12-hour (AM/PM) format */
  use12Hour?: boolean

  /** Disable the time picker */
  disabled?: boolean

  /** Scroll behavior when opening the list */
  scrollMode?: 'center' | 'start' | 'nearest'

  /** Minimum selectable time */
  minTime?: string

  /** Maximum selectable time */
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
