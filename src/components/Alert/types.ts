export interface AlertProps {
  title: string
  type?: 'warning' | 'info' | 'error' | 'success'
  desc?: string
  closeIcon?: boolean
}
