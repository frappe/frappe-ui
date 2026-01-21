import type { TextInputTypes } from '../types/TextInput'

export interface FormControlProps {
  /** Label text displayed above the input */
  label?: string
  /** Optional description or helper text shown below the input */
  description?: string
  /** Type of input to render */
  type?: TextInputTypes | 'textarea' | 'select' | 'checkbox' | 'autocomplete' | 'combobox'
  /** Size of the input */
  size?: 'sm' | 'md'
  /** Visual variant of the input */
  variant?: 'subtle' | 'outline'
  /** Whether the input is required */
  required?: boolean
}
