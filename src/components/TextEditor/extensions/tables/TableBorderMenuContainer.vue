<template>
  <Teleport to="body">
    <TableBorderMenu
      v-if="showTableBorderMenu"
      :show="showTableBorderMenu"
      :axis="(tableBorderAxis === 'cell' ? null : tableBorderAxis) || null"
      :position="tableBorderMenuPos"
      :cell-info="tableCellInfo ? { ...tableCellInfo, isIndividualCell: tableCellInfo.isIndividualCell ?? false } : null"
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
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { Teleport } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import TableBorderMenu from './TableBorderMenu.vue'

const editor = inject<{ value: Editor | null }>('editor', { value: null })

const showTableBorderMenu = ref(false)
const tableBorderAxis = ref<'row' | 'column' | 'cell' | null>(null)
const tableBorderMenuPos = ref<{ top: number; left: number }>({ top: 0, left: 0 })
const tableCellInfo = ref<{
  element: HTMLElement | null
  rowIndex: number
  colIndex: number
  isFirstRow: boolean
  isIndividualCell?: boolean
} | null>(null)

const getViewportPosition = (
  editorRelativePos: { top: number; left: number },
  axis: 'row' | 'column' | 'cell' | null,
  cellInfo: { element: HTMLElement | null } | null
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
  
  if (axis === 'column' && cellInfo?.element) {
    const cellRect = cellInfo.element.getBoundingClientRect()
    viewportLeft = cellRect.left + cellRect.width / 2
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
  showTableBorderMenu.value = true
}

const closeMenu = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    !target.closest('.table-border-menu') &&
    !target.closest('.table-row-handle-overlay') &&
    !target.closest('.table-col-handle-overlay') &&
    !target.closest('.table-cell-trigger-overlay')
  ) {
    showTableBorderMenu.value = false
  }
}

const onHideMenu = () => {
  showTableBorderMenu.value = false
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
      editorElement.querySelectorAll('.table-row-handle-overlay, .table-col-handle-overlay, .table-cell-trigger-overlay').forEach(el => el.remove())
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
      editorElement.querySelectorAll('.table-row-handle-overlay, .table-col-handle-overlay, .table-cell-trigger-overlay').forEach(el => el.remove())
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
  editor.value?.chain().focus().setCellAttribute('borderWidth', borderWidthValue).run()
}

const canMergeCells = computed(() => {
  return editor.value?.can().mergeCells() ?? false
})

onMounted(() => {
  window.addEventListener('table-border-click', onBorderClick)
  window.addEventListener('table-hide-menu', onHideMenu)
  document.addEventListener('click', closeMenu)
  if (editor.value?.view?.dom?.parentElement) {
    editor.value.view.dom.parentElement.addEventListener('table-hide-menu', onHideMenu)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('table-border-click', onBorderClick)
  window.removeEventListener('table-hide-menu', onHideMenu)
  document.removeEventListener('click', closeMenu)
  if (editor.value?.view?.dom?.parentElement) {
    editor.value.view.dom.parentElement.removeEventListener('table-hide-menu', onHideMenu)
  }
})
</script>

