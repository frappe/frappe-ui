import type { Editor } from '@tiptap/core'
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { CellSelection, isInTable, selectionCell } from '@tiptap/pm/tables'
import { PALETTE_NAMES } from '#molecules/editor/extensions/shared/color-palette'

export interface TableCellColorState {
  /** Named background of the anchor cell, or `null` when none / not in a table. */
  activeBackground: Ref<string | null>
  /** Named text color active across the selection, or `null`. */
  activeTextColor: Ref<string | null>
  /** Fill the selected cell(s); `null` clears the fill. */
  setBackground: (name: string | null) => void
  /** Color all text in the selected cell(s); `null` clears it. */
  setTextColor: (name: string | null) => void
}

/**
 * Reactive active-color state + setters for the table cell-color picker. Mirrors
 * `useNamedColorState`'s leak-free subscription pattern (attach in `onMounted`,
 * detach in `onBeforeUnmount`) and guards every read/write against a destroyed
 * editor.
 */
export function useTableCellColorState(editor: Editor): TableCellColorState {
  const activeBackground = ref<string | null>(null)
  const activeTextColor = ref<string | null>(null)

  const readBackground = (): string | null => {
    const { state } = editor
    if (!isInTable(state)) return null
    const { selection } = state
    // The anchor cell's value: for a uniform selection it's the shared color,
    // otherwise just the anchor's — enough to drive the active swatch.
    const $cell =
      selection instanceof CellSelection
        ? selection.$anchorCell
        : selectionCell(state)
    const value = $cell?.nodeAfter?.attrs?.backgroundColor
    return typeof value === 'string' ? value : null
  }

  const readTextColor = (): string | null => {
    for (const name of PALETTE_NAMES) {
      if (editor.isActive('textStyle', { color: name })) return name
    }
    return null
  }

  const sync = () => {
    if (!editor || editor.isDestroyed) return
    activeBackground.value = readBackground()
    activeTextColor.value = readTextColor()
  }

  onMounted(() => {
    sync()
    if (!editor || editor.isDestroyed) return
    editor.on('transaction', sync)
    editor.on('selectionUpdate', sync)
  })

  onBeforeUnmount(() => {
    if (!editor) return
    editor.off('transaction', sync)
    editor.off('selectionUpdate', sync)
  })

  const setBackground = (name: string | null) => {
    if (!editor || editor.isDestroyed) return
    editor.chain().focus().setCellBackground(name).run()
  }

  const setTextColor = (name: string | null) => {
    if (!editor || editor.isDestroyed) return
    editor.chain().focus().setCellTextColor(name).run()
  }

  return { activeBackground, activeTextColor, setBackground, setTextColor }
}
