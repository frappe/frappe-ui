import type { TextInputTypes } from '../types/TextInput'

export interface TextInputProps {
  /** HTML input type (text, email, number, password, etc.) */
  type?: TextInputTypes

  /** Visual size of the input */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Style variant of the input */
  variant?: 'subtle' | 'outline' | 'ghost'

  /** Placeholder text shown when the input is empty */
  placeholder?: string

  /** Disables the input when true */
  disabled?: boolean

  /** ID attribute for the input element */
  id?: string

  /** Bound value of the input */
  modelValue?: string | number

  /** Debounce delay (in ms) before emitting value updates */
  debounce?: number

  /** Marks the input as required */
  required?: boolean
}
