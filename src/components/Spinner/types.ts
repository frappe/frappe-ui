export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export type SpinnerTheme = 'gray' | 'red'

export interface SpinnerProps {
  /** Diameter of the spinner — xs=12px, sm=14px, md=16px, lg=20px. Pass `null` to size it with a width/height class instead. */
  size?: SpinnerSize | null

  /** Color tone of the spinner. Pass `null` to inherit the current text color. */
  theme?: SpinnerTheme | null

  /** Show a faint full-circle track behind the spinning arc */
  track?: boolean
}
