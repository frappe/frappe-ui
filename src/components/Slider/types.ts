import type { ToggleSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

/**
 * Value model for the Slider component.
 * Use one number for a single-value slider or two numbers for a range slider.
 *
 * @example
 * const single: SliderValue = [25]
 *
 * @example
 * const range: SliderValue = [20, 80]
 */
export type SliderValue = number[]

export interface SliderProps extends InputLabelingProps {
  /** Step interval between slider values. */
  step?: number

  /** Maximum allowed slider value. */
  max?: number

  /** Minimum allowed slider value. */
  min?: number

  /** Visual size of the slider. */
  size?: ToggleSize

  /** Disables the slider. */
  disabled?: boolean
}

export interface SliderEmits {
  /** Fired once when the user finishes dragging the slider. */
  'value-commit': [value: SliderValue]
}
