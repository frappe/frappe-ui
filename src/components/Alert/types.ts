/**
 * Visual theme used to style the alert
 */
type Theme = 'yellow' | 'blue' | 'red' | 'green'

export interface AlertProps {
  /**
   * Main heading text of the alert
   */
  title: string

  /**
   * Color theme of the alert
   * @default 'blue'
   */
  theme?: Theme

  /**
   * Visual style of the alert container
   * @default 'subtle'
   */
  variant?: 'subtle' | 'outline'

  /**
   * Optional supporting text shown below the title
   */
  description?: string

  /**
   * Whether the alert can be closed by the user
   * @default false
   */
  dismissable?: boolean
}
