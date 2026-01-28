<template>
  <Teleport to="body">
    <TableBorderMenu
      v-if="showTableBorderMenu"
      :show="showTableBorderMenu"
      :axis="(tableBorderAxis === 'cell' ? null : tableBorderAxis) || null"
      :position="tableBorderMenuPos"
      :cell-info="
        tableCellInfo
          ? {
              ...tableCellInfo,
              isIndividualCell: tableCellInfo.isIndividualCell ?? false,
              isMultiCellSelection: tableCellInfo.isMultiCellSelection ?? false,
            }
          : null
      "
      :can-merge-cells="canMergeCells"
      @add-row-before="addRowBefore"
      @add-row-after="addRowAfter"
      @delete-row="deleteRow"
      @add-column-before="addColumnBefore"
      @add-column-after="addColumnAfter"
      @delete-column="deleteColumn"
      @merge-cells="mergeCells"
      @toggle-header="toggleHeader"
      @set-background-color="setBackgroundColor"
      @set-border-color="setBorderColor"
      @set-border-width="setBorderWidth"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Teleport } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { CellSelection } from '@tiptap/pm/tables'
import TableBorderMenu from './TableBorderMenu.vue'

const editor = inject<{ value: Editor | null }>('editor', { value: null })

const showTableBorderMenu = ref(false)
const tableBorderAxis = ref<'row' | 'column' | 'cell' | null>(null)
const tableBorderMenuPos = ref<{ top: number; left: number }>({
  top: 0,
  left: 0,
})
const tableCellInfo = ref<{
  element: HTMLElement | null
  rowIndex: number
  colIndex: number
  isFirstRow: boolean
  isIndividualCell?: boolean
  isMultiCellSelection?: boolean
} | null>(null)
const isMultiCellMenuOpen = ref(false)
let menuJustOpened = false

const getViewportPosition = (
  editorRelativePos: { top: number; left: number },
  axis: 'row' | 'column' | 'cell' | null,
  cellInfo: {
    element: HTMLElement | null
    isMultiCellSelection?: boolean
    isIndividualCell?: boolean
  } | null,
) => {
  if (!editor.value?.view?.dom?.parentElement) {
    return editorRelativePos
  }

  const editorElement = editor.value.view.dom.parentElement
  const editorRect = editorElement.getBoundingClientRect()
  const editorScrollTop = editorElement.scrollTop
  const editorScrollLeft = editorElement.scrollLeft
  let viewportTop = editorRect.top + editorRelativePos.top - editorScrollTop
  let viewportLeft = editorRect.left + editorRelativePos.left - editorScrollLeft

  if (cellInfo?.element) {
    const table = cellInfo.element.closest('table')
    if (table) {
      const tableRect = table.getBoundingClientRect()
      const menuHeight = 30
      const gap = 12

      if (axis === 'column') {
        // Position column menu above the table with some space
        const cellRect = cellInfo.element.getBoundingClientRect()
        viewportTop = tableRect.top - menuHeight - gap
        viewportLeft = cellRect.left + cellRect.width / 2
      } else if (axis === 'row') {
        // Position row menu at the center of the row (vertically centered)
        const row = cellInfo.element.closest('tr')
        if (row) {
          const rowRect = row.getBoundingClientRect()
          const menuHeight = 30
          viewportTop = rowRect.top + rowRect.height / 2 - menuHeight / 2
        }
        // Left position is already calculated from rowHandleCenter in the plugin
        // viewportLeft is already set correctly from editorRelativePos
      }
    }
  }

  if (axis === 'cell' && cellInfo?.element) {
    // If coming from a selection-based menu (multi or single cell with isIndividualCell=false),
    // use the position calculated in the plugin (centered above selection/cell).
    if (cellInfo.isMultiCellSelection || cellInfo.isIndividualCell === false) {
      viewportTop = editorRelativePos.top
      viewportLeft = editorRelativePos.left
    } else {
      // For the dot-handler menu on an individual cell, position near the right edge, vertically centered.
      const cellRect = cellInfo.element.getBoundingClientRect()
      viewportLeft = cellRect.right + 8
      viewportTop = cellRect.top + cellRect.height / 2 - 12
    }
  }

  return {
    top: viewportTop,
    left: viewportLeft,
  }
}

