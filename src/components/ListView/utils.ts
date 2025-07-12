import { type ListColumn, type ColumnAlignment } from './types'

export function getGridTemplateColumns(columns: ListColumn[], withCheckbox: boolean = true): string {
  let checkBoxWidth = withCheckbox ? '14px ' : ''
  let columnsWidth = columns
    .map((col) => {
      let width = col.width || 1
      if (typeof width === 'number') {
        return width + 'fr'
      }
      return width
    })
    .join(' ')
  return checkBoxWidth + columnsWidth
}

export const alignmentMap: Record<ColumnAlignment, string> = {
  left: 'justify-start',
  start: 'justify-start',
  center: 'justify-center',
  middle: 'justify-center',
  right: 'justify-end',
  end: 'justify-end',
}
