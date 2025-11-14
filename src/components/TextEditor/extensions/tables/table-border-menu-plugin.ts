import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'
import LucideGripVertical from '~icons/lucide/grip-vertical?raw'
import LucideCircle from '~icons/lucide/dot?raw'
import { CellSelection } from 'prosemirror-tables'

export const tableBorderMenuPluginKey = new PluginKey('tableBorderMenu')

export function tableBorderMenuPlugin(editor: Editor) {
  let currentRowHandle: HTMLElement | null = null
  let currentColHandle: HTMLElement | null = null
  let currentCellTrigger: HTMLElement | null = null
  let currentTableId: string | null = null
  let hideTimeout: NodeJS.Timeout | null = null
  let cellTriggerTimeout: NodeJS.Timeout | null = null

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

  const clearCellTrigger = () => {
    if (cellTriggerTimeout) clearTimeout(cellTriggerTimeout)
    cellTriggerTimeout = setTimeout(() => {
      currentCellTrigger?.remove()
      currentCellTrigger = null
    }, 100)
  }

  const cancelCellTriggerClear = () => {
    if (cellTriggerTimeout) {
      clearTimeout(cellTriggerTimeout)
      cellTriggerTimeout = null
    }
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
            target.closest('.table-col-handle-overlay') ||
            target.closest('.table-cell-trigger-overlay')
          ) {
            cancelClear()
            cancelCellTriggerClear()
            return false
          }

          const cell = target.closest('td, th')
          if (!cell || !cell.closest('.ProseMirror table')) {
            clearHandles()
            clearCellTrigger()
            return false
          }

          cancelClear()
          cancelCellTriggerClear()

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
              svg.style.width = '13px'
              svg.style.height = '13px'
            }
            currentRowHandle.setAttribute('data-row-id', String(rowIndex))
            currentRowHandle.setAttribute('data-table-id', tableId)

            const rowRect = row.getBoundingClientRect()

            currentRowHandle.style.cssText = `
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

            currentRowHandle.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'var(--surface-gray-2)'
              this.style.borderColor = 'var(--outline-gray-3)'
              this.style.color = 'var(--surface-gray-7)'
              cancelClear()
            })

            currentRowHandle.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'var(--surface-white)'
              this.style.borderColor = 'var(--outline-gray-2)'
              this.style.color = 'var(--ink-gray-7)'
              clearHandles()
            })

            currentRowHandle.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellEl = row.querySelector('td, th')
              if (!cellEl) return

              const cellRect = cellEl.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 25
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
              svg.style.width = '13px'
              svg.style.height = '13px'
            }

            currentColHandle.appendChild(iconContainer)
            currentColHandle.setAttribute('data-col-id', String(colIndex))
            currentColHandle.setAttribute('data-table-id', tableId)

            const cellRect = cell.getBoundingClientRect()

            currentColHandle.style.cssText = `
              position: absolute;
              left: ${cellRect.left - editorRect.left + cellRect.width / 2 - 10}px;
              top: ${tableRect.top - editorRect.top - 7}px;
              height: 16px;
              width: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--ink-gray-7);
              cursor: pointer;
              z-index: 10;
              rotate: 90deg;
              user-select: none;
              background-color: var(--surface-white);
              border: 1px solid var(--outline-gray-2);
              border-radius: 4px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              transition: all 0.15s ease;
            `

            currentColHandle.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'var(--surface-gray-2)'
              this.style.borderColor = 'var(--outline-gray-3)'
              this.style.color = 'var(--surface-gray-7)'
              cancelClear()
            })

            currentColHandle.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'var(--surface-white)'
              this.style.borderColor = 'var(--outline-gray-2)'
              this.style.color = 'var(--ink-gray-7)'
              clearHandles()
            })

            currentColHandle.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellRect = cell.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 30
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
          const cellId = `${tableId}-${rowIndex}-${colIndex}`
          if (
            !currentCellTrigger ||
            currentCellTrigger.getAttribute('data-cell-id') !== cellId
          ) {
            currentCellTrigger?.remove()

            currentCellTrigger = document.createElement('div')
            currentCellTrigger.className = 'table-cell-trigger-overlay'
            currentCellTrigger.setAttribute('data-cell-id', cellId)

            const cellRect = cell.getBoundingClientRect()

            currentCellTrigger.style.cssText = `
              position: absolute;
              left: ${cellRect.right - editorRect.left - 9}px;
              top: ${cellRect.top - editorRect.top + 8}px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--outline-gray-2);
              cursor: pointer;
              transition: all 0.15s ease;
              z-index: 10;
              user-select: none;
            `

            const svgNS = 'http://www.w3.org/2000/svg'
            const svg = document.createElementNS(svgNS, 'svg')
            svg.setAttribute('viewBox', '0 0 24 24')
            svg.setAttribute('width', '18')
            svg.setAttribute('height', '18')
            svg.setAttribute('fill', 'currentColor')

            const circle = document.createElementNS(svgNS, 'circle')
            circle.setAttribute('cx', '12')
            circle.setAttribute('cy', '12')
            circle.setAttribute('r', '4') // Smaller radius for a dot

            svg.appendChild(circle)
            currentCellTrigger.appendChild(svg)

            currentCellTrigger.addEventListener('mouseenter', function () {
              this.style.color = 'var(--surface-gray-7)'
              cancelCellTriggerClear()
            })

            currentCellTrigger.addEventListener('mouseleave', function () {
              this.style.color = 'var((--outline-gray-2)'
              clearCellTrigger()
            })

            currentCellTrigger.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellPos = view.posAtDOM(cell as Node, 0)
              editor.commands.focus()
              editor.commands.setTextSelection(cellPos)

              const triggerRect = currentCellTrigger!.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()

              const cellEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'cell',
                  position: {
                    top: triggerRect.bottom - editorRect.top - 25,
                    left: triggerRect.left - editorRect.left,
                  },
                  cellInfo: {
                    element: cell,
                    rowIndex,
                    colIndex,
                    isIndividualCell: true,
                  },
                },
              })
              editorElement.dispatchEvent(cellEvent)
              window.dispatchEvent(cellEvent)
            })

            editorElement.appendChild(currentCellTrigger)
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
          currentCellTrigger?.remove()
          currentRowHandle = null
          currentColHandle = null
          currentCellTrigger = null
        },
      }
    },
  })
}
