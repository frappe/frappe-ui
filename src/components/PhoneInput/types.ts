import type { InputSize, InputVariant } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

/** Variants supported by the control — a subset of the shared `InputVariant` scale. */
export type PhoneInputVariant = Exclude<InputVariant, 'ghost'>

export interface Country {
  /** Display name, e.g. "India". */
  name: string

  /** ISO2 code, e.g. "in". */
  code: string

  /** International dialing code, e.g. "+91". */
  isd: string
}

export interface PhoneInputProps extends InputLabelingProps {
  /**
   * ISO2 code of the country pre-selected when the value is empty.
   * Defaults to the country of the system timezone, falling back to `'in'`.
   */
  defaultCountry?: string

  /** Visual size of the control. */
  size?: InputSize

  /** Style variant of the control. */
  variant?: PhoneInputVariant

  /** Placeholder text for the number input. */
  placeholder?: string

  /** Disables the country picker and the number input. */
  disabled?: boolean
}

export interface PhoneInputSlots {
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  /** Content rendered at the end of the control shell. */
  suffix?: () => any
}
