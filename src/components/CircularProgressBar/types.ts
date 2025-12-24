export type Variant = 'solid' | 'outline'

export type Theme = 'black' | 'red' | 'green' | 'blue' | 'orange'
export interface ThemeProps {
  primary: string
  secondary: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface SizeProps {
  ringSize: string
  ringBarWidth: string
  innerTextFontSize: string
  checkIconSize: string
}

/** Props for the CircularProgressBar component */
export interface CircularProgressBarProps {
  /** Current step or progress value */
  step: number

  /** Total steps for completion */
  totalSteps: number

  /** Show numeric percentage inside the circle */
  showPercentage?: boolean

  /** Visual style of the progress bar */
  variant?: 'solid' | 'outline'

  /** Theme used for the progress bar (predefined or custom colors) */
  theme?: 'black' | 'red' | 'green' | 'blue' | 'orange' | { primary: string; secondary: string }

  /** Size of the progress bar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  /** Color used when the progress completes */
  themeComplete?: string
}
