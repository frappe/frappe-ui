import type { Component, VNode } from 'vue'

export type ComboboxVariant = 'subtle' | 'outline' | 'ghost'

export type SelectableOption = {
  type?: 'option'
  label: string
  value: string
  icon?: string | Component
  disabled?: boolean
}

export type CustomOption = {
  type: 'custom'
  label: string
  key: string
  icon?: string | Component
  disabled?: boolean
  onClick: (context: { searchTerm: string }) => void
  keepOpen?: boolean
  slotName?: string
  render?: () => VNode
  condition?: (context: { searchTerm: string }) => boolean
}

export type SimpleOption = string | SelectableOption | CustomOption
export type GroupedOption = { group: string; options: SimpleOption[] }
export type ComboboxOption = SimpleOption | GroupedOption

export interface ComboboxProps {
  /** Visual style of the combobox */
  variant?: ComboboxVariant

  /** List of options to display */
  options: Array<ComboboxOption>

  /** Currently selected value (v-model) */
  modelValue?: string | null

  /** Placeholder text shown when no value is selected */
  placeholder?: string

  /** Disables the combobox */
  disabled?: boolean

  /** Opens the dropdown when the input is focused */
  openOnFocus?: boolean

  /** Opens the dropdown when the input is clicked */
  openOnClick?: boolean

  /** Dropdown placement relative to the input */
  placement?: 'start' | 'center' | 'end'
}
