import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface CheckboxBaseProps extends InputLabelingProps {
  /** Controls the size of the checkbox */
  size?: ToggleSize

  /** Wraps the control and label in a clickable surface with hover, active and focus states — useful for selection lists and menu items. The control always stays on the leading side. */
  padded?: boolean

  /** Disables the checkbox interaction */
  disabled?: boolean

  /**
   * Renders the mixed "—" state (e.g. a select-all that's partially selected).
   * Purely visual — the native `indeterminate` DOM property is not reflected as
   * an attribute, so it must be set via this prop, not markup.
   */
  indeterminate?: boolean
}

/** Public prop shape; the component itself declares this model through `defineModel`. */
export type CheckboxProps = CheckboxBaseProps & {
  /** Checked state. `boolean` is canonical; `1`/`0` remain supported throughout v1. */
  modelValue?: boolean | 1 | 0
}
