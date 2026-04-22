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

/**
 * Props for the Slider component.
 *
 * @example
 * const props: SliderProps = {
 *   min: 0,
 *   max: 100,
 *   step: 5,
 * }
 */
export interface SliderProps {
  /**
   * Step interval between slider values.
   *
   * @example
   * 5
   */
  step?: number

  /**
   * Maximum allowed slider value.
   *
   * @example
   * 100
   */
  max?: number

  /**
   * Minimum allowed slider value.
   *
   * @example
   * 0
   */
  min?: number
}
