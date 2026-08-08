import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface PasswordProps extends InputLabelingProps {
  /** Visual size of the input. */
  size?: InputSize

  /** Style variant of the input. */
  variant?: InputVariant

  /** Placeholder text shown when the input is empty. */
  placeholder?: string

  /** Disables the input when true. */
  disabled?: boolean
}
