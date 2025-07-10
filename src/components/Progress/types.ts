export interface ProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  hint?: boolean
  intervals?: boolean
  intervalCount?: number
}
