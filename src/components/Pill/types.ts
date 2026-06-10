import type { Component } from 'vue'

export type PillSize = 'sm' | 'md'
export type PillVariant = 'default' | 'outline' | 'underline' | 'browser-tab'
export type BrowserTabBase = 'none' | 'default' | 'left' | 'right'
export type PillIcon = string | Component
export type PillOrientation = 'horizontal' | 'vertical'
export type PillActiveStyle = 'raised' | 'subtle'

export interface PillProps {
  /** Text shown inside the pill. */
  label?: string | number

  /** Visual variant. */
  variant?: PillVariant

  /** Size of the pill. */
  size?: PillSize

  /** Active/selected state. */
  active?: boolean

  /**
   * Icon-only content. When set, the pill renders as a square icon button
   * and any `label` is exposed only to assistive tech (sr-only).
   */
  icon?: PillIcon

  /** Leading accent icon, rendered next to a visible label. */
  iconLeft?: PillIcon

  /** Trailing accent icon, rendered next to a visible label. */
  iconRight?: PillIcon

  /** Browser-tab active edge shape. */
  browserTabBase?: BrowserTabBase

  /** Axis used by underline tabs. */
  orientation?: PillOrientation

  /** Active treatment for default pills. */
  activeStyle?: PillActiveStyle
}
