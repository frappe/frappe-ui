import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'
import LucideGripVertical from '~icons/lucide/grip-vertical?raw'
import { CellSelection } from 'prosemirror-tables'

export const tableBorderMenuPluginKey = new PluginKey('tableBorderMenu')

export function tableBorderMenuPlugin(editor: Editor) {
  let currentRowHandle: HTMLElement | null = null
  let currentColHandle: HTMLElement | null = null
  let currentTableId: string | null = null
  let hideTimeout: NodeJS.Timeout | null = null

  const clearHandles = () => {
    if (hideTimeout) clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      currentRowHandle?.remove()
      currentColHandle?.remove()
      currentRowHandle = null
      currentColHandle = null
      currentTableId = null
    }, 100)
  }

  const cancelClear = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  return new Plugin({
    key: tableBorderMenuPluginKey,
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          const target = event.target as HTMLElement

          if (
            target.closest('.table-row-handle-overlay') ||
            target.closest('.table-col-handle-overlay')
          ) {
            cancelClear()
            return false
          }

          const cell = target.closest('td, th')
          if (!cell || !cell.closest('.ProseMirror table')) {
            clearHandles()
            return false
          }

          cancelClear()

          const row = cell.closest('tr')!
          const table = cell.closest('table')!

          const tableId = Array.from(
            view.dom.querySelectorAll('.ProseMirror table'),
          )
            .indexOf(table as HTMLTableElement)
            .toString()

          if (currentTableId && currentTableId !== tableId) {
            currentRowHandle?.remove()
            currentColHandle?.remove()
            currentRowHandle = null
            currentColHandle = null
            currentTableId = null
          }

          currentTableId = tableId

          const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(
            row as HTMLTableRowElement,
          )
          const colIndex = Array.from(row.querySelectorAll('td, th')).indexOf(
            cell as HTMLTableCellElement,
          )

          if (
            currentRowHandle &&
            (currentRowHandle.getAttribute('data-row-id') !==
              String(rowIndex) ||
              currentRowHandle.getAttribute('data-table-id') !== tableId)
          ) {
            currentRowHandle.remove()
            currentRowHandle = null
          }
          if (
            currentColHandle &&
            (currentColHandle.getAttribute('data-col-id') !==
              String(colIndex) ||
              currentColHandle.getAttribute('data-table-id') !== tableId)
          ) {
            currentColHandle.remove()
            currentColHandle = null
          }

          const editorElement = view.dom.parentElement!
          const editorRect = editorElement.getBoundingClientRect()
          const tableRect = table.getBoundingClientRect()

          if (
            !currentRowHandle ||
            currentRowHandle.getAttribute('data-row-id') !== String(rowIndex) ||
            currentRowHandle.getAttribute('data-table-id') !== tableId
          ) {
            currentRowHandle?.remove()

            currentRowHandle = document.createElement('div')
            currentRowHandle.className = 'table-row-handle-overlay'

            let iconContainer = document.createElement('div')
            iconContainer.innerHTML = LucideGripVertical as unknown as string
            currentRowHandle.appendChild(iconContainer)
            const svg = iconContainer.querySelector('svg')
            if (svg) {
              svg.style.width = '16px'
              svg.style.height = '16px'
            }
            currentRowHandle.setAttribute('data-row-id', String(rowIndex))
            currentRowHandle.setAttribute('data-table-id', tableId)

            const rowRect = row.getBoundingClientRect()

            currentRowHandle.style.cssText = `
              position: absolute;
              left: ${tableRect.left - editorRect.left - 30}px;
              top: ${rowRect.top - editorRect.top + rowRect.height / 2 - 10}px;
              height: 20px;
              width: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--gray-600);
              cursor: pointer;
              z-index: 10;
              user-select: none;
              background-color: var(--gray-50);
              border: 1px solid var(--gray-200);
              border-radius: 4px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              transition: all 0.15s ease;
            `

            currentRowHandle.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'var(--gray-100)'
              this.style.borderColor = 'var(--gray-300)'
              this.style.color = 'var(--gray-700)'
              cancelClear()
            })

            currentRowHandle.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'var(--gray-50)'
              this.style.borderColor = 'var(--gray-200)'
              this.style.color = 'var(--gray-600)'
              clearHandles()
            })

            currentRowHandle.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellEl = row.querySelector('td, th')
              if (!cellEl) return

              const cellRect = cellEl.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 40
              const gap = 8

              const { selection } = view.state
              const isCellSelection = selection instanceof CellSelection

              if (!isCellSelection) {
                const cellPos = view.posAtDOM(cellEl as Node, 0)
                editor.commands.focus()
                editor.commands.setTextSelection(cellPos)

                if (editor.commands.selectRow) {
                  editor.commands.selectRow(rowIndex)
                } else {
                }
              } else {
              }

              const rowEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'row',
                  position: {
                    top: cellRect.top - editorRect.top - menuHeight - gap,
                    left: cellRect.left - editorRect.left,
                  },
                  cellInfo: {
                    element: cellEl,
                    rowIndex,
                    colIndex: 0,
                  },
                },
              })
              editorElement.dispatchEvent(rowEvent)
              window.dispatchEvent(rowEvent)
            })

            editorElement.appendChild(currentRowHandle)
          }

          if (
            !currentColHandle ||
            currentColHandle.getAttribute('data-col-id') !== String(colIndex) ||
            currentColHandle.getAttribute('data-table-id') !== tableId
          ) {
            currentColHandle?.remove()

            currentColHandle = document.createElement('div')
            currentColHandle.className = 'table-col-handle-overlay'
            let iconContainer = document.createElement('div')
            iconContainer.innerHTML = LucideGripVertical as unknown as string
            const svg = iconContainer.querySelector('svg')
            if (svg) {
              svg.style.width = '16px'
              svg.style.height = '16px'
            }

            currentColHandle.appendChild(iconContainer)
            currentColHandle.setAttribute('data-col-id', String(colIndex))
            currentColHandle.setAttribute('data-table-id', tableId)

            const cellRect = cell.getBoundingClientRect()

            currentColHandle.style.cssText = `
              position: absolute;
              left: ${cellRect.left - editorRect.left + cellRect.width / 2 - 10}px;
              top: ${tableRect.top - editorRect.top - 30}px;
              height: 20px;
              width: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--gray-600);
              cursor: pointer;
              z-index: 10;
              user-select: none;
              background-color: var(--gray-50);
              border: 1px solid var(--gray-200);
              border-radius: 4px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              transition: all 0.15s ease;
            `

            currentColHandle.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'var(--gray-100)'
              this.style.borderColor = 'var(--gray-300)'
              this.style.color = 'var(--gray-700)'
              cancelClear()
            })

            currentColHandle.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'var(--gray-50)'
              this.style.borderColor = 'var(--gray-200)'
              this.style.color = 'var(--gray-600)'
              clearHandles()
            })

            currentColHandle.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellRect = cell.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 40
              const gap = 8

              const { selection } = view.state
              const isCellSelection = selection instanceof CellSelection

              if (!isCellSelection) {
                const cellPos = view.posAtDOM(cell as Node, 0)
                editor.commands.focus()
                editor.commands.setTextSelection(cellPos)

                if (editor.commands.selectColumn) {
                  editor.commands.selectColumn(colIndex)
                } else {
                }
              } else {
              }

              const columnEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'column',
                  position: {
                    top: cellRect.top - editorRect.top - menuHeight - gap,
                    left: cellRect.left - editorRect.left,
                  },
                  cellInfo: {
                    element: cell,
                    rowIndex,
                    colIndex,
                  },
                },
              })
              editorElement.dispatchEvent(columnEvent)
              window.dispatchEvent(columnEvent)
            })

            editorElement.appendChild(currentColHandle)
          }

          return false
        },
      },
    },
    view() {
      return {
        destroy() {
          currentRowHandle?.remove()
          currentColHandle?.remove()
          currentRowHandle = null
          currentColHandle = null
        },
      }
    },
  })
}
