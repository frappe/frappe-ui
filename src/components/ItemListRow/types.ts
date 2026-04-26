import type { Component } from 'vue'

export type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'

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
