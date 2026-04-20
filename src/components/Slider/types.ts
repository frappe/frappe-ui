export type SliderValue = number[]

export interface SliderProps {
  /** Step interval between slider values */
  step?: number

  /** Maximum allowed slider value */
  max?: number

  /** Minimum allowed slider value */
  min?: number
}
