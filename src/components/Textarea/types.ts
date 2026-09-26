import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface TextareaProps extends InputLabelingProps {
  /**
   * Controls spacing, corner radius and the minimum height of the textarea.
   * Textarea text is a fixed 13px at every size, so `size` does not change
   * the type scale the way it does on a single-line input.
   */
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
