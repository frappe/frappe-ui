/**
 * Types shared by the selection family (Select, MultiSelect, Combobox).
 *
 * They live here rather than in one component's `types.ts` so the family
 * cannot drift: a structurally identical copy per component compiles fine
 * even after the copies diverge.
 */

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
 * The `defineExpose` shape every selection component shares, so a template
 * ref works the same way whichever picker it points at.
 */
export interface SelectionExposed {
  /** Clears the current selection. It leaves the search query alone. */
  clear: () => void

  /** Moves focus to the component's control. */
  focus: (options?: FocusOptions) => void
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
