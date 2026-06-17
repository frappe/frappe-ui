import type { MenuOptions, MenuSlots } from '../Menu/types'

export type {
  MenuTheme as ContextMenuTheme,
  MenuSlotFn as ContextMenuSlotFn,
  MenuItemSlots as ContextMenuItemSlots,
  MenuBaseOption as ContextMenuBaseOption,
  MenuActionOption as ContextMenuActionOption,
  MenuSwitchOption as ContextMenuSwitchOption,
  MenuSubmenuOption as ContextMenuSubmenuOption,
  MenuComponentOption as ContextMenuComponentOption,
  MenuGroupOption as ContextMenuGroupOption,
  MenuOption as ContextMenuOption,
  MenuItem as ContextMenuItem,
  MenuOptions as ContextMenuOptions,
  MenuSlotProps as ContextMenuSlotProps,
  MenuItemSlotProps as ContextMenuItemSlotProps,
  MenuGroupSlotProps as ContextMenuGroupSlotProps,
} from '../Menu/types'

export interface ContextMenuTriggerSlotProps {
  /** Whether the context menu is currently open. */
  open: boolean
}

export interface ContextMenuProps {
  /** Array of context menu options or grouped options. */
  options?: MenuOptions

  /** Controls the visibility of the context menu. */
  open?: boolean
}

export type ContextMenuSlots = Omit<MenuSlots, 'default' | 'trigger'> & {
  /** The right-clickable region that opens the menu. */
  default?: (props: ContextMenuTriggerSlotProps) => any
  /** Explicit trigger slot; same as default. */
  trigger?: (props: ContextMenuTriggerSlotProps) => any
}
