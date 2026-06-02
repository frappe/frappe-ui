import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface CheckboxProps extends InputLabelingProps {
  /** Controls the size of the checkbox */
  size?: ToggleSize

  /**
   * Visual style of the checkbox row.
   * `padded` wraps the control and label in a clickable surface with hover,
   * active and focus states — useful for selection lists and menu items.
   * The control always stays on the leading side.
   */
  variant?: 'default' | 'padded'

  /** Disables the checkbox interaction */
  disabled?: boolean

  /**
   * Adds padding around the checkbox.
   * @deprecated Use `variant="padded"` instead.
   */
  padding?: boolean

  /** Checked state of the checkbox. `boolean` is canonical; `1`/`0` are kept for v1 backwards compatibility. */
  modelValue?: boolean | 1 | 0
}

export interface CheckboxEmits {
  /** Fired when the checkbox value changes. */
  'update:modelValue': [value: boolean]
}
