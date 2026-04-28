import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { TextInputTypes } from '../types/TextInput'

export interface TextInputProps extends InputLabelingProps {
  /** HTML input type (text, email, number, password, etc.). */
  type?: TextInputTypes

  /** Visual size of the input. */
  size?: InputSize

  /** Style variant of the input. */
  variant?: InputVariant

  /** Placeholder text shown when the input is empty. */
  placeholder?: string

  /** Disables the input when true. */
  disabled?: boolean

  /** Bound value of the input. */
  modelValue?: string | number

  /** Debounce delay (in ms) before emitting value updates. */
  debounce?: number
}

export interface TextInputEmits {
  /** Fired when the input value changes. */
  'update:modelValue': [value: string]
}
