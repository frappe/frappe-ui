import type { MenuOptions, MenuSlots } from '../Menu/types'

export type {
  MenuTheme as ContextMenuTheme,
  MenuSlotFn as ContextMenuSlotFn,
  MenuItemSlots as ContextMenuItemSlots,
  MenuBaseOption as ContextMenuBaseOption,
  MenuActionOption as ContextMenuActionOption,
  MenuSwitchOption as ContextMenuSwitchOption,
  MenuSubmenuOption as ContextMenuSubmenuOption,
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

// Exported for consumers to import, and deliberately **not** passed to
// `defineEmits`. `update:open` is declared by `defineModel('open')` in the SFC;
// declaring it a second time through `defineEmits` makes Vue's generated
// `__VLS_ModelEmit & __VLS_Emit` an intersection of two tuples, which collapses
// `$emit` and every listener to `(...args: unknown[]) => any` — the defect
// #1098 removed from `Combobox` and `MultiSelect`.
//
// Those two are wired because they carry events no model declares (`focus`,
// `blur`, `update:selectedOption`); this component has none, so `defineEmits`
// would add nothing and cost the typed listener. `DropdownEmits`, `SelectEmits`,
// `SettingsDialogEmits`, `RatingEmits`, `DurationEmits` and `RadioGroupEmits`
// are unwired for the same reason.
export interface ContextMenuEmits {
  'update:open': [open: boolean]
}

export type ContextMenuSlots = Omit<MenuSlots, 'default' | 'trigger'> & {
  /** The right-clickable region that opens the menu. */
  default?: (props: ContextMenuTriggerSlotProps) => any
  /** Explicit trigger slot; same as default. */
  trigger?: (props: ContextMenuTriggerSlotProps) => any
}
