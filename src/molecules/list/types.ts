import type { RouteLocationRaw } from 'vue-router'

export type ListDivider = 'inset' | 'full' | 'none'
export type ListSortDirection = 'asc' | 'desc'

export interface ListProps {
  /**
   * Grid track sizes, written to the `--list-columns` CSS var shared by the
   * header and every row. Defaults to the feed template
   * `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content, trailing).
   * Table-style lists must pass deterministic track sizes — `auto` tracks
   * size independently per row.
   */
  columns?: string[]

  /**
   * Divider treatment between rows: `inset` starts at the content column
   * (the text edge), `full` spans all columns. Defaults to `inset` with the
   * default feed template, `full` when `columns` is set.
   */
  divider?: ListDivider

  /**
   * Reveals the animated checkbox column and switches row click from
   * navigate to toggle. Selected values surface via `v-model:selection`.
   */
  selectable?: boolean

  // Two more models live on List but aren't plain props (so they're not in
  // this interface): `v-model:selection` (string[], the checkbox set) and
  // `v-model:active` (string, the single open/highlighted row — the List
  // styles it and hides the dividers hugging it). See List.vue.

  /**
   * Fixed row height in px (sets `--list-row-height`). Required for
   * virtualization; without it rows size to their content. Responsive
   * heights are non-virtual — set them with classes on the rows instead.
   */
  rowHeight?: number
}

export interface ListRowProps {
  /**
   * Renders the row as a RouterLink. Without `to`, a row with a click
   * listener renders as a button; otherwise a plain div.
   */
  to?: RouteLocationRaw

  /**
   * Row key — the `selection` key when `selectable` and the `v-model:active`
   * key. Required whenever the list uses either.
   */
  value?: string

  /** Fired when the row is activated, unless selection mode claims the click. */
  onClick?: (event: MouseEvent) => void
}

export interface ListHeaderCellSortProps {
  /**
   * Active sort direction for this column, `null`/omitted when inactive.
   * The cell is controlled — sort state and toggle rules are app-owned:
   * update whatever drives your ordering in the `click` handler.
   */
  direction?: ListSortDirection | null
}

export interface ListVirtualOptions {
  /** Row height in px. Defaults to the List's `rowHeight`. */
  itemHeight?: number

  /** Rows rendered beyond the visible window on each side. */
  overscan?: number
}
