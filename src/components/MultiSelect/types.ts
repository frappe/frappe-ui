export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultiSelectProps {
  placeholder?: string
  options: MultiSelectOption[]
  hideSearch?: boolean
  loading?: boolean
  compareFn?: (a: MultiSelectOption, b: MultiSelectOption) => boolean
}
