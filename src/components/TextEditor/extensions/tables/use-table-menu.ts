import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

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

  const onBorderClick = (e: Event) => {
    const { axis, position, cellInfo } = (e as CustomEvent).detail
    tableBorderAxis.value = axis
    tableBorderMenuPos.value = position
    tableCellInfo.value = cellInfo
    showTableBorderMenu.value = true
  }

  const closeMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      !target.closest('.table-border-menu') &&
      !target.closest('.table-row-handle-overlay') &&
      !target.closest('.table-col-handle-overlay')
    ) {
      showTableBorderMenu.value = false
    }
  }

  const addRowBefore = () => {
    editor.value?.chain().focus().addRowBefore().run()
    showTableBorderMenu.value = false
  }

  const addRowAfter = () => {
    editor.value?.chain().focus().addRowAfter().run()
    showTableBorderMenu.value = false
  }

  const deleteRow = () => {
    editor.value?.chain().focus().deleteRow().run()
    showTableBorderMenu.value = false
  }

  const addColumnBefore = () => {
    editor.value?.chain().focus().addColumnBefore().run()
    showTableBorderMenu.value = false
  }

  const addColumnAfter = () => {
    editor.value?.chain().focus().addColumnAfter().run()
    showTableBorderMenu.value = false
  }

  const deleteColumn = () => {
    editor.value?.chain().focus().deleteColumn().run()
    showTableBorderMenu.value = false
  }

  const mergeCells = () => {
    editor.value?.chain().focus().mergeCells().run()
    showTableBorderMenu.value = false
  }

  const toggleHeader = () => {
    editor.value?.chain().focus().toggleHeaderCell().run()
    showTableBorderMenu.value = false
  }

  const setBackgroundColor = (color: string | null) => {
    editor.value?.chain().focus().setCellAttribute('backgroundColor', color).run()
    showTableBorderMenu.value = false
  }

  const setBorderColor = (color: string | null) => {
    editor.value?.chain().focus().setCellAttribute('borderColor', color).run()
    showTableBorderMenu.value = false
  }

  const canMergeCells = computed(() => {
    return editor.value?.can().mergeCells() ?? false
  })

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
  }
}
