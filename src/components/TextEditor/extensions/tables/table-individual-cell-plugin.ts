import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'
import LucideCircle from '~icons/lucide/circle?raw'
import { CellSelection } from 'prosemirror-tables'

export const tableIndividualCellPluginKey = new PluginKey('tableCellMenu')

export function tableBorderMenuPlugin(editor: Editor) {
  let currentCellHandle: HTMLElement | null = null
  let currentTableId: string | null = null
  let hideTimeout: NodeJS.Timeout | null = null

  const clearHandles = () => {
    if (hideTimeout) clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      currentCellHandle?.remove()
      currentCellHandle = null
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
    key: tableIndividualCellPluginKey,
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
currentCellHandle?.remove()
      currentCellHandle = null
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
            currentCellHandle &&
            (currentCellHandle.getAttribute('data-row-id') !==
              String(rowIndex) ||
              currentCellHandle.getAttribute('data-table-id') !== tableId)
          ) {
            currentCellHandle.remove()
            currentCellHandle = null
          }

          const editorElement = view.dom.parentElement!
          const editorRect = editorElement.getBoundingClientRect()
          const tableRect = table.getBoundingClientRect()

          if (
            !currentCellHandle ||
            currentCellHandle.getAttribute('data-row-id') !== String(rowIndex) ||
            currentCellHandle.getAttribute('data-table-id') !== tableId
          ) {
            currentCellHandle?.remove()

            currentCellHandle = document.createElement('div')
            currentCellHandle.className = 'table-row-handle-overlay'

            let iconContainer = document.createElement('div')
            iconContainer.innerHTML = LucideCircle as unknown as string
            currentCellHandle.appendChild(iconContainer)
            const svg = iconContainer.querySelector('svg')
            if (svg) {
              svg.style.width = '13px'
              svg.style.height = '13px'
            }
            currentCellHandle.setAttribute('data-row-id', String(rowIndex))
            currentCellHandle.setAttribute('data-table-id', tableId)

            const rowRect = row.getBoundingClientRect()

            currentCellHandle.style.cssText = `
              position: absolute;
              left: ${tableRect.left - editorRect.left - 7}px;
              top: ${rowRect.top - editorRect.top + rowRect.height / 2 - 10}px;
              height: 16px;
              width: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--ink-gray-7);
              cursor: pointer;
              z-index: 10;
              user-select: none;
              background-color: var(--surface-white);
              border: 1px solid var(--outline-gray-2);
              border-radius: 4px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              transition: all 0.15s ease;
            `

            currentCellHandle.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'var(--surface-gray-2)'
              this.style.borderColor = 'var(--outline-gray-3)'
              this.style.color = 'var(--surface-gray-7)'
              cancelClear()
            })

            currentCellHandle.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'var(--surface-white)'
              this.style.borderColor = 'var(--outline-gray-2)'
              this.style.color = 'var(--ink-gray-7)'
              clearHandles()
            })

            currentCellHandle.addEventListener('click', (e) => {
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

            editorElement.appendChild(currentCellHandle)
          }
          return false
        },
      },
    },
    view() {
      return {
        destroy() {
          currentCellHandle?.remove()
          currentCellHandle = null
        },
      }
    },
  })
}
