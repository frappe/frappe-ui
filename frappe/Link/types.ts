import { ComboboxVariant } from '../../src/components/Combobox/types'

export interface LinkProps {
  doctype: string
  variant?: ComboboxVariant
  label?: string
  placeholder?: string
  filters?: Record<string, string | [string, string] | boolean | number>
  required?: boolean
  allowCreate?: boolean
}

export type SelectOption = { value: string; label: string }
