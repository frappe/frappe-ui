import { type Component } from 'vue'
import { type RouteLocation } from 'vue-router'
import { ButtonProps } from '../Button'

export type ColumnAlignment =
  | 'left'
  | 'start'
  | 'center'
  | 'middle'
  | 'right'
  | 'end'

export interface ListColumn {
  key: string
  label?: string
  prefix?: string | ((props: { row: Row }) => Component)
  width?: number | string
  align?: ColumnAlignment
  getLabel?: (props: { row: Row }) => string
  getTooltip?: (row: Row) => string
}

export interface Row {
  [key: string]: any
}

export interface GroupedRow {
  group: string
  rows: Row[]
  collapsed?: boolean
}

export interface EmptyState {
  title: string
  description: string
  button?: ButtonProps
}

export interface ListViewOptions {
  getRowRoute?: (row: Row) => RouteLocation | null
  onRowClick?: (row: Row) => void
  showTooltip?: boolean
  selectionText?: (count: number) => string
  enableActive?: boolean
  selectable?: boolean
  resizeColumn?: boolean
  rowHeight?: number
  emptyState?: EmptyState
}

export interface ListViewProps {
  id?: string
  columns: ListColumn[]
  rows: Row[] | GroupedRow[]
  rowKey: string
  options?: Partial<ListViewOptions>
}

export interface ListContext {
  id: string
  rowKey: string
  rows: Row[] | GroupedRow[]
  columns: ListColumn[]
  options: ListViewOptions
  selections: Set<string>
  activeRow: string
  allRowsSelected: boolean
  slots: {
    'group-header'?: Component
    cell?: Component
  }
  toggleRow: (row_id: string) => void
  toggleAllRows: (select?: boolean) => void
}

export type ListViewEmits = {
  (event: 'update:selections', value: Set<string>): void
  (event: 'update:active-row', value: string): void
}
