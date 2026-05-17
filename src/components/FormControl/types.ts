import type { TextInputTypes } from '../types/TextInput'
import type { FrappeUIError } from '../../composables/useInputLabeling'

export interface FormControlProps {
  /** Label text displayed above the input */
  label?: string
  /** Optional description or helper text shown below the input */
  description?: string
  /** Error message shown below the input. Sets aria-invalid on the control. */
  error?: string | FrappeUIError
  /**
   * Type of input to render. FormControl is a thin dispatcher — it forwards
   * `label`/`description`/`error`/`required`/`size`/`variant` plus all
   * remaining attrs/listeners to the resolved child component. Type-specific
   * props (e.g. `options` for select/combobox, `min`/`max`/`formatter` for
   * date pickers, `:options` for multiselect) and the `v-model` value shape
   * follow the underlying component — see that component's docs/types for
   * the full surface. Slots are forwarded by name; only slot names declared
   * on FormControl get IDE typing, others pass through at runtime.
   */
  type?:
    | TextInputTypes
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'autocomplete'
    | 'combobox'
    | 'multiselect'
    | 'date'
    | 'daterange'
    | 'datetime'
    | 'time'
  /** Size of the input */
  size?: 'sm' | 'md'
  /** Visual variant of the input */
  variant?: 'subtle' | 'outline'
  /** Whether the input is required */
  required?: boolean
}
