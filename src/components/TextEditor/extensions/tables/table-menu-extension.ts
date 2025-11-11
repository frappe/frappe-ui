import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'

export const tableCellMenuPluginKey = new PluginKey('tableCellMenu')

export function tableCellMenuPlugin(editor: Editor) {
  return new Plugin({
    key: tableCellMenuPluginKey,
    props: {
      handleClick(view, pos, event) {
        const target = event.target as HTMLElement
        const cell = target.closest('td, th')
        
        if (!cell) return false
        const cellPos = view.posAtDOM(cell, 0)
        if (cellPos === null || cellPos === undefined) return false

        const $pos = view.state.doc.resolve(cellPos)
        const table = cell.closest('table')
        if (!table) return false

        const rows = Array.from(table.querySelectorAll('tr'))
        const row = cell.closest('tr')
        const rowIndex = rows.indexOf(row as HTMLTableRowElement)
        const cells = Array.from((row as HTMLTableRowElement).querySelectorAll('td, th'))
        const colIndex = cells.indexOf(cell as HTMLTableCellElement)

        const editorElement = editor.options.element as HTMLElement
        const editorRect = editorElement.getBoundingClientRect()
        const cellRect = cell.getBoundingClientRect()
        const customEvent = new CustomEvent('table-cell-click', {
          bubbles: true,
          detail: {
            element: cell,
            pos: cellPos,
            rowIndex,
            colIndex,
            isFirstRow: rowIndex === 0,
            isFirstCol: colIndex === 0,
            position: {
              top: cellRect.bottom - editorRect.top + 5,
              left: cellRect.left - editorRect.left,
            },
          },
        })

        editorElement.dispatchEvent(customEvent)
        return false 
      },
    },
  })
}