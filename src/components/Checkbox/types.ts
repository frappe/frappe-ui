import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface CheckboxProps extends InputLabelingProps {
  /** Controls the size of the checkbox */
  size?: ToggleSize

  /** Disables the checkbox interaction */
  disabled?: boolean

  /**
   * Adds padding around the checkbox.
   * @deprecated Use `data-*` styling hooks instead.
   */
  padding?: boolean

  /** Checked state of the checkbox. `boolean` is canonical; `1`/`0` are kept for v1 backwards compatibility. */
  modelValue?: boolean | 1 | 0
}

export interface CheckboxEmits {
  /** Fired when the checkbox value changes. */
  'update:modelValue': [value: boolean]
}
