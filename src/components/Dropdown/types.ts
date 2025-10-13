import { RouterLinkProps } from 'vue-router'
import { ButtonProps } from '../Button'
import { type Component } from 'vue'

export type DropdownOption = {
  label: string
  icon?: string | Component | null
  theme?: 'gray' | 'red'
  component?: any
  onClick?: (event: PointerEvent) => void
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

export interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  placement?: string
}
