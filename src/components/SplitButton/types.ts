import type { Component } from 'vue'
import type { Size, Variant } from '../Button/types'
import type { DropdownAlign, DropdownOptions } from '../Dropdown/types'

export interface SplitButtonProps {
  /** Text of the main action */
  label: string

  /** Actions in the menu that the chevron opens */
  options: DropdownOptions

  /** Accessible name of the chevron that opens the menu */
  menuLabel?: string

  /** Icon shown before the label */
  iconLeft?: string | Component

  /** Visual style of both halves */
  variant?: Variant

  /** Controls the size of both halves */
  size?: Size

  /** Tooltip shown on the main action */
  tooltip?: string

  /** Shows a spinner on the main action and disables both halves */
  loading?: boolean

  /** Text shown on the main action while it is loading */
  loadingText?: string

  /** Disables both halves */
  disabled?: boolean

  /** Alignment of the menu along the chevron */
  align?: DropdownAlign
}

export interface SplitButtonEmits {
  /** Fired when the main action is clicked */
  click: [event: MouseEvent]
}
