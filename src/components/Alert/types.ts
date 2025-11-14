type Theme =  'yellow' | 'blue' | 'red' | 'green'

export interface AlertProps {
  title: string
  theme?: Theme
  variant?: 'subtle' | 'outline'
  description?: string
  dismissable?: boolean
}
