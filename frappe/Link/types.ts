export interface LinkProps {
  doctype: string
  label?: string
  placeholder?: string
  modelValue?: string
  filters?: Record<string, string | [string, string]>
  required?: boolean
}

export type SelectOption = { value: string, label: string, description: string }
