import { RouterLinkProps } from 'vue-router'
import { ButtonProps } from '../Button'

export type DropdownOption = {
  label: string
  icon?: string | null
  theme?: 'gray' | 'red'
  component?: any
  onClick?: () => void
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
