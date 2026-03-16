import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { findTable, TableMap } from '@tiptap/pm/tables'
import { Editor } from '@tiptap/core'

export const customColumnResizingPluginKey = new PluginKey('customColumnResizing')

export function customColumnResizingPlugin(editor: Editor) {
  let isResizing = false
  let startX = 0
  let startWidths: number[] = []
  let columnIndex = -1
  let tableStart = 0
  let tableMap: TableMap | null = null
  let tableElement: HTMLElement | null = null

  return new Plugin({
    key: customColumnResizingPluginKey,
    priority: 5000,
    props: {
      handleDOMEvents: {
        mousedown(view: EditorView, event: MouseEvent) {
          const target = event.target as HTMLElement
          const handle = target.closest('.column-resize-handle')
          
          if (!handle) return false

          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()
          
          const tableElement = handle.closest('table') as HTMLElement
          if (!tableElement) return false

          let table = null
          let pos = 0
          view.state.doc.descendants((node, nodePos) => {
            if (node.type.name === 'table' && !table) {
              const domNode = view.nodeDOM(nodePos)
              if (domNode === tableElement) {
                table = { node, start: nodePos }
                pos = nodePos
                return false
              }
            }
          })

          if (!table) {
            const tableFromSelection = findTable(view.state.selection)
            if (tableFromSelection) {
              table = tableFromSelection
              pos = tableFromSelection.start
            } else {
              return false
            }
          }

          tableStart = pos
          tableMap = TableMap.get(table.node)
          tableElement = view.nodeDOM(tableStart) as HTMLElement
          
          if (!tableElement || !tableMap) return false

          const handleParent = handle.parentElement
          if (!handleParent) return false
          
          const firstRow = tableElement.querySelector('tr')
          if (!firstRow) return false

          const cells = Array.from(firstRow.querySelectorAll('td, th')) as HTMLElement[]
          
          const cellWithHandle = handle.closest('td, th') as HTMLElement
          if (!cellWithHandle) return false
          
          columnIndex = cells.findIndex(cell => {
            const cellRect = cell.getBoundingClientRect()
            const handleCellRect = cellWithHandle.getBoundingClientRect()
            return Math.abs(cellRect.left - handleCellRect.left) < 5
          })

          if (columnIndex === -1) {
            const handleRect = handle.getBoundingClientRect()
            const handleX = handleRect.left
            
            for (let i = 0; i < cells.length; i++) {
              const cellRect = cells[i].getBoundingClientRect()
              if (Math.abs(handleX - cellRect.right) < 10) {
                columnIndex = i
                break
              }
            }
          }

          if (columnIndex === -1) return false

          startWidths = []
          const cellsInColumn = tableMap.cellsInColumn(columnIndex)
          cellsInColumn.forEach((cellPos) => {
            const pos = tableStart + cellPos + 1
            const domCell = view.nodeDOM(pos) as HTMLElement
            if (domCell) {
              startWidths.push(domCell.offsetWidth)
            }
          })

          if (startWidths.length === 0) return false

          isResizing = true
          startX = event.clientX

          document.body.classList.add('resizing-table')
          editor.setEditable(false)
          
          const prosemirrorEl = view.dom as HTMLElement
          prosemirrorEl.setAttribute('contenteditable', 'false')
          prosemirrorEl.style.userSelect = 'none'
          prosemirrorEl.style.cursor = 'col-resize'

          const onMouseMove = (e: MouseEvent) => {
            if (!isResizing || !tableMap || !tableElement) return
            e.preventDefault()
            e.stopPropagation()

            const diff = e.clientX - startX
            const baseWidth = startWidths[0] || 50
            const newWidth = Math.max(50, baseWidth + diff)
            const cellsInColumn = tableMap.cellsInColumn(columnIndex)
            cellsInColumn.forEach((cellPos, idx) => {
              const pos = tableStart + cellPos + 1
              const domCell = view.nodeDOM(pos) as HTMLElement
              if (domCell) {
                domCell.style.width = `${newWidth}px`
                domCell.style.minWidth = `${newWidth}px`
              }
            })
          }

          const onMouseUp = () => {
            if (!isResizing) return
            
            isResizing = false
            document.body.classList.remove('resizing-table')
            editor.setEditable(true)
            const prosemirrorEl = editor.view.dom as HTMLElement
            prosemirrorEl.setAttribute('contenteditable', 'true')
            prosemirrorEl.style.userSelect = ''
            prosemirrorEl.style.cursor = ''
            
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
          }

          document.addEventListener('mousemove', onMouseMove, true)
          document.addEventListener('mouseup', onMouseUp, true)

          return true
        },
        mousemove(view: EditorView, event: MouseEvent) {
          if (isResizing) {
            const target = event.target as HTMLElement
            if (!target.closest('.column-resize-handle')) {
              event.preventDefault()
              event.stopPropagation()
              return true
            }
          }
          return false
        },
      },
    },
  })
}

