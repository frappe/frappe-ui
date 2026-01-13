import { Plugin, PluginKey, EditorState } from '@tiptap/pm/state'
import { TextSelection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'
import LucideGripVertical from '~icons/lucide/grip-vertical?raw'
import { CellSelection, findTable, TableMap } from '@tiptap/pm/tables'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

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

  const hideAllHandles = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    if (cellTriggerTimeout) {
      clearTimeout(cellTriggerTimeout)
      cellTriggerTimeout = null
    }
    currentRowHandle?.remove()
    currentColHandle?.remove()
    currentCellTrigger?.remove()
    currentRowHandle = null
    currentColHandle = null
    currentCellTrigger = null
    document.querySelectorAll('.table-cell-trigger-overlay').forEach(el => {
      el.remove()
    })
    document.querySelectorAll('.table-row-handle-overlay').forEach(el => {
      el.remove()
    })
    document.querySelectorAll('.table-col-handle-overlay').forEach(el => {
      el.remove()
    })
  }

  return new Plugin({
    key: tableBorderMenuPluginKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set, oldState, newState) {
        return set.map(tr.mapping, tr.doc)
      }
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
      handleDOMEvents: {
        mousedown(view, event) {
          return false
        },
        click(view, event) {
          return false
        },
        mousemove(view, event) {
          if (!editor.isEditable) {
            clearHandles()
            clearCellTrigger()
            return false
          }

          const target = event.target as HTMLElement
          if (
            target.closest('.table-row-handle-overlay') ||
            target.closest('.table-col-handle-overlay') ||
            target.closest('.table-cell-trigger-overlay') ||
            target.closest('.column-resize-handle')
          ) {
            cancelClear()
            cancelCellTriggerClear()
            return false
          }

          const cell = target.closest('td, th')
          if (!cell || !cell.closest('.ProseMirror table')) {
            clearHandles()
            const { selection } = view.state
            if (!(selection instanceof CellSelection)) {
              clearCellTrigger()
            }
            return false
          }
          cancelClear()
          
          const { selection } = view.state
          const isCellSelection = selection instanceof CellSelection
          if (isCellSelection) {
            currentRowHandle?.remove()
            currentColHandle?.remove()
            currentRowHandle = null
            currentColHandle = null
            cancelCellTriggerClear()
          } else {
            cancelCellTriggerClear()
          }

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

          let editorElement = view.dom.parentElement
          while (editorElement && getComputedStyle(editorElement).position === 'static') {
            editorElement = editorElement.parentElement
          }
          if (!editorElement) {
            editorElement = view.dom.parentElement!
          }
          
          const editorRect = editorElement.getBoundingClientRect()
          const tableRect = table.getBoundingClientRect()

          if (!isCellSelection) {
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
              const rowRect = row.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 30
              const cellPos = view.posAtDOM(cellEl as Node, 0)
              editor.commands.focus()
              editor.commands.setTextSelection(cellPos)
              editor.commands.selectRow(rowIndex)

              const rowHandleLeft =
                tableRect.left - editorRect.left - 7
              const rowHandleCenter = rowHandleLeft + 6

              // Position menu at the center of the row (vertically centered)
              const rowCenter = rowRect.top - editorRect.top + rowRect.height / 2 - menuHeight / 2

              const rowEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'row',
                  position: {
                    top: rowCenter,
                    left: rowHandleCenter,
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
          }
          if (!isCellSelection) {
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
              const gap = 12

              const cellPos = view.posAtDOM(cell as Node, 0)
              editor.commands.focus()
              editor.commands.setTextSelection(cellPos)
              editor.commands.selectColumn(colIndex)

              // Position menu above the table with some space
              const tableTop = tableRect.top - editorRect.top

              const columnEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'column',
                  position: {
                    top: tableTop - menuHeight - gap,
                    left:
                      cellRect.left -
                      editorRect.left +
                      cellRect.width / 2,
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
          }
          
          const cellId = `${tableId}-${rowIndex}-${colIndex}`
          if (!currentCellTrigger || currentCellTrigger.getAttribute('data-cell-id') !== cellId) {
            currentCellTrigger?.remove()

            currentCellTrigger = document.createElement('div')
            currentCellTrigger.className = 'table-cell-trigger-overlay'
            currentCellTrigger.setAttribute('data-cell-id', cellId)

            const cellRect = cell.getBoundingClientRect()
            currentCellTrigger.style.cssText = `
              position: absolute;
              left: ${cellRect.left - editorRect.left + cellRect.width - 9}px;
              top: ${cellRect.top - editorRect.top + cellRect.height / 2 - 9}px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--outline-gray-2);
              cursor: pointer;
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
            circle.setAttribute('r', '4')
            svg.appendChild(circle)
            currentCellTrigger.appendChild(svg)


            currentCellTrigger.addEventListener('mouseenter', () => {
              if (currentCellTrigger) {
                currentCellTrigger.style.color = 'var(--surface-gray-7)'
                cancelCellTriggerClear()
              }
            })
            currentCellTrigger.addEventListener('mouseleave', () => {
              if (currentCellTrigger) {
                currentCellTrigger.style.color = 'var(--outline-gray-2)'
                clearCellTrigger()
              }
            })
            currentCellTrigger.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()
              const { selection } = view.state
              const isCellSelection = selection instanceof CellSelection
              const cellPos = view.posAtDOM(cell as Node, 0)
              const $cellPos = view.state.doc.resolve(cellPos)
              const table = findTable($cellPos)
              
              if (table) {
                editor.commands.focus()
                const map = TableMap.get(table.node)
                const cellIndex = rowIndex * map.width + colIndex
                const cellPosInTable = map.map[cellIndex]
                const absoluteCellPos = table.start + cellPosInTable
                const cellSelection = CellSelection.create(view.state.doc, absoluteCellPos, absoluteCellPos)
                const newTr = view.state.tr.setSelection(cellSelection)
                view.dispatch(newTr)
              } else {
                editor.commands.focus()
                editor.commands.setTextSelection(cellPos)
              }
              
              const triggerRect = currentCellTrigger!.getBoundingClientRect()
              const cellEvent = new CustomEvent('table-border-click', {
                bubbles: true,
                detail: {
                  axis: 'cell',
                  position: { top: triggerRect.bottom - editorRect.top - 25, left: triggerRect.left - editorRect.left },
                  cellInfo: { element: cell, rowIndex, colIndex, isIndividualCell: !isCellSelection, isMultiCellSelection: isCellSelection },
                },
              })
              editorElement.dispatchEvent(cellEvent)
              window.dispatchEvent(cellEvent)
            })

            editorElement.appendChild(currentCellTrigger)
          } else if (currentCellTrigger) {
            const cellRect = cell.getBoundingClientRect()
            currentCellTrigger.style.left = `${cellRect.left - editorRect.left + cellRect.width - 9}px`
            currentCellTrigger.style.top = `${cellRect.top - editorRect.top + cellRect.height / 2 - 9}px`
            currentCellTrigger.style.display = 'flex'
          }

          return false
        },
      },
    },
    view(view) {
      let cellSelectionTimeout: NodeJS.Timeout | null = null
      let isMouseDown = false
      let lastSelection: any = null

      const handleMouseDown = () => {
        isMouseDown = true
        if (cellSelectionTimeout) {
          clearTimeout(cellSelectionTimeout)
          cellSelectionTimeout = null
        }
      }

      const handleMouseUp = () => {
        isMouseDown = false
        setTimeout(() => {
          const { selection } = view.state
          const isCellSelection = selection instanceof CellSelection
          if (isCellSelection && selection.$anchorCell && selection.$headCell) {
            const anchorPos = selection.$anchorCell.pos
            const headPos = selection.$headCell.pos
            if (anchorPos !== headPos) {
              checkCellSelection(true)
            }
          }
        }, 150)
      }

      const showMultiCellMenu = () => {
        const selectedCells = view.dom.querySelectorAll('.selectedCell')
        
        if (selectedCells.length < 2) return
        
        let minLeft = Infinity
        let maxRight = -Infinity
        let minTop = Infinity
        let maxBottom = -Infinity
        let firstCell: HTMLElement | null = null
        
        selectedCells.forEach((cell) => {
          const rect = (cell as HTMLElement).getBoundingClientRect()
          minLeft = Math.min(minLeft, rect.left)
          maxRight = Math.max(maxRight, rect.right)
          minTop = Math.min(minTop, rect.top)
          maxBottom = Math.max(maxBottom, rect.bottom)
          if (!firstCell) {
            firstCell = cell as HTMLElement
          }
        })
        
        if (!firstCell) return
        
        const table = firstCell.closest('table')
        if (!table) return
        
        let editorElement = view.dom.parentElement
        while (editorElement && getComputedStyle(editorElement).position === 'static') {
          editorElement = editorElement.parentElement
        }
        if (!editorElement) {
          editorElement = view.dom.parentElement!
        }
        
        const editorRect = editorElement.getBoundingClientRect()
        
        const centerX = (minLeft + maxRight) / 2
        const menuHeight = 30
        const gap = 12
        
        const row = firstCell.closest('tr')
        const colIndex = Array.from(row?.querySelectorAll('td, th') || []).indexOf(firstCell as HTMLTableCellElement)
        const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row as HTMLTableRowElement)
        
        const tableRect = table.getBoundingClientRect()
        const spaceAbove = minTop - tableRect.top
        const spaceBelow = tableRect.bottom - maxBottom
        
        let finalTop: number
        if (spaceAbove >= menuHeight + gap) {
          finalTop = minTop - menuHeight - gap
        } else if (spaceBelow >= menuHeight + gap) {
          finalTop = maxBottom + gap
        } else {
          finalTop = minTop - menuHeight - gap
        }
        
        const finalLeft = centerX
        
        const cellEvent = new CustomEvent('table-border-click', {
          bubbles: true,
          detail: {
            axis: 'cell',
            position: {
              top: finalTop,
              left: finalLeft,
            },
            cellInfo: {
              element: firstCell,
              rowIndex,
              colIndex,
              isIndividualCell: false,
              isMultiCellSelection: true,
            },
          },
        })
        editorElement.dispatchEvent(cellEvent)
        window.dispatchEvent(cellEvent)
      }

      const checkCellSelection = (forceCheck = false) => {
        if (isMouseDown && !forceCheck) return
        
        const { selection } = view.state
        const isCellSelection = selection instanceof CellSelection
        
        if (isCellSelection && selection.$anchorCell && selection.$headCell) {
          const anchorPos = selection.$anchorCell.pos
          const headPos = selection.$headCell.pos
          
          if (anchorPos !== headPos) {
            const selectionChanged = lastSelection === null || 
              lastSelection.$anchorCell?.pos !== anchorPos || 
              lastSelection.$headCell?.pos !== headPos
            
            if (selectionChanged || forceCheck) {
              if (cellSelectionTimeout) {
                clearTimeout(cellSelectionTimeout)
              }
              
              cellSelectionTimeout = setTimeout(() => {
                if (!isMouseDown) {
                  showMultiCellMenu()
                }
              }, forceCheck ? 50 : 200)
            }
          } else {
            if (cellSelectionTimeout) {
              clearTimeout(cellSelectionTimeout)
              cellSelectionTimeout = null
            }
          }
        } else {
          if (cellSelectionTimeout) {
            clearTimeout(cellSelectionTimeout)
            cellSelectionTimeout = null
          }
        }
        
        lastSelection = selection
      }

      view.dom.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mouseup', handleMouseUp)

      return {
        update(view, prevState) {
          if (view.state.selection !== prevState.selection) {
            checkCellSelection()
          }
        },
        destroy() {
          hideAllHandles()
          if (cellSelectionTimeout) {
            clearTimeout(cellSelectionTimeout)
          }
          view.dom.removeEventListener('mousedown', handleMouseDown)
          document.removeEventListener('mouseup', handleMouseUp)
        },
      }
    },
  })
}
