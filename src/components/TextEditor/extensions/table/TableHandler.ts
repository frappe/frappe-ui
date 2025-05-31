import { VueRenderer } from '@tiptap/vue-3'
import TableCellActionHandle from './TableCellActionHandle.vue'
import TableActionMenu from './TableActionMenu.vue'

export default class TableHandler {
  private editor: any
  private editorElement: HTMLElement
  private showActionHandle = false
  // private actionHandlePosition = { top: 0, left: 0 }
  // private actionHandleAxis = 'row'
  private showMenu = false
  private menuPosition = { top: 0, left: 0 }
  private menuAxis = 'row'
  private hoveredCellInfo: any = null
  private showColumnActionDots = false
  private showRowActionDots = false
  private columnActionPosition = { top: 0, left: 0 }
  private rowActionPosition = { top: 0, left: 0 }
  private columnCellInfo: any = null
  private rowCellInfo: any = null
  private activeCellInfo: any = null
  // private actionHandleComponent: VueRenderer | null = null
  private menuComponent: VueRenderer | null = null

  constructor(editor: any, editorElement: HTMLElement) {
    this.editor = editor
    this.editorElement = editorElement
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.editor || !this.editor.isEditable || this.showMenu) {
      if (!this.showMenu) this.hideActionHandle()
      return
    }

    const view = this.editor.view
    const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
    if (!pos) return

    const directDom = view.domAtPos(pos.pos)
    let cell =
      directDom?.node.nodeType === Node.ELEMENT_NODE
        ? directDom.node
        : directDom?.node.parentElement

    while (
      cell &&
      cell.tagName !== 'TD' &&
      cell.tagName !== 'TH' &&
      cell.closest('.ProseMirror')
    ) {
      cell = cell.parentElement
    }

