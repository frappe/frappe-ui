import type { Component } from 'vue'
import type { InputLabelingProps } from '../../composables/useInputLabeling'
import type { PopoverAlign, PopoverSide } from '../shared/selection/types'
import type { PortalTarget } from '../../composables/usePortalTarget'

export type { PopoverAlign, PopoverSide }

/**
 * Option values are `string | number` across the whole selection family.
 * `''` is a legitimate value (a "none" / reset row) and is round-tripped
 * through `useEmptyValueMapping`.
 */
export type SelectOptionValue = string | number

export type SelectOption =
  | string
  | {
      label: string
      value: SelectOptionValue
      disabled?: boolean
      icon?: string | Component
      description?: string
      slot?: string
      [key: string]: any
    }

export type SelectNormalizedOption = Exclude<SelectOption, string>

export interface SelectProps extends InputLabelingProps {
  /** Size of the select input. */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /** Visual style of the select input. */
  variant?: 'subtle' | 'outline' | 'ghost'

  /** Placeholder text displayed when no option is selected. */
  placeholder?: string

  /** If true, disables the select input. */
  disabled?: boolean

  /** The currently selected value. */
  modelValue?: SelectOptionValue

  /** Controls the visibility of the select menu. */
  open?: boolean

  /** Options to display in the dropdown. */
  options?: SelectOption[]

  /** Fallback empty-state copy rendered when no options are available. */
  emptyText?: string

  /**
   * Preferred popover side. Defaults to `'bottom'`.
   *
   * Setting `side`, `align`, or `offset` switches the menu from its default
   * item-aligned placement (anchored over the trigger, macOS-style) to
   * standard popper placement below/beside the trigger.
   */
  side?: PopoverSide

  /** Preferred popover alignment. Defaults to `'start'`. See `side`. */
  align?: PopoverAlign

  /** Gap in px between trigger and content. Defaults to `4`. See `side`. */
  offset?: number

  /** Teleport target for the popover content. Unset, an embedding host's target is used, else `body`. */
  portalTo?: PortalTarget
}

/**
 * Shared shape for `#trigger`, `#prefix`, `#suffix`, and `#footer`.
 * `selectedOption` is always `null` in `#prefix` because the prefix only
 * renders before a selection — the field is still exposed for slot-prop
 * symmetry across the group.
 *
 * `clear` and `setOpen` are the inside-out helpers: code running inside a
 * slot has no reference to the parent's model or open state.
 */
export interface SelectSlotProps {
  /** Whether the select menu is currently open. */
  open: boolean

  /** Whether the trigger is disabled. */
  disabled: boolean

  /** Currently selected option, if any. */
  selectedOption: SelectNormalizedOption | null

  /** Clears the current selection (sets the model to `undefined`). */
  clear: () => void

  /** Sets the menu open state. */
  setOpen: (value: boolean) => void
}

export type SelectTriggerSlotProps = SelectSlotProps
export type SelectPrefixSlotProps = SelectSlotProps
export type SelectSuffixSlotProps = SelectSlotProps

export interface SelectItemSlotProps {
  /** Item currently being rendered. */
  item: SelectNormalizedOption

  /** Whether the item is the current `modelValue`. */
  selected: boolean
}

/**
 * Fixed slot names. Kept separate from `SelectSlots` so the dynamic
 * `` `item-${string}` `` index signature can be intersected in without
 * constraining names that don't match the pattern.
 */
interface SelectFixedSlots {
  /** Fully custom trigger renderer. */
  trigger?: (props: SelectTriggerSlotProps) => any

  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any

  /** Overrides the rendered description content. */
  description?: () => any

  /** Content rendered before the trigger value. Receives the same shape
   * as `#trigger` and `#suffix` (`SelectSlotProps`). */
  prefix?: (props: SelectPrefixSlotProps) => any

  /**
   * Content rendered after the trigger value. Providing this slot
   * **replaces the default chevron** — render your own fallback when
   * your slot content is conditional.
   */
  suffix?: (props: SelectSuffixSlotProps) => any

  /**
   * Replaces the entire option row, including the row shell. A per-option
   * `slot` (`#item-<name>`) takes precedence over this slot.
   */
  item?: (props: SelectItemSlotProps) => any

  /** Fallback content rendered when no options are available. */
  empty?: () => any

  /** Content rendered below the option list. Stays pinned below the
   * scrollable options. Receives the same shape as `#trigger`. */
  footer?: (props: SelectSlotProps) => any
}

/**
 * Item slot names: the three fixed regions of the row shell, plus any
 * `#item-<name>` dispatched from an option's `slot` field.
 *
 * The index signature is deliberately narrowed to `` `item-${string}` `` —
 * `Select` resolves `option.slot` to `` `item-${option.slot}` ``, so this is
 * exactly the runtime behavior, and every fixed slot name stays typechecked
 * instead of every typo compiling clean.
 */
interface SelectItemSlotsByName {
  /** Content rendered before the standard option label. */
  'item-prefix'?: (props: SelectItemSlotProps) => any

  /** Content rendered for the standard option label area. */
  'item-label'?: (props: SelectItemSlotProps) => any

  /** Content rendered after the standard option label. */
  'item-suffix'?: (props: SelectItemSlotProps) => any

  /** Per-option dynamic slot, selected by the option's `slot` field. */
  [slotName: `item-${string}`]:
    | ((props: SelectItemSlotProps) => any)
    | undefined
}

export interface SelectSlots extends SelectFixedSlots, SelectItemSlotsByName {}

export interface SelectEmits {
  /** Fired when the selected value changes. */
  'update:modelValue': [value: SelectOptionValue | undefined]

  /** Fired when the open state changes. */
  'update:open': [value: boolean]
}
