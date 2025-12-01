export interface LinkProps {
  doctype: string
  label?: string
  placeholder?: string
  filters?: Record<string, string | [string, string] | boolean | number>
  required?: boolean
  allowCreate?: boolean
}

export type SelectOption = { value: string; label: string }
