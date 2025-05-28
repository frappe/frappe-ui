export type Variant = 'solid' | 'outline'

export type Theme = 'black' | 'red' | 'green' | 'blue' | 'orange'
export interface ThemeProps {
  primary: string
  secondary: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface SizeProps {
  ringSize: string
  ringBarWidth: string
  innerTextFontSize: string
  checkIconSize: string
}

export interface CircularProgressBarProps {
  step: number
  totalSteps: number
  showPercentage?: boolean
  variant?: Variant
  theme?: Theme | ThemeProps
  size?: Size
  themeComplete?: string
}
