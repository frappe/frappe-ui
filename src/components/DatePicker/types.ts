import type { Dayjs } from 'dayjs'

// Shared props for both single date and range pickers
export interface CommonDatePickerProps {
  /** Preferred popover placement relative to the trigger. */
  placement?: DatePickerPlacement

  /** Display format used for the input text. */
  format?: string

  /** Visual style variant passed through to the input. */
  variant?: 'subtle' | 'ghost' | 'outline'

  /** Prevents manual typing while keeping the picker interactive. */
  readonly?: boolean

  /** Placeholder text shown when no value is selected. */
  placeholder?: string

  /** Additional classes applied to the trigger input. */
  inputClass?: string | Array<string> | Record<string, boolean>

  /** Allows users to type custom date text into the input. */
  allowCustom?: boolean

  /** Closes the popover after a value is picked. */
  autoClose?: boolean

  /** Disables the trigger input and calendar interactions. */
  disabled?: boolean

  /** Optional label forwarded to the trigger input. */
  label?: string

  /** Shows clear and quick-action controls when enabled. */
  clearable?: boolean
}

export interface DatePickerProps extends CommonDatePickerProps {
  /** Uncontrolled initial value for the picker. */
  value?: string

  /** Controlled value for the picker. */
  modelValue?: string
}

export interface DateRangePickerProps extends CommonDatePickerProps {
  /** Uncontrolled initial range value. */
  value?: string | string[]

  /** Controlled range value. */
  modelValue?: string | string[]
}

export type DatePickerEmits = {
  /** Fired when the picker value changes. */
  (event: 'update:modelValue', value: string): void

  /** Fired after the picker commits a normalized value. */
  (event: 'change', value: string): void
}

export type DatePickerPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

export type DatePickerViewMode = 'date' | 'month' | 'year'

export interface DatePickerDateObj {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}
