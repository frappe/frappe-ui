import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { ButtonProps } from '../Button'

export type DropdownTheme = 'gray' | 'red'

export interface DropdownBaseOption {
  icon?: string | Component | null
  description?: string
  selected?: boolean
  disabled?: boolean
  theme?: DropdownTheme
  slot?: string
  condition?: () => boolean
  [key: string]: any
}

export interface DropdownActionOption extends DropdownBaseOption {
  label: string
  route?: RouteLocationRaw
  onClick?: (event: PointerEvent) => void
  submenu?: never
  switch?: never
  switchValue?: never
  component?: never
}

export interface DropdownSwitchOption extends DropdownBaseOption {
  label: string
  switch: true
  switchValue?: boolean
  onClick?: (value: boolean) => void
  route?: never
  submenu?: never
  component?: never
}

export interface DropdownSubmenuOption extends DropdownBaseOption {
  label: string
  submenu: DropdownOptions
  route?: never
  onClick?: never
  switch?: never
  switchValue?: never
  component?: never
}

export interface DropdownComponentOption extends DropdownBaseOption {
  component: any
  label?: string
  route?: never
  submenu?: never
  switch?: never
  switchValue?: never
}

export interface DropdownGroupOption {
  key?: string | number
  group: string
  items: DropdownOption[]
  hideLabel?: boolean
  theme?: DropdownTheme
}

export type DropdownOption =
  | DropdownActionOption
  | DropdownSwitchOption
  | DropdownSubmenuOption
  | DropdownComponentOption

export type DropdownItem = DropdownOption | DropdownGroupOption

export type DropdownOptions = Array<DropdownItem>

export interface DropdownProps {
  /** Button configuration (label, icon, size, variant, etc.) */
  button?: ButtonProps

  /** Array of dropdown options or grouped options */
  options?: DropdownOptions

  /** Controls the visibility of the dropdown */
  open?: boolean

  /** Placement of the dropdown relative to the trigger */
  placement?: 'left' | 'right' | 'center'

  /** Side of the trigger the dropdown appears on */
  side?: 'top' | 'right' | 'bottom' | 'left'

  /** Offset in pixels between trigger and dropdown */
  offset?: number

  /** Teleport target for dropdown portal content */
  portalTo?: string | HTMLElement
}
