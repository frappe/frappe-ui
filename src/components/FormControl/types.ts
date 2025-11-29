import type { TextInputTypes } from '../types/TextInput'

export interface FormControlProps {
  label?: string
  description?: string
  type?: TextInputTypes | 'textarea' | 'select' | 'checkbox' | 'autocomplete' | 'combobox'
  size?: 'sm' | 'md'
  variant?: 'subtle' | 'outline'
  required?: boolean
}
