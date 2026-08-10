import type { Component } from 'vue'
import type { TabsSize, TabsVariant } from '../../Tabs/types'

export type BrowserTabBase = 'none' | 'default' | 'left' | 'right'
export type PillIcon = string | Component
export type PillOrientation = 'horizontal' | 'vertical'

export interface PillProps {
  /** Text shown inside the pill. */
  label?: string | number

  /** Visual variant, shared with TabList / TabButtons. */
  variant?: TabsVariant

  /** Size of the pill. */
  size?: TabsSize

  /** Active/selected state. */
  active?: boolean

  /**
   * Icon-only content. When set, the pill renders as a square icon button
   * and any `label` is exposed only to assistive tech (sr-only).
   */
  icon?: PillIcon

  /** Leading accent icon, rendered next to a visible label. */
  iconLeft?: PillIcon

  /** Browser-tab attached-edge shape. */
  browserTabBase?: BrowserTabBase

  /** Axis of the surrounding track. */
  orientation?: PillOrientation
}
