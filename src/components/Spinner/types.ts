export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export type SpinnerTheme = 'gray' | 'red'

export interface SpinnerProps {
  /** Diameter — xs=12px, sm=14px, md=16px, lg=20px. Omit to size with classes (default 16px). */
  size?: SpinnerSize

  /** Spinner color. Omit to inherit the text color. */
  theme?: SpinnerTheme

  /** Show a faint track behind the arc */
  track?: boolean
}
