import LoadingIndicatorComponent from './LoadingIndicator.vue'

/**
 * @deprecated Use `Spinner`, which takes the same props. `LoadingIndicator`
 * warns once in development and is removed after v1.
 */
export const LoadingIndicator = LoadingIndicatorComponent

/** @deprecated Use `SpinnerProps`. */
export type { SpinnerProps as LoadingIndicatorProps } from '../Spinner'
