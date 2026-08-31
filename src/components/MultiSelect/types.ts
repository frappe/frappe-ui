import type { Component, VNodeChild } from 'vue'
import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { PortalTarget } from '../../composables/usePortalTarget'

export type MultiSelectVariant = 'subtle' | 'outline' | 'ghost'
export type MultiSelectSize = 'sm' | 'md' | 'lg' | 'xl'

import type { PopoverSide, PopoverAlign } from '../shared/selection/types'
export type { PopoverSide, PopoverAlign }

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
  value: string | number
  icon?: string | Component
  description?: string
  disabled?: boolean
  /**
   * Dispatches this row to the `#item-<slot>` template slot, e.g.
   * `slot: 'member'` renders `#item-member` in the row's label region.
   */
  slot?: string
  /** Per-item inline slot implementations for the row shell. */
  slots?: MultiSelectItemSlots<MultiSelectItemSlotProps>
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

export interface MultiSelectProps extends InputLabelingProps {
  /** Array of selected option values. */
  modelValue?: Array<string | number>

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

  /** Controls the popover visibility. */
  open?: boolean

  /**
   * Controls the in-popover search query. Optional — the component owns the
   * query when this is not bound, so `v-model:query` is never required.
   *
   * When it is bound the consumer owns the query: the component never resets
   * it on its own — not on open, not on close, not on mount, not on `clear()`.
   * Only typing (or the `setQuery` slot prop) changes it, and a seeded query
   * filters the list immediately. Unbound, the query still clears every time
   * the popover opens.
   */
  query?: string

  /** Hides the in-popover search input. */
  hideSearch?: boolean

  /** Replaces the results with a loading state. */
  loading?: boolean

  /**
   * Client-side query filtering. Defaults to `true`. Set to `false` for
   * pickers whose options come from a server search — the backend already
   * decided what matches, and a second literal substring pass on the client
   * silently drops fuzzy, ranked, or id-based results. This turns off query
   * filtering only; nothing else about the component changes.
   */
  filterable?: boolean

  /** Fallback empty-state copy. */
  emptyText?: string

  /** Preferred popover side. */
  side?: PopoverSide

  /** Preferred popover alignment. */
  align?: PopoverAlign

  /** Gap between trigger and content. */
  offset?: number

  /** Teleport target for the popover content. Unset, an embedding host's target is used, else `body`. */
  portalTo?: PortalTarget
}

/**
 * Shared shape for `#trigger`, `#prefix`, `#suffix`, `#footer` (with an added
 * `selectAll`), and `#summary` (with an added `summary`). The imperative
 * helpers `clear` and `setOpen` are exposed on every slot so consumers don't
 * need to hoist into `#trigger` just to clear the selection.
 */
export interface MultiSelectSlotProps {
  /** Whether the popover is open. */
  open: boolean

  /** Whether the multi-select is disabled. */
  disabled: boolean

  /** Current search query — empty when the user hasn't typed since opening. */
  query: string

  /** Resolved option objects for the selected values, in `modelValue` order. */
  selectedOptions: MultiSelectOption[]

  /** Clears all selected values. It leaves the search query alone. */
  clear: () => void

  /** Sets the popover open state. */
  setOpen: (value: boolean) => void
}

export type MultiSelectTriggerSlotProps = MultiSelectSlotProps
export type MultiSelectPrefixSlotProps = MultiSelectSlotProps
export type MultiSelectSuffixSlotProps = MultiSelectSlotProps

/**
 * Props for `#search-prefix` and `#search-suffix`.
 *
 * Both slots render inside the search row, which only exists while
 * `hide-search` is not set — they disappear silently when it is.
 */
export interface MultiSelectSearchSlotProps {
  /** Current search query — empty when the user hasn't typed since opening. */
  query: string

  /** Updates the search query and emits `update:query`. Pass `''` to clear. */
  setQuery: (value: string) => void

  /** Whether the multi-select is disabled. */
  disabled: boolean

  /** Moves focus to the search input. */
  focus: (options?: FocusOptions) => void
}

/**
 * `#footer` gets the shared control shape plus one addition, so it is named
 * for the same reason `MultiSelectSummarySlotProps` is: a consumer annotating
 * a footer handler needs something to import.
 */
