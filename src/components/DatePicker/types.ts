import type { Dayjs } from 'dayjs/esm'

// Shared props for both single date and range pickers
export interface CommonDatePickerProps {
  placement?: DatePickerPlacement
  format?: string
  variant?: 'subtle' | 'ghost' | 'outline'
  readonly?: boolean
  placeholder?: string
  inputClass?: string | Array<string> | Record<string, boolean>
  allowCustom?: boolean
  autoClose?: boolean
  disabled?: boolean
  label?: string
  clearable?: boolean
}

export interface DatePickerProps extends CommonDatePickerProps {
  value?: string
  modelValue?: string
}

export interface DateRangePickerProps extends CommonDatePickerProps {
  value?: string | string[]
  modelValue?: string | string[]
}

export type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
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
