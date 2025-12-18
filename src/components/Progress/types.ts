export interface ProgressProps {
  /** Current progress value */
  value: number

  /** Size of the progress bar: 'sm', 'md', 'lg', or 'xl' */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Optional text label displayed on the progress bar */
  label?: string

  /** Whether to show a hint/tooltip for the progress value */
  hint?: boolean

  /** Whether to show interval markers on the progress bar */
  intervals?: boolean

  /** Number of intervals to display if `intervals` is true */
  intervalCount?: number
}
