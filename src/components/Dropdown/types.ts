import { RouterLinkProps } from 'vue-router'
import { ButtonProps } from '../Button'

export type DropdownOption = {
  label: string
  icon?: string | null
  component?: any
  onClick?: () => void
  route?: RouterLinkProps['to']
  condition?: () => boolean
}

export type DropdownGroupOption = {
  key?: number
  group: string
  items: DropdownOption[]
  hideLabel?: boolean
}

export type DropdownOptions = Array<DropdownOption | DropdownGroupOption>

export interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  placement?: string
}