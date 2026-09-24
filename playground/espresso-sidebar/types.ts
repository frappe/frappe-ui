export type RowPrefix =
  | { icon: string }
  | { emoji: string }
  | { avatar: string }
  | { checkbox: string }
  | { marker: string }

export interface ItemRow {
  type: 'item'
  label?: string
  prefix?: RowPrefix
  /** Leading chevron for `expandable` rows. */
  chevron?: string
  hint?: string
  /** Trailing glyph, e.g. the + on LMS's "More" row. */
  suffixIcon?: string
  active?: boolean
  /** Left indent for nested rows, in px. */
  indent?: number
  /** Row width override for icon-only rows that hug their content. */
  width?: number
  /** Drawn in its hover state, as the design shows it. */
  hovered?: boolean
  /** White surface without the active shadow (collapsed event markers). */
  white?: boolean
  onClick?: () => void
  /** Only the icon is tinted (label rows in Mail). */
  iconColor?: string
}

export interface SectionRow {
  type: 'section'
  label: string
  /** A disclosure section: its chevron folds the rows beneath it. */
  chevron?: boolean
  hint?: string
  /** Open state of a disclosure section (defaults to open). */
  expanded?: boolean
  onToggle?: () => void
}

export interface DividerRow {
  type: 'divider'
}

export interface GroupRow {
  type: 'group'
  rows: Row[]
}

export type Row = ItemRow | SectionRow | DividerRow | GroupRow
