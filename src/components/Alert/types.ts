export interface AlertProps {
  title: string
  theme?: 'warning' | 'info' | 'error' | 'success'
  description?: string
  dismissible?: boolean
  onClose?: () => void
}
