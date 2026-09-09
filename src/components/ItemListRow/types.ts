import type { Component } from 'vue'
import type { InputSize } from '../../composables/inputTypes'

/**
 * Row density scale. The rows a selection menu is built from have to line up
 * with the trigger above them, so this is `InputSize` under the row's own
 * name — 24/28/32/40px — and the row implements all four.
 */
export type ItemListSize = InputSize

export interface ItemListRowProps {
  /** Element tag or component used for the row wrapper. */
  as?: string | Component

  /** Shared row density preset. */
  size?: ItemListSize

  /** Highlights the row as the current active target. */
  active?: boolean

  /** Highlights the row as selected. */
  selected?: boolean

  /** Disables interaction and applies muted styling. */
  disabled?: boolean
}
