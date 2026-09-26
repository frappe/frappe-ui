export interface ProgressProps {
  /** Current progress value */
  value: number

  /** Size of the progress bar: "sm" | "md" | "lg" | "xl" */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Optional text label displayed on the progress bar */
  label?: string

  /** Whether to show a hint/tooltip for the progress value */
  hint?: boolean

  /** Number of interval markers to show; omit for a continuous progress bar */
  intervals?: number
}
