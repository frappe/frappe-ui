/**
 * Types shared by the selection family (Select, MultiSelect, Combobox).
 *
 * They live here rather than in one component's `types.ts` so the family
 * cannot drift: a structurally identical copy per component compiles fine
 * even after the copies diverge.
 */

import type { Component } from 'vue'
import type { InputExposed } from '../../../composables/inputTypes'

/**
 * Popover placement relative to the trigger, and alignment along that side.
 *
 * Re-exported from `Popover` rather than redeclared: a structurally identical
 * copy compiles fine even after the two drift, which is exactly the failure
 * this module exists to prevent. `Popover` owns the canonical declaration and
 * `src/index.ts` publishes it once from there.
 */
export type { PopoverAlign, PopoverSide } from '../../Popover/types'

/**
 * One option, in the shape all three components accept.
 *
 * Each component keeps its own option type, because each adds something the
 * others do not have (Combobox's custom rows, MultiSelect's per-item slot
 * implementations). This is the part they agree on, for code that works
 * across the family — a wrapper that takes `options` and hands them to
 * whichever component it renders, or an app's own option builder.
 *
 * It is a supertype, not a replacement: a `SelectionOption[]` is accepted by
 * all three, while each component's own type accepts more.
 */
export interface SelectionOption {
  /** Text shown for the option. */
  label: string

  /** The value committed to `v-model` when the option is picked. */
  value: string | number

  /** A `lucide-*` class name or a component, rendered before the label. */
  icon?: string | Component

  /** Secondary line below the label. */
  description?: string

  /** Renders the option unselectable. */
  disabled?: boolean

  /** Dispatches the row to the `#item-<slot>` template slot. */
  slot?: string

  /** Options carry any extra fields the app puts on them. */
  [key: string]: any
}

/**
 * A titled group of options, in the shape Combobox and MultiSelect accept.
 * Select has no grouping, so it takes a flat list only.
 */
export interface SelectionGroup<TOption = SelectionOption> {
  /** Distinguishes two groups with the same `group` title. */
  key?: string | number

  /** The group's heading. */
  group: string

  /** Renders the group's options without the heading. */
  hideLabel?: boolean

  /** The options in this group. */
  options: TOption[]
}

/**
 * The `defineExpose` shape every selection component shares, so a template
 * ref works the same way whichever picker it points at.
 */
export interface SelectionExposed extends InputExposed {
  /** Clears the current selection. It leaves the search query alone. */
  clear: () => void
}

/*
 * ---------------------------------------------------------------------------
 * Styling contract: `data-slot` and state attributes
 * ---------------------------------------------------------------------------
 *
 * These attributes are public API, exactly like prop names. From 1.0.0 a
 * marker cannot be renamed or removed without a major version. Adding one is
 * backward-compatible; removing one is not. Anything not listed here is
 * internal and may move or disappear at any time.
 *
 * `data-slot` values, and which components render them:
 *
 *   trigger        Select  MultiSelect  Combobox   the control element
 *   chevron        Select  MultiSelect  Combobox   the open/close indicator
 *   content        Select  MultiSelect  Combobox   portaled reka content root
 *   content-body   Select  MultiSelect  Combobox   floating panel shell
 *                                                  (Select/Combobox get it
 *                                                  from PopoverPanel;
 *                                                  MultiSelect renders its own)
 *   item           Select  MultiSelect  Combobox   one option row
 *   empty          Select  MultiSelect  Combobox   no-results message
 *   footer         Select  MultiSelect  Combobox   below the option list
 *   search                 MultiSelect  Combobox   in-popover search row
 *   input                  MultiSelect  Combobox   a text input (the search
 *                                                  input; on Combobox in input
 *                                                  mode also the trigger input)
 *   loading                MultiSelect  Combobox   loading row in the list
 *   group                  MultiSelect  Combobox   one option group
 *   group-label            MultiSelect  Combobox   that group's heading
 *
 * Select renders no `search` / `input` / `loading` / `group` / `group-label`
 * because it has no in-popover search, no async loading and no grouping.
 *
 * Each `item` additionally contains `item-list-row` and `item-prefix`, which
 * are published by the shared `ItemListRow` component, not by this family.
 *
 * State attributes, both on the `content` element:
 *
 *   data-selection   MultiSelect  Combobox   always present and always empty.
 *                    Marks the popover as belonging to this family; gates
 *                    `popoverMotion.css` so it cannot leak onto other
 *                    popovers sharing the same `data-slot` names.
 *   data-loading     MultiSelect  Combobox   present and empty while the
 *                    `loading` prop is true, absent otherwise. Never carries
 *                    a value — match on presence (`[data-loading]`), not on
 *                    `[data-loading='true']`.
 *
 * Select carries neither: it has no loading state, and its motion comes from
 * `PopoverPanel` rather than `popoverMotion.css`.
 *
 * `content`, `trigger` and `input` also mirror the `variant` and `size` props
 * as `data-variant` / `data-size`.
 */
