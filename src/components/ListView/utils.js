export function getGridTemplateColumns(columns, withCheckbox = true) {
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

export const alignmentMap = {
  left: 'justify-start',
  start: 'justify-start',
  center: 'justify-center',
  middle: 'justify-center',
  right: 'justify-end',
  end: 'justify-end',
}
