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
  value?: string
  modelValue?: string
  interval?: number
  options?: Array<{ value: string; label?: string }>
  placement?: Placement
  placeholder?: string
  variant?: Variant
  allowCustom?: boolean
  autoClose?: boolean
  use12Hour?: boolean
  disabled?: boolean
  scrollMode?: 'center' | 'start' | 'nearest'
  minTime?: string
  maxTime?: string
}

export type TimePickerEmits = {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'input-invalid', input: string): void
  (e: 'invalid-change', invalid: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
