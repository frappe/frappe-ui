import { type Component } from 'vue'
import type { InputSize } from '../../composables/inputTypes'
import type { InputLabelingProps } from '../../composables/useInputLabeling'

export interface RatingProps extends InputLabelingProps {
  /** The current rating value (controlled). In star units, `0..max`, in increments of `step`. */
  modelValue?: number

  /** Number of stars to render. Defaults to 5. */
  max?: number

  /**
   * Granularity of the rating value. `1` for whole stars, `0.5` for half stars.
   * Defaults to `1`.
   */
  step?: 1 | 0.5

  /**
   * Number of stars to render.
   * @deprecated Use `max` instead.
   */
  rating_from?: number

  /** If true, disables interaction and makes the rating read-only. */
  readonly?: boolean

  /**
   * Icon to render for each star. Accepts a Vue component (e.g. an auto-imported
   * lucide icon: `import Heart from '~icons/lucide/heart'`).
   * The component receives `fill="currentColor"` so closed-path SVGs render filled.
   * Defaults to a filled lucide-star.
   */
  icon?: string | Component

  /** Size of the rating component. */
  size?: InputSize
}

export interface RatingEmits {
  /** Fired when the rating value changes. */
  'update:modelValue': [value: number]
}