    if (cell && (cell.tagName === 'TD' || cell.tagName === 'TH')) {
      const cellPos = this.getCellPosition(cell)
      const table = cell.closest('table')

      if (!table) {
        this.hideActionHandleIfNeeded(event)
        return
      }

      const editorContainerRect = this.editorElement.getBoundingClientRect()

      const topmostCell = this.getTopmostCellInColumn(table, cellPos.colIndex)
      const leftmostCell = this.getLeftmostCellInRow(table, cellPos.rowIndex)

      if (topmostCell) {
        const topmostRect = topmostCell.getBoundingClientRect()
        this.showColumnActionDots = true
        this.columnActionPosition = {
          top: topmostRect.top - editorContainerRect.top,
          left:
            topmostRect.left - editorContainerRect.left + topmostRect.width / 2,
        }
        this.columnCellInfo = {
          element: topmostCell,
          axis: 'column',
          ...this.getCellPosition(topmostCell),
          hoveredColIndex: cellPos.colIndex,
          originalHoveredCell: cell,
        }
        this.showColumnActionHandle()
      }

      if (leftmostCell) {
        const leftmostRect = leftmostCell.getBoundingClientRect()
        this.showRowActionDots = true
        this.rowActionPosition = {
          top:
            leftmostRect.top -
            editorContainerRect.top +
            leftmostRect.height / 2,
          left: leftmostRect.left - editorContainerRect.left,
        }
        this.rowCellInfo = {
          element: leftmostCell,
          axis: 'row',
          ...this.getCellPosition(leftmostCell),
          hoveredRowIndex: cellPos.rowIndex,
          originalHoveredCell: cell,
        }
        this.showRowActionHandle()
      }

      this.hoveredCellInfo = {
        element: cell,
        ...cellPos,
      }

      return
    } else {
      this.hideActionHandleIfNeeded(event)
    }
  }

  private showColumnActionHandle() {
    if (!this.showColumnActionDots) return

    const existingHandles = this.editorElement.querySelectorAll(
      '.column-action-handle',
    )
    existingHandles.forEach((handle) => handle.remove())

    this.createActionHandle('column', this.columnActionPosition)
  }

  private showRowActionHandle() {
    if (!this.showRowActionDots) return

    const existingHandles =
      this.editorElement.querySelectorAll('.row-action-handle')
    existingHandles.forEach((handle) => handle.remove())

    this.createActionHandle('row', this.rowActionPosition)
  }

  private createActionHandle(
    axis: string,
    position: { top: number; left: number },
  ) {
    const existingHandle = this.editorElement.querySelector(
      `.${axis}-action-handle`,
    )
    if (existingHandle) return

    const handleComponent = new VueRenderer(TableCellActionHandle, {
      editor: this.editor,
      props: {
        position,
        axis,
      },
    })

    if (handleComponent.element) {
      handleComponent.element.classList.add(`${axis}-action-handle`)
      handleComponent.element.addEventListener('click', () => {
        this.showTableActionMenu(axis)
      })
      this.editorElement.appendChild(handleComponent.element)
    }
  }

  private showTableActionMenu(type: string) {
    const cellInfo = type === 'column' ? this.columnCellInfo : this.rowCellInfo
    const position =
      type === 'column' ? this.columnActionPosition : this.rowActionPosition

    if (!cellInfo) return

    this.focusCellForMenu(cellInfo)

    if (type === 'row') {
      this.menuPosition = {
        top: position.top,
        left: position.left + 20,
      }
    } else {
      this.menuPosition = {
        top: position.top + 20,
        left: position.left,
      }
    }
    this.menuAxis = type
    this.activeCellInfo = cellInfo
    this.showMenu = true

    this.createTableMenu()
  }

  private createTableMenu() {
    if (this.menuComponent) {
      this.menuComponent.destroy()
    }

    this.menuComponent = new VueRenderer(TableActionMenu, {
      editor: this.editor,
      props: {
        editor: this.editor,
        position: this.menuPosition,
        axis: this.menuAxis,
        cellInfo: this.activeCellInfo,
      },
    })

    if (this.menuComponent.element) {
      this.menuComponent.element.addEventListener('vue:close', () => {
        this.hideTableActionMenu()
      })

      const outsideClickHandler = (event: Event) => {
        if (
          this.menuComponent?.element &&
          !this.menuComponent.element.contains(event.target as Node)
        ) {
          this.hideTableActionMenu()
          document.removeEventListener('click', outsideClickHandler, true)
        }
      }

      setTimeout(() => {
        document.addEventListener('click', outsideClickHandler, true)
      }, 100)

      this.editorElement.appendChild(this.menuComponent.element)
    }
  }

  private hideTableActionMenu() {
    this.showMenu = false
    this.activeCellInfo = null
    if (this.menuComponent) {
      this.menuComponent.destroy()
      this.menuComponent = null
    }
  }

  private focusCellForMenu(cellInfo: any) {
    if (!cellInfo || !cellInfo.element) return false

    const targetElement = cellInfo.originalHoveredCell || cellInfo.element
    if (!targetElement) return false

    const view = this.editor.view
    try {
      let pos = view.posAtDOM(targetElement, 0)
      if (pos === null || pos === undefined || pos < 0) {
        const rect = targetElement.getBoundingClientRect()
        const coords = view.posAtCoords({
          left: rect.left + 1,
          top: rect.top + 1,
        })
        if (coords) {
          pos = coords.pos
        }
      }

      if (pos !== null && pos !== undefined && pos >= 0) {
        this.editor.commands.setTextSelection(pos)
        this.editor.commands.focus()
        return true
      } else {
        return false
      }
    } catch (error) {
      this.editor.commands.focus()
      return false
    }
  }

  private hideActionHandleIfNeeded(event: MouseEvent) {
    if (this.showColumnActionDots || this.showRowActionDots) {
      const columnHandleEl = this.editorElement.querySelector(
        '.column-action-handle',
      )
      const rowHandleEl = this.editorElement.querySelector('.row-action-handle')
      if (
        (columnHandleEl && columnHandleEl.contains(event.target as Node)) ||
        (rowHandleEl && rowHandleEl.contains(event.target as Node))
      ) {
        return
      }
    }
    this.hideActionHandle()
  }

  private hideActionHandle() {
    this.showActionHandle = false
    this.showColumnActionDots = false
    this.showRowActionDots = false
    this.hoveredCellInfo = null
    this.columnCellInfo = null
    this.rowCellInfo = null

    const handles = this.editorElement.querySelectorAll(
      '.column-action-handle, .row-action-handle',
    )
    handles.forEach((handle) => handle.remove())
  }

  private getTopmostCellInColumn(table: Element, colIndex: number) {
    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) return null

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      const cells = Array.from(row.children)
      if (cells[colIndex]) {
        return cells[colIndex]
      }
    }
    return null
  }

  private getLeftmostCellInRow(table: Element, rowIndex: number) {
    const rows = table.querySelectorAll('tr')
    if (rowIndex >= rows.length) return null

    const targetRow = rows[rowIndex]
    const cells = Array.from(targetRow.children)
    return cells.find((cell) => cell) || null
  }

  private getCellPosition(cellElement: Element) {
    const table = cellElement.closest('table')
    if (!table)
      return {
        rowIndex: -1,
        colIndex: -1,
        isFirstRow: false,
        isFirstCol: false,
      }

    const row = cellElement.closest('tr')
    const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row!)
    const colIndex = Array.from(row!.children).indexOf(cellElement)

    return {
      rowIndex,
      colIndex,
      isFirstRow: rowIndex === 0,
      isFirstCol: colIndex === 0,
      cellElement,
    }
  }

  destroy() {
    this.hideActionHandle()
    this.hideTableActionMenu()
  }
}
