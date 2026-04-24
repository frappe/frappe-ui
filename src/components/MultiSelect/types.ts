import type { Component, VNode, VNodeChild } from 'vue'

export type MultiSelectVariant = 'subtle' | 'outline' | 'ghost'
export type MultiSelectSize = 'sm' | 'md' | 'lg' | 'xl'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export type MultiSelectSlotFn<TProps> = (props: TProps) => VNodeChild

export interface MultiSelectItemSlots<TProps> {
  /** Replaces the prefix region of the standard row shell. */
  prefix?: MultiSelectSlotFn<TProps>

  /** Replaces the label region of the standard row shell. */
  label?: MultiSelectSlotFn<TProps>

  /** Replaces the suffix region of the standard row shell. */
  suffix?: MultiSelectSlotFn<TProps>

  /** Replaces the entire row; mutually exclusive with `prefix` / `label` / `suffix`. */
  item?: MultiSelectSlotFn<TProps>
}

export interface MultiSelectOption {
  label: string
  value: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: MultiSelectItemSlots<MultiSelectItemSlotProps>
  /** @deprecated use `slot` */
  slotName?: string
  /** @deprecated use `slots` — function form maps to `slots.item`, object form to `slots` */
  render?:
    | (() => VNode | VNode[])
    | MultiSelectItemSlots<MultiSelectItemSlotProps>
  [key: string]: any
}

export interface MultiSelectGroupedOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  options: MultiSelectOption[]
}

export type MultiSelectOptions = Array<
  MultiSelectOption | MultiSelectGroupedOption
>

export interface MultiSelectProps {
  /** Array of selected option values. */
  modelValue?: string[]

  /** Options rendered in the popover. */
  options?: MultiSelectOptions

  /** Visual style of the trigger. */
  variant?: MultiSelectVariant

  /** Size of the trigger and option rows. */
  size?: MultiSelectSize

  /** Placeholder text shown when no value is selected. */
  placeholder?: string

  /** Disables the multi-select. */
  disabled?: boolean

  /** Optional HTML id forwarded to the trigger. */
  id?: string

  /** Controls the popover visibility. */
  open?: boolean

  /** Hides the in-popover search input. */
  hideSearch?: boolean

  /** Replaces the results with a loading state. */
  loading?: boolean

  /** Fallback empty-state copy. */
  emptyText?: string

  /** Preferred popover side. */
  side?: PopoverSide

  /** Preferred popover alignment. */
  align?: PopoverAlign

  /** Gap between trigger and content. */
  offset?: number

  /** Teleport target for the popover content. */
  portalTo?: string | HTMLElement

  /**
   * Custom equality function used to resolve which options are currently
   * selected for display and rendering. When omitted, the component uses
   * strict equality on `option.value` against entries in `modelValue`.
   */
  compareFn?: (a: MultiSelectOption, b: MultiSelectOption) => boolean
}

export interface MultiSelectTriggerSlotProps {
  /** Whether the popover is open. */
  open: boolean

  /** Whether the multi-select is disabled. */
  disabled: boolean

  /** Resolved option objects for the selected values, in `modelValue` order. */
  selectedOptions: MultiSelectOption[]

  /** Comma-joined labels of the selected options, or `''` when nothing is selected. */
  displayValue: string

  /** Clears all selected values. */
  clearAll: () => void

  /** Toggles the popover open state. */
  toggleOpen: () => void
}

export interface MultiSelectItemSlotProps {
  /** Item currently being rendered. */
  item: MultiSelectOption

  /** Current search query — empty when the user hasn't typed since opening. */
  query: string

  /** Whether the item is in `modelValue`. */
  selected: boolean
}

export interface MultiSelectGroupLabelSlotProps {
  /** Group currently being rendered. */
  group: MultiSelectGroupedOption
}

export interface MultiSelectEmptySlotProps {
  /** Current search query — empty when the user hasn't typed since opening. */
  query: string
}

export interface MultiSelectFooterSlotProps {
  /** Clears all selected values. */
  clearAll: () => void

  /** Selects every enabled option across all groups. */
  selectAll: () => void

  /** Resolved option objects for the selected values, in `modelValue` order. */
  selectedOptions: MultiSelectOption[]

  /** Current search query — empty when the user hasn't typed since opening. */
  query: string
}

export interface MultiSelectSlots {
  /** Fully custom trigger renderer. */
  trigger?: (props: MultiSelectTriggerSlotProps) => any

  /** Shared content rendered before the standard row label. */
  'item-prefix'?: (props: MultiSelectItemSlotProps) => any

  /** Shared content rendered for the standard row label area. */
  'item-label'?: (props: MultiSelectItemSlotProps) => any

  /** Shared content rendered after the standard row label area. */
  'item-suffix'?: (props: MultiSelectItemSlotProps) => any

  /** Replaces the entire row. */
  item?: (props: MultiSelectItemSlotProps) => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: MultiSelectGroupLabelSlotProps) => any

  /** Fallback content rendered when there are no results. */
  empty?: (props: MultiSelectEmptySlotProps) => any

  /** Replaces the default Clear All / Select All footer. */
  footer?: (props: MultiSelectFooterSlotProps) => any

  /** @deprecated compatibility alias for `#item-label`. */
  option?: (props: { item: MultiSelectOption }) => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface MultiSelectEmits {
  /** Fired when the selection changes. */
  'update:modelValue': [value: string[]]

  /** Fired when the open state changes. */
  'update:open': [value: boolean]

  /** Fired when the user types in the search input. */
  'update:query': [value: string]
}
