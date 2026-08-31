import type { ButtonProps } from '../Button'
import type { MenuOptions, MenuSlotProps, MenuSlots } from '../Menu/types'

export type {
  MenuTheme as DropdownTheme,
  MenuSlotFn as DropdownSlotFn,
  MenuItemSlots as DropdownItemSlots,
  MenuBaseOption as DropdownBaseOption,
  MenuActionOption as DropdownActionOption,
  MenuSwitchOption as DropdownSwitchOption,
  MenuSubmenuOption as DropdownSubmenuOption,
  MenuGroupOption as DropdownGroupOption,
  MenuOption as DropdownOption,
  MenuItem as DropdownItem,
  MenuOptions as DropdownOptions,
  MenuSlotProps as DropdownSlotProps,
  MenuItemSlotProps as DropdownItemSlotProps,
  MenuGroupSlotProps as DropdownGroupSlotProps,
} from '../Menu/types'
import type { PortalTarget } from '../../composables/usePortalTarget'

export type DropdownSide = 'top' | 'right' | 'bottom' | 'left'
export type DropdownAlign = 'start' | 'center' | 'end'

export interface DropdownProps {
  /** Button configuration (label, icon, size, variant, etc.) */
  button?: ButtonProps

  /** Array of dropdown options or grouped options. */
  options?: MenuOptions

  /** Controls the visibility of the dropdown. */
  open?: boolean

  /** Alignment of the dropdown content along the trigger edge. */
  align?: DropdownAlign

  /** Side of the trigger the dropdown appears on. */
  side?: DropdownSide

  /** Offset in pixels between trigger and dropdown. */
  offset?: number

  /** Whether the dropdown width should match the trigger element. */
  matchTriggerWidth?: boolean

  /** Teleport target for dropdown portal content. Unset, an embedding host's target is used, else `body`. */
  portalTo?: PortalTarget
}

export interface DropdownTriggerSlotProps extends MenuSlotProps {
  /** Whether the dropdown menu is currently open. */
  open: boolean

  /** Whether the trigger should render as disabled. */
  disabled: boolean

  [key: string]: any
}

export type DropdownSlots = Omit<MenuSlots, 'default' | 'trigger'> & {
  /** Alternate trigger renderer. */
  default?: (props: DropdownTriggerSlotProps) => any
  /** Explicit trigger slot renderer. */
  trigger?: (props: DropdownTriggerSlotProps) => any
}

export interface DropdownEmits {
  /** Fired when the dropdown open state changes. */
  'update:open': [value: boolean]
}
