export interface SwitchProps {
  /** Size of the switch control */
  size?: 'sm' | 'md'

  /** Label text displayed next to the switch */
  label?: string

  /** Helper or descriptive text shown below the label */
  description?: string

  /** Disables the switch and prevents interaction */
  disabled?: boolean

  /** Optional icon rendered inside or alongside the switch */
  icon?: any

  /** Custom classes applied to the label element */
  labelClasses?: string
}
