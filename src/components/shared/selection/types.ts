/**
 * Types shared by the selection family (Select, MultiSelect, Combobox).
 *
 * They live here rather than in one component's `types.ts` so the family
 * cannot drift: a structurally identical copy per component compiles fine
 * even after the copies diverge.
 */

/** Popover placement relative to the trigger. */
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'

/** Popover alignment along the chosen `side`. */
export type PopoverAlign = 'start' | 'center' | 'end'

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
