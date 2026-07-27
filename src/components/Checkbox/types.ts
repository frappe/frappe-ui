import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface CheckboxBaseProps extends InputLabelingProps {
  /** Controls the size of the checkbox */
  size?: ToggleSize

  /** Disables the checkbox interaction */
  disabled?: boolean

  /**
   * Adds padding around the checkbox.
   * @deprecated Use `data-*` styling hooks instead.
   */
  padding?: boolean

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
