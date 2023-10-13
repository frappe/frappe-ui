export function getGridTemplateColumns(columns) {
  return (
    '14px ' +
    columns
      .map((col) => {
        let width = col.width || 1
        if (typeof width === 'number') {
          return width + 'fr'
        }
        return width
      })
      .join(' ')
  )
}

export const alignmentMap = {
  left: 'justify-start',
  start: 'justify-start',
  center: 'justify-center',
  middle: 'justify-center',
  right: 'justify-end',
  end: 'justify-end',
}
