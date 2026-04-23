import type { Component } from 'vue'

export type SelectOptionValue = string | number | bigint | Record<string, any>

export type SelectOption =
  | string
  | {
      label: string
      value: SelectOptionValue
      disabled?: boolean
      icon?: string | Component
      description?: string
      slot?: string
      [key: string]: any
    }

export type SelectNormalizedOption = Exclude<SelectOption, string>

export interface SelectProps {
  /** Size of the select input */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Visual style of the select input */
  variant?: 'subtle' | 'outline' | 'ghost'

  /** Placeholder text displayed when no option is selected */
  placeholder?: string

  /** If true, disables the select input */
  disabled?: boolean

  /** Optional HTML id for the select element */
  id?: string

  /** The currently selected value (controlled) */
  modelValue?: SelectOptionValue

  /** Controls the visibility of the select menu */
  open?: boolean

  /** Options to display in the dropdown */
  options?: SelectOption[]
}

export interface SelectTriggerSlotProps {
  open: boolean
  disabled: boolean
  selectedOption: SelectNormalizedOption | null
  displayValue: string
}

export interface SelectItemSlotProps {
  option: SelectNormalizedOption
}

export interface SelectEmits {
  'update:modelValue': [value: SelectOptionValue | undefined]
  'update:open': [value: boolean]
}
