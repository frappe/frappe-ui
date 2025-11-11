export interface AlertProps {
  title: string
  theme?: 'warning' | 'info' | 'error' | 'success'
  description?: string
  dismissable?: boolean
  onClose?: () => void
}
