import type { Component, VNodeChild } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { NormalizedMenuGroup } from './utils'
import type { PortalTarget } from '../../composables/usePortalTarget'

export type MenuTheme = 'gray' | 'red'

export type MenuSlotFn<TProps> = (props: TProps) => VNodeChild

export interface MenuItemSlots<TProps> {
  /** Replaces the prefix region of the standard row shell. */
  prefix?: MenuSlotFn<TProps>

  /** Replaces the label region of the standard row shell. */
  label?: MenuSlotFn<TProps>

  /** Replaces the suffix region of the standard row shell. */
  suffix?: MenuSlotFn<TProps>

  /** Replaces the entire row; mutually exclusive with `prefix` / `label` / `suffix`. */
  item?: MenuSlotFn<TProps>
}

export interface MenuBaseOption {
  /** Leading icon shown for the item row. */
  icon?: string | Component | null

  /** Secondary text shown below the label. */
  description?: string

  /** Marks the item as currently selected. */
  selected?: boolean

  /** Disables interaction for the item. */
  disabled?: boolean

  /** Visual theme applied to the item row. */
  theme?: MenuTheme

  /** Named slot suffix used to resolve `item-*` slots dynamically. */
  slot?: string

  /** Per-item inline slot implementations for the row shell. */
  slots?: MenuItemSlots<MenuItemSlotProps>

  /** Condition used to omit an item from the final menu. */
  condition?: () => boolean

  [key: string]: any
}

export interface MenuActionOption extends MenuBaseOption {
  /** Primary label shown for the action item. */
  label: string

  /** Router destination to navigate to when the item is clicked. */
  route?: RouteLocationRaw

  /** Click handler invoked when the action item is selected. */
  onClick?: (event: PointerEvent) => void

  submenu?: never
  switch?: never
  switchValue?: never
  component?: never
}

export interface MenuSwitchOption extends MenuBaseOption {
  /** Primary label shown for the switch item. */
  label: string

  /** Renders the item with a switch control. */
  switch: true

  /** Current boolean value for the switch item. */
  switchValue?: boolean

  /** Change handler invoked with the next switch value. */
  onClick?: (value: boolean) => void

  route?: never
  submenu?: never
  component?: never
}

export interface MenuSubmenuOption extends MenuBaseOption {
  /** Primary label shown for the submenu trigger. */
  label: string

  /** Nested menu items rendered in the submenu. */
  submenu: MenuOptions

  route?: never
  onClick?: never
  switch?: never
  switchValue?: never
  component?: never
}

export interface MenuGroupOption {
  /** Stable key for the group wrapper. */
  key?: string | number

  /** Label rendered above the grouped items. */
  group: string

  /** Items rendered inside the group. */
  options: MenuOption[]

  // Removed `{ group, items }` shape. `never` keeps the old key a type
  // error instead of a silently ignored extra field.
  items?: never

  /** Hides the group heading while preserving grouping. */
  hideLabel?: boolean

  /** Theme inherited by items in the group. */
  theme?: MenuTheme
}

export type MenuOption = MenuActionOption | MenuSwitchOption | MenuSubmenuOption

export type MenuItem = MenuOption | MenuGroupOption
export type MenuOptions = Array<MenuItem>

/**
 * Reka-ui menu primitives injected by the wrapping menu component
 * (Dropdown / ContextMenu) so the shared renderer stays variant-agnostic.
 */
export interface MenuPrimitives {
  Item: any
  Label: any
  Portal: any
  Sub: any
  SubContent: any
  SubTrigger: any
}

export interface MenuProps {
  /** Normalized groups of menu options to render. */
  groups?: NormalizedMenuGroup[]

  /** Closes the menu. */
  close: () => void

  /** Dynamic `item-*` slot implementations resolved by name. */
  slotFns?: Record<string, ((props?: any) => any) | undefined>

  /** Portal target for submenu content. Unset, an embedding host's target is used, else `body`. */
  portalTo?: PortalTarget

  /** Reka-ui primitives supplied by the wrapping menu component. */
  primitives: MenuPrimitives
}

export interface MenuSlotProps {
  /** Closes the menu. */
  close: () => void
}

export interface MenuItemSlotProps extends MenuSlotProps {
  /** Item currently being rendered. */
  item: MenuOption

  /** Whether the item is currently selected. */
  selected: boolean
}

export interface MenuGroupSlotProps {
  /** Group currently being rendered. */
  group: MenuGroupOption
}

export interface MenuSlots {
  /** Alternate trigger renderer. */
  default?: (props: any) => any

  /** Explicit trigger slot renderer. */
  trigger?: (props: any) => any

  /** Replaces the entire item row. */
  item?: (props: MenuItemSlotProps) => any

  /** Content rendered before the standard item label. */
  'item-prefix'?: (props: MenuItemSlotProps) => any

  /** Content rendered for the standard item label area. */
  'item-label'?: (props: MenuItemSlotProps) => any

  /** Content rendered after the standard item label. */
  'item-suffix'?: (props: MenuItemSlotProps) => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: MenuGroupSlotProps) => any

  /** Fallback content rendered when no items are available. */
  empty?: () => any

  [slotName: string]: ((props: any) => any) | undefined
}
