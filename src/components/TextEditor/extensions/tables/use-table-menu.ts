import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { CellSelection, findTable, TableMap } from '@tiptap/pm/tables'

export interface TableCellInfo {
  element: HTMLElement | null
  rowIndex: number
  colIndex: number
  isFirstRow: boolean
}

export interface TableBorderMenuPosition {
  top: number
  left: number
}

export function useTableMenu(editor: Ref<Editor | null>) {
  const showTableBorderMenu = ref(false)
  const tableBorderAxis = ref<'row' | 'column' | null>(null)
  const tableBorderMenuPos = ref<TableBorderMenuPosition>({ top: 0, left: 0 })
  const tableCellInfo = ref<TableCellInfo | null>(null)
  let menuJustOpened = false
  let isChangingColor = false

  const onBorderClick = (e: Event) => {
    const { axis, position, cellInfo } = (e as CustomEvent).detail

    // If we're currently changing colors, ignore new menu events
    if (isChangingColor) {
      return
    }

    // If menu is already showing for a row or column, don't switch to cell menu
    // This prevents the menu from switching when changing colors from row/column menu
    if (
      showTableBorderMenu.value &&
      (tableBorderAxis.value === 'row' || tableBorderAxis.value === 'column') &&
      axis === 'cell'
    ) {
      return
    }

    // If menu is already showing for a cell and we receive another cell event for the same cell,
    // don't update the position (prevents position jumping when selection changes)
    if (
      showTableBorderMenu.value &&
      tableBorderAxis.value === 'cell' &&
      axis === 'cell' &&
      tableCellInfo.value &&
      cellInfo &&
      tableCellInfo.value.rowIndex === cellInfo.rowIndex &&
      tableCellInfo.value.colIndex === cellInfo.colIndex
    ) {
      return
    }

    tableBorderAxis.value = axis
    tableBorderMenuPos.value = position
    tableCellInfo.value = cellInfo
    showTableBorderMenu.value = true

    // Store current menu axis globally so plugin can check it
    ;(window as any).__currentTableMenuAxis = axis

    // Prevent immediate closing when menu is just opened
    menuJustOpened = true
    setTimeout(() => {
      menuJustOpened = false
    }, 100)
  }

  const closeMenu = (e: MouseEvent) => {
    // Don't close if menu was just opened (prevents immediate closing on row handler click)
    if (menuJustOpened) {
      return
    }

    const target = e.target as HTMLElement
    if (
      !target.closest('.table-border-menu') &&
      !target.closest('.table-row-handle-overlay') &&
      !target.closest('.table-col-handle-overlay') &&
      !target.closest('.table-cell-trigger-overlay')
    ) {
      showTableBorderMenu.value = false
      ;(window as any).__currentTableMenuAxis = null
    }
  }

  const clearCellSelection = () => {
    if (!editor.value) return
    // Use setTimeout to ensure the table operation is complete
    setTimeout(() => {
      const { state } = editor.value!
      const { selection } = state
      // If there's a cell selection, convert it to a text selection
      if (selection instanceof CellSelection && selection.$anchorCell) {
        // Get position inside the anchor cell
        // $anchorCell.pos points to the position before the cell node
        // We add 1 to get inside the cell (after the cell node opening)
        const cellPos = selection.$anchorCell.pos
        const textPos = cellPos + 1
        // Set text selection to clear the cell selection
        editor.value!.chain().setTextSelection(textPos).run()
      }
    }, 0)
  }

  const addRowBefore = () => {
    const rows = getSelectedRowCount(editor)
    for (let i = 0; i < rows; i++)
      editor.value?.chain().focus().addRowBefore().run()

    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const addRowAfter = () => {
    const rows = getSelectedRowCount(editor)
    for (let i = 0; i < rows; i++)
      editor.value?.chain().focus().addRowAfter().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const deleteRow = () => {
    editor.value?.chain().focus().deleteRow().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const addColumnBefore = () => {
    const columns = getSelectedColumnCount(editor)
    for (let i = 0; i < columns; i++)
      editor.value?.chain().focus().addColumnBefore().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const addColumnAfter = () => {
    const columns = getSelectedColumnCount(editor)
    for (let i = 0; i < columns; i++)
      editor.value?.chain().focus().addColumnAfter().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const deleteColumn = () => {
    editor.value?.chain().focus().deleteColumn().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const mergeCells = () => {
    editor.value?.chain().focus().mergeCells().run()
  }

  const toggleHeader = () => {
    editor.value?.chain().focus().toggleHeaderCell().run()
    clearCellSelection()
    showTableBorderMenu.value = false
  }

  const setBackgroundColor = (color: string | null) => {
    // Preserve current menu state when changing colors from row/column menu
    const currentAxis = tableBorderAxis.value
    const currentPos = { ...tableBorderMenuPos.value }
    const currentCellInfo = tableCellInfo.value
      ? { ...tableCellInfo.value }
      : null

    // Set flag to prevent menu switch
    isChangingColor = true
    ;(window as any).__currentTableMenuAxis = currentAxis

    editor.value
      ?.chain()
      .focus()
      .setCellAttribute('backgroundColor', color)
      .run()

    // Restore menu state if it was row or column
    if (currentAxis === 'row' || currentAxis === 'column') {
      // Use a longer delay to ensure all updates complete
      setTimeout(() => {
        tableBorderAxis.value = currentAxis
        tableBorderMenuPos.value = currentPos
        if (currentCellInfo) {
          tableCellInfo.value = currentCellInfo
        }
        showTableBorderMenu.value = true
        ;(window as any).__currentTableMenuAxis = currentAxis
        isChangingColor = false
      }, 300)
    } else {
      isChangingColor = false
    }
  }

  const setBorderColor = (color: string | null) => {
    // Preserve current menu state when changing colors from row/column menu
    const currentAxis = tableBorderAxis.value
    const currentPos = { ...tableBorderMenuPos.value }
    const currentCellInfo = tableCellInfo.value
      ? { ...tableCellInfo.value }
      : null

    // Set flag to prevent menu switch
    isChangingColor = true
    ;(window as any).__currentTableMenuAxis = currentAxis

    editor.value?.chain().focus().setCellAttribute('borderColor', color).run()

    // Restore menu state if it was row or column
    if (currentAxis === 'row' || currentAxis === 'column') {
      // Use a longer delay to ensure all updates complete
      setTimeout(() => {
        tableBorderAxis.value = currentAxis
        tableBorderMenuPos.value = currentPos
        if (currentCellInfo) {
          tableCellInfo.value = currentCellInfo
        }
        showTableBorderMenu.value = true
        ;(window as any).__currentTableMenuAxis = currentAxis
        isChangingColor = false
      }, 300)
    } else {
      isChangingColor = false
    }
  }

  const setBorderWidth = (width: number | null) => {
    // Preserve current menu state when changing border width from row/column menu
    const currentAxis = tableBorderAxis.value
    const currentPos = { ...tableBorderMenuPos.value }
    const currentCellInfo = tableCellInfo.value
      ? { ...tableCellInfo.value }
      : null

    // Set flag to prevent menu switch
    isChangingColor = true
    ;(window as any).__currentTableMenuAxis = currentAxis

    const borderWidthValue = width ? `${width}px` : null
    editor.value
      ?.chain()
      .focus()
      .setCellAttribute('borderWidth', borderWidthValue)
      .run()

    // Restore menu state if it was row or column
    if (currentAxis === 'row' || currentAxis === 'column') {
      // Use a longer delay to ensure all updates complete
      setTimeout(() => {
        tableBorderAxis.value = currentAxis
        tableBorderMenuPos.value = currentPos
        if (currentCellInfo) {
          tableCellInfo.value = currentCellInfo
        }
        showTableBorderMenu.value = true
        ;(window as any).__currentTableMenuAxis = currentAxis
        isChangingColor = false
      }, 300)
    } else {
      isChangingColor = false
    }
  }

  const canMergeCells = computed(() => {
    return editor.value?.can().mergeCells() ?? false
  })

  const handleBorderAttributeChanging = () => {
    borderAttributeChanging = true
  }

  const handleBorderAttributeChanged = () => {
    borderAttributeChanging = false
  }

  onMounted(() => {
    window.addEventListener('table-border-click', onBorderClick)
    document.addEventListener('click', closeMenu)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('table-border-click', onBorderClick)
    document.removeEventListener('click', closeMenu)
  })

  return {
    showTableBorderMenu,
    tableBorderAxis,
    tableBorderMenuPos,
    tableCellInfo,
    canMergeCells,
    addRowBefore,
    addRowAfter,
    deleteRow,
    addColumnBefore,
    addColumnAfter,
    deleteColumn,
    mergeCells,
    toggleHeader,
    setBackgroundColor,
    setBorderColor,
    setBorderWidth,
  }
}

const getSelectedRowCount = (editor: Ref<Editor | null>) => {
  if (!editor.value) return 0

  const { state } = editor.value
  const { selection } = state

  if (selection instanceof CellSelection) {
    const { $anchorCell, $headCell } = selection

    // Get the table
    const table = findTable($anchorCell)
    if (!table) return 0

    const map = TableMap.get(table.node)
    const anchorRect = map.findCell($anchorCell.pos - table.start)
    const headRect = map.findCell($headCell.pos - table.start)

    // Calculate row span
    const minRow = Math.min(anchorRect.top, headRect.top)
    const maxRow = Math.max(anchorRect.bottom - 1, headRect.bottom - 1)

    return maxRow - minRow + 1
  }

  return 1 // Single cell/row selected
}
const getSelectedColumnCount = (editor) => {
  if (!editor.value) return 0

  const { state } = editor.value
  const { selection } = state

  if (selection instanceof CellSelection) {
    const { $anchorCell, $headCell } = selection

    // Get the table
    const table = findTable($anchorCell)
    if (!table) return 0

    const map = TableMap.get(table.node)
    const anchorRect = map.findCell($anchorCell.pos - table.start)
    const headRect = map.findCell($headCell.pos - table.start)

    // Calculate column span
    const minCol = Math.min(anchorRect.left, headRect.left)
    const maxCol = Math.max(anchorRect.right - 1, headRect.right - 1)

    return maxCol - minCol + 1
  }

  return 1 // Single cell/column selected
}