const onBorderClick = (e: Event) => {
  const { axis, position, cellInfo } = (e as CustomEvent).detail
  tableBorderAxis.value = axis
  tableCellInfo.value = cellInfo
  tableBorderMenuPos.value = getViewportPosition(position, axis, cellInfo)
  isMultiCellMenuOpen.value = cellInfo?.isMultiCellSelection ?? false
  showTableBorderMenu.value = true
  if (cellInfo?.isMultiCellSelection) {
    menuJustOpened = true
    setTimeout(() => {
      menuJustOpened = false
    }, 300)
  }
}

const closeMenu = (e: MouseEvent) => {
  if (menuJustOpened) {
    return
  }

  const target = e.target as HTMLElement

  if (isMultiCellMenuOpen.value) {
    const selectedCells = target
      .closest('.ProseMirror')
      ?.querySelectorAll('.selectedCell')
    if (selectedCells && selectedCells.length >= 2) {
      return
    }
  }

  if (
    !target.closest('.table-border-menu') &&
    !target.closest('.table-row-handle-overlay') &&
    !target.closest('.table-col-handle-overlay') &&
    !target.closest('.table-cell-trigger-overlay') &&
    !target.closest('.selectedCell')
  ) {
    showTableBorderMenu.value = false
    isMultiCellMenuOpen.value = false
  }
}

const onHideMenu = () => {
  showTableBorderMenu.value = false
  isMultiCellMenuOpen.value = false
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
  if (!editor.value?.can().deleteRow()) return
  editor.value.chain().focus().deleteRow().run()
  showTableBorderMenu.value = false
  // Clear handles after deletion to prevent stale references
  setTimeout(() => {
    const editorElement = editor.value?.view?.dom?.parentElement
    if (editorElement) {
      editorElement
        .querySelectorAll(
          '.table-row-handle-overlay, .table-col-handle-overlay, .table-cell-trigger-overlay',
        )
        .forEach((el) => el.remove())
    }
  }, 0)
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
  if (!editor.value?.can().deleteColumn()) return
  editor.value.chain().focus().deleteColumn().run()
  showTableBorderMenu.value = false
  // Clear handles after deletion to prevent stale references
  setTimeout(() => {
    const editorElement = editor.value?.view?.dom?.parentElement
    if (editorElement) {
      editorElement
        .querySelectorAll(
          '.table-row-handle-overlay, .table-col-handle-overlay, .table-cell-trigger-overlay',
        )
        .forEach((el) => el.remove())
    }
  }, 0)
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
}

const setBorderColor = (color: string | null) => {
  editor.value?.chain().focus().setCellAttribute('borderColor', color).run()
}

const setBorderWidth = (width: number | null) => {
  const borderWidthValue = width ? `${width}px` : null
  editor.value
    ?.chain()
    .focus()
    .setCellAttribute('borderWidth', borderWidthValue)
    .run()
}

const canMergeCells = computed(() => {
  return editor.value?.can().mergeCells() ?? false
})

watch(
  () => editor.value?.state?.selection,
  (selection) => {
    if (isMultiCellMenuOpen.value && selection) {
      const isCellSelection = selection instanceof CellSelection
      if (!isCellSelection) {
        isMultiCellMenuOpen.value = false
        return
      }
      if (selection.$anchorCell && selection.$headCell) {
        const anchorPos = selection.$anchorCell.pos
        const headPos = selection.$headCell.pos
        if (anchorPos === headPos) {
          isMultiCellMenuOpen.value = false
        }
      } else {
        isMultiCellMenuOpen.value = false
      }
    }
  },
  { deep: true },
)

onMounted(() => {
  window.addEventListener('table-border-click', onBorderClick)
  window.addEventListener('table-hide-menu', onHideMenu)
  document.addEventListener('click', closeMenu)
  if (editor.value?.view?.dom?.parentElement) {
    editor.value.view.dom.parentElement.addEventListener(
      'table-hide-menu',
      onHideMenu,
    )
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('table-border-click', onBorderClick)
  window.removeEventListener('table-hide-menu', onHideMenu)
  document.removeEventListener('click', closeMenu)
  if (editor.value?.view?.dom?.parentElement) {
    editor.value.view.dom.parentElement.removeEventListener(
      'table-hide-menu',
      onHideMenu,
    )
  }
})
</script>
