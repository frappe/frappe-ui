import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'

export const tableBorderMenuPluginKey = new PluginKey('tableBorderMenu')

export function tableBorderMenuPlugin(editor: Editor) {
  let currentRowHandle: HTMLElement | null = null
  let currentColHandle: HTMLElement | null = null
  let hideTimeout: NodeJS.Timeout | null = null

  const clearHandles = () => {
    if (hideTimeout) clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      currentRowHandle?.remove()
      currentColHandle?.remove()
      currentRowHandle = null
      currentColHandle = null
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
          if (target.closest('.table-row-handle-overlay') || target.closest('.table-col-handle-overlay')) {
            cancelClear()
            return false
          }
          const cell = target.closest('td, th')
          if (!cell || !cell.closest('.ProseMirror table')) {
            clearHandles()
            return false
          }
          else{
            cancelClear()
          }
          const row = cell.closest('tr')!
          const table = cell.closest('table')!
          const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row as HTMLTableRowElement)
          const colIndex = Array.from(row.querySelectorAll('td, th')).indexOf(cell as HTMLTableCellElement)
          
          const editorElement = view.dom.parentElement!
          const editorRect = editorElement.getBoundingClientRect()

          if (!currentRowHandle || currentRowHandle.getAttribute('data-row-id') !== String(rowIndex)) {
            currentRowHandle?.remove()
            
            currentRowHandle = document.createElement('div')
            currentRowHandle.className = 'table-row-handle-overlay'
            currentRowHandle.textContent = '⋮⋮'
            currentRowHandle.setAttribute('data-row-id', String(rowIndex))

            const rowRect = row.getBoundingClientRect()

            currentRowHandle.style.cssText = `
              position: absolute;
              left: ${rowRect.left - editorRect.left - 30}px;
              top: ${rowRect.top - editorRect.top + (rowRect.height / 2) - 10}px;
              height: 20px;
              width: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: bold;
              color: var(--surface-gray-5);
              cursor: pointer;
              z-index: 10;
              user-select: none;
              background-color: white;
              border: 1px solid var(--outline-gray-3);
              border-radius: 4px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            `

            currentRowHandle.addEventListener('mouseenter', function() {
               this.style.backgroundColor = 'var(--outline-gray-1)'
                this.style.color = 'var(--outline-gray-4)'
              cancelClear()
            })

            currentRowHandle.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white'
              this.style.color = 'var(--surface-ink-8)'
              clearHandles()
            })

            currentRowHandle.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()

              const cellEl = row.querySelector('td, th')
              if (!cellEl) return
              const cellRect = cellEl.getBoundingClientRect()
              const editorRect = editorElement.getBoundingClientRect()
              const menuHeight = 40; 
              const gap = 8;

              window.dispatchEvent(new CustomEvent('table-border-click', {
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
              }))
            })

            editorElement.appendChild(currentRowHandle)
          }

          // COLUMN HANDLE (only on first row)
          if (rowIndex === 0) {
            if (!currentColHandle || currentColHandle.getAttribute('data-col-id') !== String(colIndex)) {
              currentColHandle?.remove()
              
              currentColHandle = document.createElement('div')
              currentColHandle.className = 'table-col-handle-overlay'
              currentColHandle.textContent = '⋮⋮'
              currentColHandle.setAttribute('data-col-id', String(colIndex))

              const cellRect = cell.getBoundingClientRect()

              currentColHandle.style.cssText = `
                position: absolute;
                left: ${cellRect.left - editorRect.left + (cellRect.width / 2) - 10}px;
                top: ${cellRect.top - editorRect.top - 30}px;
                height: 20px;
                width: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: var(--surface-gray-5);
                cursor: pointer;
                z-index: 10;
                user-select: none;
                background-color: white;
                border: 1px solid var(--outline-gray-3);
                border-radius: 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              `

              currentColHandle.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--outline-gray-1)'
                this.style.color = 'var(--outline-gray-4)'
                cancelClear()
              })

              currentColHandle.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white'
              this.style.color = 'var(--surface-ink-8)'
              clearHandles()
              })

              currentColHandle.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()

                const cellRect = cell.getBoundingClientRect()
                const editorRect = editorElement.getBoundingClientRect()
                const menuHeight = 40; // px, adjust if your menu is taller/shorter
                const gap = 8; // px, gap between menu and cell

                window.dispatchEvent(new CustomEvent('table-border-click', {
                  bubbles: true,
                  detail: {
                    axis: 'column',
                    position: {
                      // Appear above the clicked cell, not overlapping
                      top: cellRect.top - editorRect.top - menuHeight - gap,
                      left: cellRect.left - editorRect.left,
                    },
                    cellInfo: {
                      element: cell,
                      rowIndex,
                      colIndex,
                    },
                  },
                }))
              })

              editorElement.appendChild(currentColHandle)
            }
          } else {
            if (currentColHandle) {
              currentColHandle.remove()
              currentColHandle = null
            }
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
