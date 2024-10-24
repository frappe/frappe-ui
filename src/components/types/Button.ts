export interface ButtonProps {
  theme?: 'gray' | 'blue' | 'green' | 'red'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'
  label?: string
  icon?: string
  iconLeft?: string
  iconRight?: string
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  route?: string | object
  link?: string
}
