import type { InputSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface RatingProps extends InputLabelingProps {
  /** The current rating value (controlled). */
  modelValue?: number

  /** Number of stars to render. Defaults to 5. */
  max?: number

  /**
   * Number of stars to render.
   * @deprecated Use `max` instead.
   */
  rating_from?: number

  /** If true, disables interaction and makes the rating read-only. */
  readonly?: boolean

  /** Size of the rating component. */
  size?: InputSize
}

export interface RatingEmits {
  /** Fired when the rating value changes. */
  'update:modelValue': [value: number]
}
