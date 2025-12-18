export interface CheckboxProps {
  /** Controls the size of the checkbox */
  size?: 'sm' | 'md'

  /** Text label shown next to the checkbox */
  label?: string

  /** Disables the checkbox interaction */
  disabled?: boolean

  /** Adds padding around the checkbox */
  padding?: boolean

  /** Checked state of the checkbox */
  modelValue?: boolean | 1 | 0

  /** HTML id attribute for the input element */
  id?: string
}