export interface MultiSelectFooterSlotProps extends MultiSelectSlotProps {
  /** Selects every enabled option across all groups. */
  selectAll: () => void
}

export interface MultiSelectSummarySlotProps extends MultiSelectSlotProps {
  /** Default label text the trigger would render (e.g. placeholder,
   * single selected label, or `"N selected"`). Use it as a fallback. */
  summary: string
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

/**
 * Fixed slot names. Kept separate from `MultiSelectSlots` so the dynamic
 * `` `item-${string}` `` index signature can be intersected in without
 * constraining names that don't match the pattern.
 */
interface MultiSelectFixedSlots {
  /** Fully custom trigger renderer. */
  trigger?: (props: MultiSelectTriggerSlotProps) => any

  /**
   * Content rendered before the trigger label. When provided, this slot
   * owns the entire prefix area regardless of selection count — useful
   * for aggregate visuals like stacked avatars. If omitted, the trigger
   * auto-renders the selected option's `#item-prefix` / `icon` when
   * exactly one is selected, and nothing otherwise.
   */
  prefix?: (props: MultiSelectPrefixSlotProps) => any

  /**
   * Overrides the trigger label region. Receives the default summary
   * text as `summary` — use it as a fallback. Useful when you want to
   * show comma-separated labels (or any other format) instead of the
   * default `"N selected"` for multi-selection states.
   */
  summary?: (props: MultiSelectSummarySlotProps) => any

  /**
   * Content rendered after the trigger label. Providing this slot
   * **replaces the default chevron** — render your own fallback when
   * your slot content is conditional. Use `@click.stop` and
   * `@pointerdown.stop` so the press doesn't toggle the popover.
   */
  suffix?: (props: MultiSelectSuffixSlotProps) => any

  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  /**
   * Content rendered before the in-popover search input. Renders inside the
   * search row, so it is not rendered at all when `hide-search` is set.
   */
  'search-prefix'?: (props: MultiSelectSearchSlotProps) => any

  /**
   * Content rendered after the in-popover search input and loading
   * indicator. Renders inside the search row, so it is not rendered at all
   * when `hide-search` is set.
   */
  'search-suffix'?: (props: MultiSelectSearchSlotProps) => any

  /** Custom renderer for group labels. */
  'group-label'?: (props: MultiSelectGroupLabelSlotProps) => any

  /** Fallback content rendered when there are no results. */
  empty?: (props: MultiSelectEmptySlotProps) => any

  /**
   * Replaces the default Clear All / Select All footer. Receives the shared
   * control slot props plus `selectAll`.
   */
  footer?: (props: MultiSelectFooterSlotProps) => any

  /** Replaces the entire row. */
  item?: (props: MultiSelectItemSlotProps) => any
}

/**
 * Item slot names: the three fixed regions of the row shell, the whole-row
 * takeover, and any `#item-<name>` dispatched from an option's `slot` field.
 *
 * The index signature is deliberately narrowed to `` `item-${string}` `` —
 * `MultiSelectResults` resolves `option.slot` to `` `item-${option.slot}` ``,
 * so this is exactly the runtime behavior, and every fixed slot name stays
 * typechecked instead of every typo compiling clean.
 */
interface MultiSelectItemSlotsByName {
  /** Shared content rendered before the standard row label. */
  'item-prefix'?: (props: MultiSelectItemSlotProps) => any

  /** Shared content rendered for the standard row label area. */
  'item-label'?: (props: MultiSelectItemSlotProps) => any

  /** Shared content rendered after the standard row label area. */
  'item-suffix'?: (props: MultiSelectItemSlotProps) => any

  /** Per-option dynamic slot, selected by the option's `slot` field. */
  [slotName: `item-${string}`]:
    | ((props: MultiSelectItemSlotProps) => any)
    | undefined
}

export interface MultiSelectSlots
  extends MultiSelectFixedSlots, MultiSelectItemSlotsByName {}

export interface MultiSelectEmits {
  /** Fired when the selection changes. */
  'update:modelValue': [value: Array<string | number>]

  /**
   * Fired alongside `update:modelValue` with the original option objects
   * resolved out of `options`, so custom fields on an option survive.
   */
  'update:selectedOptions': [value: MultiSelectOption[]]

  /** Fired when the open state changes. */
  'update:open': [value: boolean]

  /** Fired when the search query changes. */
  'update:query': [value: string]
}
