import type { Component, VNodeChild } from 'vue'
import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { SelectionExposed } from '../shared/selection/types'

export type ComboboxVariant = 'subtle' | 'outline' | 'ghost'
export type ComboboxSize = 'sm' | 'md' | 'lg' | 'xl'

import type { PopoverSide, PopoverAlign } from '../shared/selection/types'
export type { PopoverSide, PopoverAlign }

/** Value accepted by a selectable option and by `v-model`. */
export type ComboboxOptionValue = string | number

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
  value: ComboboxOptionValue
  icon?: string | Component
  description?: string
  disabled?: boolean
  /** Dispatches the row to the `#item-<slot>` template slot. */
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: ComboboxItemSlots<ComboboxItemSlotProps>
  [key: string]: any
}

export type ComboboxCustomOptionContext = {
  query: string
}

export type ComboboxCustomOption = {
  type: 'custom'
  key: string
  label: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  /** Dispatches the row to the `#item-<slot>` template slot. */
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: ComboboxItemSlots<ComboboxItemSlotProps>
  onClick: (context: ComboboxCustomOptionContext) => void
  keepOpen?: boolean
  condition?: (context: ComboboxCustomOptionContext) => boolean
  [key: string]: any
}

export type ComboboxSimpleOption =
  | string
  | ComboboxSelectableOption
  | ComboboxCustomOption

export interface ComboboxGroupedOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  options: ComboboxSimpleOption[]
}

export type ComboboxOption = ComboboxSimpleOption | ComboboxGroupedOption

export interface ComboboxProps extends InputLabelingProps {
  /** Committed value. `null` when nothing is selected. */
  modelValue?: ComboboxOptionValue | null

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

  /** Controls the popover visibility. */
  open?: boolean

  /** Controls the search query. Optional — the combobox owns it otherwise. */
  query?: string

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

  /**
   * Free-form acceptance: the typed query is accepted as the model value
   * when nothing matches, and external `modelValue` updates with unknown
   * strings are preserved. The combobox also renders a built-in "Create X"
   * row as a click affordance.
   *
   * For richer create-new UX (custom label / icon / persistence callback),
   * prefer a `type: 'custom'` option with `condition` instead — see the
   * Create New story. The two are independent and can be combined.
   */
  allowCustomValue?: boolean

  /** Replaces the results with a loading state. */
  loading?: boolean

  /** Fallback empty-state copy. */
  emptyText?: string

  /**
   * Hides the in-popover search row (button mode only — in input mode the
   * trigger *is* the search input).
   *
   * The `#search-prefix` / `#search-suffix` slots live inside that row and
   * are not rendered when this is `true`.
   */
  hideSearch?: boolean

  /**
   * Client-side substring filtering of `options` as the user types.
   *
   * Set to `false` for pickers whose options come from a server search: the
   * backend already decided what matches, and a second literal substring
   * pass on the client silently drops fuzzy, ranked, or id-based results.
   *
   * A custom option's `condition` callback is consumer-declared visibility
   * rather than client filtering, so it keeps running either way.
   */
  filterable?: boolean
}

export interface ComboboxControlSlotProps {
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

  /** Clears the current selection (sets the model to `null`). */
  clear: () => void

  /** Sets the popover open state (no-op while disabled). */
  setOpen: (value: boolean) => void
}

export interface ComboboxSearchSlotProps {
  /** Current search query — empty when the user hasn't typed since opening. */
  query: string

  /** Updates the search query and emits `update:query`. */
  setQuery: (value: string) => void

  /** Whether the combobox is disabled. */
  disabled: boolean

  /** Moves focus to the in-popover search input. */
  focus: (options?: FocusOptions) => void
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
  trigger?: (props: ComboboxControlSlotProps) => any

  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  /** Content rendered before the default input. Receives the same shape
   * as the other control slots. */
  prefix?: (props: ComboboxControlSlotProps) => any

  /**
   * Content rendered after the input (input mode) or label (button mode).
   * Providing this slot **replaces the default chevron** — render your
   * own fallback (e.g. the chevron) when your slot content is conditional.
   * Common use: an inline clear button. Use `@click.stop` and
   * `@pointerdown.stop` so the press doesn't toggle the popover.
   */
  suffix?: (props: ComboboxControlSlotProps) => any

  /**
   * Content rendered before the in-popover search input (button mode only).
   * Not rendered when `hideSearch` is set.
   */
  'search-prefix'?: (props: ComboboxSearchSlotProps) => any

  /**
   * Content rendered after the in-popover search input (button mode only).
   * Not rendered when `hideSearch` is set.
   */
  'search-suffix'?: (props: ComboboxSearchSlotProps) => any

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

  /** Content rendered after the list. Stays pinned below the scrollable
   * options. */
  footer?: (props: ComboboxControlSlotProps) => any

  [slotName: string]: ((props: any) => any) | undefined
}

export interface ComboboxEmits {
  /** Fired when the committed value changes. */
  'update:modelValue': [value: ComboboxOptionValue | null]

  /** Fired when the open state changes. */
  'update:open': [value: boolean]

  /** Fired when the query changes. */
  'update:query': [value: string]

  /** Fired when the resolved selected option changes. */
  'update:selectedOption': [
    option: ComboboxSelectableOption | ComboboxCustomOption | null,
  ]

  /** Fired when the input receives focus. */
  focus: [event: FocusEvent]

  /** Fired when the input loses focus. */
  blur: [event: FocusEvent]
}

export type { SelectionExposed }
