export interface RatingProps {
  /** The current rating value (controlled) */
  modelValue?: number

  /** Minimum rating value (default is 0 or 1 depending on implementation) */
  rating_from?: number

  /** Optional label displayed alongside the rating */
  label?: string

  /** If true, disables interaction and makes the rating read-only */
  readonly?: boolean

  /** Size of the rating component */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
