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
  /** Clears the current selection. */
  clear: () => void

  /** Moves focus to the component's control. */
  focus: (options?: FocusOptions) => void
}
