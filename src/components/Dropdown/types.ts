import type { Component, VNodeChild } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { ButtonProps } from '../Button'

export type DropdownTheme = 'gray' | 'red'
export type DropdownPlacement = 'left' | 'right' | 'center'
export type DropdownSide = 'top' | 'right' | 'bottom' | 'left'
export type DropdownAlign = 'start' | 'center' | 'end'

export type DropdownSlotFn<TProps> = (props: TProps) => VNodeChild

export interface DropdownItemSlots<TProps> {
  /** Replaces the prefix region of the standard row shell. */
  prefix?: DropdownSlotFn<TProps>

  /** Replaces the label region of the standard row shell. */
  label?: DropdownSlotFn<TProps>

  /** Replaces the suffix region of the standard row shell. */
  suffix?: DropdownSlotFn<TProps>

  /** Replaces the entire row; mutually exclusive with `prefix` / `label` / `suffix`. */
  item?: DropdownSlotFn<TProps>
}

export interface DropdownBaseOption {
  /** Leading icon shown for the item row. */
  icon?: string | Component | null

  /** Secondary text shown below the label. */
  description?: string

  /** Marks the item as currently selected. */
  selected?: boolean

  /** Disables interaction for the item. */
  disabled?: boolean

  /** Visual theme applied to the item row. */
  theme?: DropdownTheme

  /** Named slot suffix used to resolve `item-*` slots dynamically. */
  slot?: string

  /** Per-item inline slot implementations for the row shell. */
  slots?: DropdownItemSlots<DropdownItemSlotProps>

  /** Condition used to omit an item from the final menu. */
  condition?: () => boolean

  [key: string]: any
}

export interface DropdownActionOption extends DropdownBaseOption {
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

export interface DropdownSwitchOption extends DropdownBaseOption {
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

export interface DropdownSubmenuOption extends DropdownBaseOption {
  /** Primary label shown for the submenu trigger. */
  label: string

  /** Nested menu items rendered in the submenu. */
  submenu: DropdownOptions

  route?: never
  onClick?: never
  switch?: never
  switchValue?: never
  component?: never
}

export interface DropdownComponentOption extends DropdownBaseOption {
  /**
   * Custom component rendered in place of the standard menu row.
   * @deprecated use `slots.item` for the full-row escape hatch instead
   */
  component: any

  /** Optional label used by custom renderers. */
  label?: string

  route?: never
  submenu?: never
  switch?: never
  switchValue?: never
}

export interface DropdownGroupOption {
  /** Stable key for the group wrapper. */
  key?: string | number

  /** Label rendered above the grouped items. */
  group: string

  /** Items rendered inside the group. */
  items: DropdownOption[]

  /** Hides the group heading while preserving grouping. */
  hideLabel?: boolean

  /** Theme inherited by items in the group. */
  theme?: DropdownTheme
}

export type DropdownOption =
  | DropdownActionOption
  | DropdownSwitchOption
  | DropdownSubmenuOption
  | DropdownComponentOption

export type DropdownItem = DropdownOption | DropdownGroupOption
export type DropdownOptions = Array<DropdownItem>

export interface DropdownProps {
  /** Button configuration (label, icon, size, variant, etc.) */
  button?: ButtonProps

  /** Array of dropdown options or grouped options. */
  options?: DropdownOptions

  /** Controls the visibility of the dropdown. */
  open?: boolean

  /** Alignment of the dropdown content along the trigger edge. */
  align?: DropdownAlign

  /**
   * Placement of the dropdown relative to the trigger.
   * @deprecated use `align` instead; `placement` remains as a back-compat alias through v1.x
   */
  placement?: DropdownPlacement

  /** Side of the trigger the dropdown appears on. */
  side?: DropdownSide

  /** Offset in pixels between trigger and dropdown. */
  offset?: number

  /** Teleport target for dropdown portal content. */
  portalTo?: string | HTMLElement
}

export interface DropdownSlotProps {
  /** Closes the dropdown menu. */
  close: () => void
}

export interface DropdownTriggerSlotProps extends DropdownSlotProps {
  /** Whether the dropdown menu is currently open. */
  open: boolean

  /** Whether the trigger should render as disabled. */
  disabled: boolean

  [key: string]: any
}

export interface DropdownItemSlotProps extends DropdownSlotProps {
  /** Item currently being rendered. */
  item: DropdownOption

  /** Whether the item is currently selected. */
  selected: boolean
}

export interface DropdownGroupSlotProps {
  /** Group currently being rendered. */
  group: DropdownGroupOption
}

export interface DropdownSlots {
  /** Alternate trigger renderer. */
  default?: (props: DropdownTriggerSlotProps) => any

  /** Explicit trigger slot renderer. */
  trigger?: (props: DropdownTriggerSlotProps) => any

  /** Replaces the entire item row. */
  item?: (props: DropdownItemSlotProps) => any

  /** Content rendered before the standard item label. */
  'item-prefix'?: (props: DropdownItemSlotProps) => any

  /** Content rendered for the standard item label area. */
  'item-label'?: (props: DropdownItemSlotProps) => any

  /** Content rendered after the standard item label. */
  'item-suffix'?: (props: DropdownItemSlotProps) => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: DropdownGroupSlotProps) => any

  /** Fallback content rendered when no items are available. */
  empty?: () => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface DropdownEmits {
  /** Fired when the dropdown open state changes. */
  'update:open': [value: boolean]
}

export interface DropdownExposed {
  /** Closes the dropdown menu. */
  close: () => void
}
