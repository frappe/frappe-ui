import type { TextInputTypes } from '../types/TextInput'

export interface TextInputProps {
  type?: TextInputTypes
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: string | number
  debounce?: number
  required?: boolean
}
