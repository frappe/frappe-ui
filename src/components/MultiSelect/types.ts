export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultiSelectProps {
  /** Placeholder text shown when no item is selected */
  placeholder?: string
  /** Options available to select from */
  options: MultiSelectOption[]
  /** Hides the search input if true */
  hideSearch?: boolean
  /** Shows a loading state */
  loading?: boolean
  /** Custom comparison function to check equality of options */
  compareFn?: (a: MultiSelectOption, b: MultiSelectOption) => boolean
}
