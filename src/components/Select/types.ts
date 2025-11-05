
type SelectOption =
  | string
  | {
      label: string
      value: string
      icon?: any
      disabled?: boolean
    }

export type SelectValue = string | string[] | undefined

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  getLabel?: Function
}