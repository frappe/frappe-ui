import type { Component, VNode, VNodeChild } from 'vue'

export type ComboboxVariant = 'subtle' | 'outline' | 'ghost'
export type ComboboxSize = 'sm' | 'md' | 'lg' | 'xl'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

/** @deprecated alias for `align` */
export type ComboboxPlacement = PopoverAlign

export type ComboboxSlotFn<TProps> = (props: TProps) => VNodeChild

export interface ComboboxItemSlots<TProps> {
  /** Replaces the prefix region of the standard row shell. */
  prefix?: ComboboxSlotFn<TProps>

  /** Replaces the label region of the standard row shell. */
  label?: ComboboxSlotFn<TProps>

  /** Replaces the suffix region of the standard row shell. */
  suffix?: ComboboxSlotFn<TProps>

  /** Replaces the entire row; mutually exclusive with `prefix` / `label` / `suffix`. */
  item?: ComboboxSlotFn<TProps>
}

export type ComboboxSelectableOption = {
  type?: 'option'
  label: string
  value: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: ComboboxItemSlots<ComboboxItemSlotProps>
  /** @deprecated use `slot` */
  slotName?: string
  /** @deprecated use `slots` — function form maps to `slots.item`, object form to `slots` */
  render?:
    | (() => VNode | VNode[])
    | ComboboxItemSlots<ComboboxItemSlotProps>
  [key: string]: any
}

export type ComboboxCustomOptionContext = {
  query: string
  /** @deprecated use `query` */
  searchTerm: string
}

export type ComboboxCustomOption = {
  type: 'custom'
  key: string
  label: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: ComboboxItemSlots<ComboboxItemSlotProps>
  /** @deprecated use `slot` */
  slotName?: string
  onClick: (context: ComboboxCustomOptionContext) => void
  keepOpen?: boolean
  condition?: (context: ComboboxCustomOptionContext) => boolean
  /** @deprecated use `slots` — function form maps to `slots.item`, object form to `slots` */
  render?:
    | (() => VNode | VNode[])
    | ComboboxItemSlots<ComboboxItemSlotProps>
  [key: string]: any
}

export type SelectableOption = ComboboxSelectableOption
export type CustomOption = ComboboxCustomOption

export type ComboboxSimpleOption =
  | string
  | ComboboxSelectableOption
  | ComboboxCustomOption

export type SimpleOption = ComboboxSimpleOption

export interface ComboboxGroupedOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  options: ComboboxSimpleOption[]
}

export type GroupedOption = ComboboxGroupedOption
export type ComboboxOption = ComboboxSimpleOption | ComboboxGroupedOption

export interface ComboboxProps {
  /** Options rendered in the popover. */
  options?: ComboboxOption[]

  /**
   * Shape of the trigger.
   * - `'input'` (default): user types directly into the trigger
   * - `'button'`: render a button trigger; search input moves into the
   *   popover header. Label + prefix auto-derive from the selected option.
   */
  trigger?: 'input' | 'button'

  /** Visual style of the combobox. */
  variant?: ComboboxVariant

  /** Size of the trigger and option rows. */
  size?: ComboboxSize

  /** Placeholder text shown when no value is selected. */
  placeholder?: string

  /** Disables the combobox. */
  disabled?: boolean

  /** Optional HTML id forwarded to the input element. */
  id?: string

  /** Controls the popover visibility. */
  open?: boolean

  /** Opens the popover when the input receives focus. */
  openOnFocus?: boolean

  /** Opens the popover when the input is clicked. */
  openOnClick?: boolean

  /** Preferred popover side. */
  side?: PopoverSide

  /** Preferred popover alignment. */
  align?: PopoverAlign

  /** Gap between trigger and content. */
  offset?: number

  /** Teleport target for the popover content. */
  portalTo?: string | HTMLElement

  /** Accepts the typed query as the value when nothing matches. */
  allowCustomValue?: boolean

  /** Replaces the results with a loading state. */
  loading?: boolean

  /** Fallback empty-state copy. */
  emptyText?: string

  /**
   * Alignment of the popover along the trigger edge.
   * @deprecated use `align` instead; `placement` is kept as a back-compat alias
   */
  placement?: ComboboxPlacement
}

export interface ComboboxTriggerSlotProps {
  /** Whether the popover is open. */
  open: boolean

  /** Whether the combobox is disabled. */
  disabled: boolean

  /** Current input query. */
  query: string

  /** Resolved selected option, if any. */
  selectedOption: ComboboxSelectableOption | null

  /** Resolved display text for the committed value. */
  displayValue: string
}

export interface ComboboxItemSlotProps {
  /** Item currently being rendered. */
  item: ComboboxSelectableOption | ComboboxCustomOption

  /** Current search query — empty when the user hasn't typed since opening. */
  query: string

  /** Whether the item is selected. */
  selected: boolean
}

export interface ComboboxGroupLabelSlotProps {
  /** Group currently being rendered. */
  group: ComboboxGroupedOption
}

export interface ComboboxEmptySlotProps {
  /** Current search query — empty when the user hasn't typed since opening. */
  query: string
}

export interface ComboboxSlots {
  /** Fully custom trigger renderer. */
  trigger?: (props: ComboboxTriggerSlotProps) => any

  /** Content rendered before the default input. */
  prefix?: () => any

  /** Shared content rendered before the standard row label. */
  'item-prefix'?: (props: ComboboxItemSlotProps) => any

  /** Shared content rendered for the standard row label area. */
  'item-label'?: (props: ComboboxItemSlotProps) => any

  /** Shared content rendered after the standard row label area. */
  'item-suffix'?: (props: ComboboxItemSlotProps) => any

  /** Replaces the entire row. */
  item?: (props: ComboboxItemSlotProps) => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: ComboboxGroupLabelSlotProps) => any

  /** Fallback content rendered when there are no results. */
  empty?: (props: ComboboxEmptySlotProps) => any

  /** Content rendered after the list. */
  footer?: () => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface ComboboxEmits {
  /** Fired when the open state changes. */
  'update:open': [value: boolean]

  /** Fired when the query changes due to user input. */
  'update:query': [value: string]

  /** Fired when the resolved selected option changes. */
  'update:selectedOption': [
    option: ComboboxSelectableOption | ComboboxCustomOption | null,
  ]

  /** Fired when the input receives focus. */
  focus: [event: FocusEvent]

  /** Fired when the input loses focus. */
  blur: [event: FocusEvent]

  /** @deprecated compatibility alias for `update:query`. */
  input: [value: string]
}

export interface ComboboxExposed {
  reset: () => void
}
