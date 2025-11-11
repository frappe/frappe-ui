export interface AlertProps {
  title: string
  theme?: 'warning' | 'info' | 'error' | 'success'
  variant?: 'subtle' | 'outline'
  description?: string
  dismissable?: boolean
}
