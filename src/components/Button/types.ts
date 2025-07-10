import { type RouteLocation } from 'vue-router'
import { type Component } from 'vue'

type Theme = 'gray' | 'blue' | 'green' | 'red'
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type Variant = 'solid' | 'subtle' | 'outline' | 'ghost'

export interface ButtonProps {
  theme?: Theme
  size?: Size
  variant?: Variant
  label?: string
  icon?: string | Component
  iconLeft?: string | Component
  iconRight?: string | Component
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  route?: RouteLocation
  link?: string
}

export type ThemeVariant = `${Theme}-${Variant}`
