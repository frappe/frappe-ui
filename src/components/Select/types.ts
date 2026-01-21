export type SelectOption =
  | string
  | {
      label: string
      value: string
      disabled?: boolean
    }

export interface SelectProps {
  /** Size of the select input */
  size?: 'sm' | 'md' | 'lg'

  /** Visual style of the select input */
  variant?: 'subtle' | 'outline' | 'ghost'

  /** Placeholder text displayed when no option is selected */
  placeholder?: string

  /** If true, disables the select input */
  disabled?: boolean

  /** Optional HTML id for the select element */
  id?: string

  /** The currently selected value (controlled) */
  modelValue?: string | number

  /** Options to display in the dropdown */
  options?: SelectOption[]
}
