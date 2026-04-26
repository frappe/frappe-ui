import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface TextareaProps extends InputLabelingProps {
  /** Controls the visual size of the textarea. */
  size?: InputSize

  /** Visual style variant. */
  variant?: InputVariant

  /** Placeholder text shown when empty. */
  placeholder?: string

  /** Disables user interaction. */
  disabled?: boolean

  /** Bound value of the textarea. */
  modelValue?: string

  /** Debounce delay (ms) before emitting value updates. */
  debounce?: number

  /** Number of visible text rows. */
  rows?: number
}

export interface TextareaEmits {
  /** Fired when the textarea value changes. */
  'update:modelValue': [value: string]
}
