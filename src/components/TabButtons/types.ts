import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { PillSize } from './pillTypes'

export type TabButtonValue = string | number | boolean
export type TabButtonIcon = string | Component
export type NativeButtonClass = string | string[] | Record<string, boolean>
export type TabButtonsType = 'subtle' | 'ghost' | 'underline' | 'browser-tab'
export type TabButtonsDirection = 'left' | 'right'

export interface TabButton {
  label?: string | number
  value?: TabButtonValue
  /** Icon-only tab; `label` becomes accessibility text. */
  icon?: TabButtonIcon
  /** Leading accent icon, rendered next to the visible label. */
  iconLeft?: TabButtonIcon
  /** Trailing accent icon, rendered next to the visible label. */
  iconRight?: TabButtonIcon
  active?: boolean
  disabled?: boolean
  tooltip?: string
  class?: NativeButtonClass
  /** Renders the tab as a `<RouterLink>` to the given target. */
  route?: RouteLocationRaw
  /** Renders the tab as an `<a href>`, opens in a new tab. */
  href?: string
  onClick?: (event: MouseEvent) => void
}

export interface TabButtonsProps {
  /** List of options to render. */
  options?: TabButton[]

  /** @deprecated Use `options` instead. */
  buttons?: TabButton[]

  modelValue?: TabButtonValue
  type?: TabButtonsType
  size?: PillSize
  vertical?: boolean

  /** Edge the active browser tab attaches to. Only used when `type='browser-tab'` and `vertical`. */
  direction?: TabButtonsDirection
}

export interface TabButtonsEmits {
  'update:modelValue': [value: TabButtonValue | undefined]
}
