type SelectOption =
  | string
  | {
      label: string
      value: string
      disabled?: boolean
    }

export interface SelectProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  id?: string
  value?: string | number
  modelValue?: string | number
  options?: SelectOption[]
}
