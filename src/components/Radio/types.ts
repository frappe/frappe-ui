import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

/** The value a radio represents within its group. */
export type RadioValue = string | number | boolean

// `required` is intentionally omitted: a radio is one option within a group, so
// an asterisk belongs on the group's heading, not on each option's label. Mark
// a required group in your own markup (see the "Required" docs example). A
// native `required` attribute still passes through to the input if you need
// browser-level form validation.
export interface RadioProps extends Omit<InputLabelingProps, 'required'> {
  /** Controls the size of the radio */
  size?: ToggleSize

  /** Visual style of the radio row. `padded` wraps the control and label in a clickable surface with hover, active and focus states — useful for selection lists and menu items. The control always stays on the leading side. */
  variant?: 'default' | 'padded'

  /** The value this radio represents within its group. */
  value?: RadioValue

  /** Native `name` shared by radios in the same group. Radios that share a `name` behave as one group for keyboard arrow-key navigation. */
  name?: string

  /** Disables the radio and prevents interaction */
  disabled?: boolean

  /** The selected value of the group. A radio is checked when it equals `value`. */
  modelValue?: RadioValue
}

export interface RadioEmits {
  /** Fired when this radio is selected. */
  'update:modelValue': [value: RadioValue]
}
