import type { TextInputTypes } from '../types/TextInput'
import type { FrappeUIError } from '../../composables/useInputLabeling'

export interface FormControlProps {
  /** Label text displayed above the input */
  label?: string
  /** Optional description or helper text shown below the input */
  description?: string
  /** Error message shown below the input. Sets aria-invalid on the control. */
  error?: string | FrappeUIError
  /** Type of input to render */
  type?:
    | TextInputTypes
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'autocomplete'
    | 'combobox'
    | 'multiselect'
  /** Size of the input */
  size?: 'sm' | 'md'
  /** Visual variant of the input */
  variant?: 'subtle' | 'outline'
  /** Whether the input is required */
  required?: boolean
}
