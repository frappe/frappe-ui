import { type RouterLinkProps } from 'vue-router'
import { type Component } from 'vue'

type Theme = 'gray' | 'blue' | 'green' | 'red'
type Size = 'sm' | 'md' | 'md' | 'lg' | 'xl' | '2xl'
type Variant = 'solid' | 'subtle' | 'outline' | 'ghost'

export interface ButtonProps {
  /** Visual color theme of the button */
  theme?: Theme

  /** Controls the button size */
  size?: Size

  /** Visual style of the button */
  variant?: Variant

  /** Text label displayed inside the button */
  label?: string

  /**
   * Icon shown when no left or right icon is specified.
   * Static literals like `icon="menu"` are rewritten to per-icon Lucide imports
   * when using `frappe-ui/vite`.
   */
  icon?: string | Component

  /**
   * Icon shown before the label.
   * Static literals like `icon-left="menu"` are rewritten to per-icon Lucide
   * imports when using `frappe-ui/vite`.
   */
  iconLeft?: string | Component

  /**
   * Icon shown after the label.
   * Static literals like `icon-right="menu"` are rewritten to per-icon Lucide
   * imports when using `frappe-ui/vite`.
   */
  iconRight?: string | Component

  /** Tooltip text shown on hover */
  tooltip?: string

  /** Shows a loading state and disables interaction */
  loading?: boolean

  /** Text shown while the button is loading */
  loadingText?: string

  /** Disables the button */
  disabled?: boolean

  /** Router destination when used as a link */
  route?: RouterLinkProps['to']

  /** External link URL */
  link?: string

  /** Native button type */
  type?: 'button' | 'submit' | 'reset'
}

/** Combined theme and variant key */
export type ThemeVariant = `${Theme}-${Variant}`
