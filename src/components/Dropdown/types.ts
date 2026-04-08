import { type Component } from 'vue'
import type { RouterLinkProps } from 'vue-router'

import type { ButtonProps } from '../Button'

export type DropdownOption = {
  label: string
  icon?: string | Component | null
  switch?: boolean
  disabled?: boolean
  switchValue?: boolean
  theme?: 'gray' | 'red'
  component?: any
  onClick?: (val: any) => void
  route?: RouterLinkProps['to']
  condition?: () => boolean
  submenu?: DropdownOptions
}

export type DropdownGroupOption = {
  key?: number
  group: string
  items: DropdownOption[]
  hideLabel?: boolean
  theme?: 'gray' | 'red'
}
export type DropdownItem = DropdownOption | DropdownGroupOption

export type DropdownOptions = Array<DropdownItem>
/**
 * Props for the Dropdown component
 */
export interface DropdownProps {
  /** Button configuration (label, icon, size, variant, etc.) */
  button?: ButtonProps

  /** Array of dropdown options or grouped options */
  options?: DropdownOptions

  /** Placement of the dropdown relative to the trigger */
  placement?: string

  /** Side of the trigger the dropdown appears on */
  side?: 'top' | 'right' | 'bottom' | 'left'

  /** Offset in pixels between trigger and dropdown */
  offset?: number

  /** Teleport target for dropdown portal content */
  portalTo?: string | HTMLElement
}
