import type { RouteLocationRaw } from 'vue-router'

export type ListDivider = 'inset' | 'full' | 'none'
export type ListSortDirection = 'asc' | 'desc'

/**
 * One complete track template per breakpoint. `base` is required and applies
 * from zero width up; every other key names a breakpoint from the app's
 * Tailwind `screens` and applies from that viewport width upward, until the
 * next supplied breakpoint. `sm` / `md` / `lg` / `xl` are the preset's own
 * names — an app with custom screens uses its own. A screen that is not a
 * plain width (a `{ min, max }` band, a `{ max }` ceiling, a `{ raw }` query)
 * gives a tier that is live wherever that screen's own variants are live.
 *
 * A key that is not one of the app's screens is ignored — its template never
 * applies. The index signature has to stay open because the names belong to
 * the app, so the type cannot reject it; a dev-mode warning does.
 *
 * Each value replaces the whole template. Arrays are never merged track by
 * track, so a breakpoint may change the track count as well as the widths.
 */
export interface ListColumnsByBreakpoint {
  /** Applies from zero width, up to the smallest supplied breakpoint. */
  base: string[]
  sm?: string[]
  md?: string[]
  lg?: string[]
  xl?: string[]
  [breakpoint: string]: string[] | undefined
}

/**
 * `columns` in either form: one template for every width, or one template per
 * breakpoint.
 */
export type ListColumns = string[] | ListColumnsByBreakpoint

export interface ListProps {
  /**
   * Grid track sizes shared by the header and every row. Defaults to the feed
   * template `['auto', 'minmax(0,1fr)', 'auto']` (leading media, content,
   * trailing). Table-style lists must pass deterministic track sizes — `auto`
   * tracks size independently per row, so independent row grids can't agree.
   *
   * Pass an array for one template at every width, or an object keyed by
   * breakpoint for a template that changes with the viewport:
   * `{ base: ['minmax(0,1fr)', '80px'], md: ['minmax(0,2fr)', '140px', '100px'] }`.
   * `base` is required, each breakpoint replaces the whole template, and an
   * omitted breakpoint keeps the one below it. Breakpoints are the consuming
   * app's own Tailwind `screens`, resolved in CSS — so `md` here and `md:hidden`
   * on a cell switch at the same width. A key that is not one of those screens
   * is ignored: its template never applies, and a dev-mode warning names it.
   * Changing the track count never hides a cell: pair it with matching
   * visibility classes on the header and the rows.
   */
  columns?: ListColumns

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
   * Fixed row height in px. Required for virtualization; without it rows size
   * to their content. Responsive heights are non-virtual — set them with
   * height classes on the rows instead.
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

  /**
   * Horizontal alignment of the header content. `'end'` right-aligns the cell
   * (for numeric/right-aligned columns) *and* moves the sort glyph to the
   * leading side, so the label stays flush with the column's right edge and
   * lines up with the values below. Defaults to `'start'`.
   */
  align?: 'start' | 'end'
}

export interface ListVirtualOptions {
  /** Row height in px. Defaults to the List's `rowHeight`. */
  itemHeight?: number

  /** Rows rendered beyond the visible window on each side. */
  overscan?: number
}
