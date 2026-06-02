/**
 * First-class named colors for table cells, mirroring the inline named-color /
 * highlight extensions:
 *
 *  - **Cell background** — a `backgroundColor` attribute on the cell nodes
 *    (added in `extensions.ts` via `cellBackgroundAttributes`), storing a
 *    palette name and rendering as `background-color: var(--prose-highlight-NAME)`
 *    (the same tints the highlight mark uses, so cell fills track light/dark).
 *  - **Cell text color** — the `textStyle` mark applied across the whole content
 *    of the selected cell(s), so a bare cursor colors the entire cell rather
 *    than only newly-typed text.
 *
 * Setting the background uses the Table extension's built-in `setCellAttribute`
 * (which already targets either the cursor's cell or every cell in a
 * `CellSelection`); the text-color command reproduces that targeting for marks.
 */
import { Extension } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import { CellSelection, isInTable, selectionCell } from '@tiptap/pm/tables'
import { PALETTE_NAMES } from '../shared/color-palette'
import {
  extractHighlightColorFromStyle,
  highlightColorStyle,
} from '../shared/color-style'

/**
 * The `backgroundColor` attribute spec, spread into both `TableCell` and
 * `TableHeader` (see `extensions.ts`). Kept as a plain object — not a node of
 * its own — so the command extension below can declare the commands exactly
 * once (two nodes declaring the same command would collide).
 */
export const cellBackgroundAttributes = {
  backgroundColor: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => {
      const style = element.getAttribute('style')
      if (!style) return null
      // Normalize a pasted inline `background-color` back to a palette name.
      return extractHighlightColorFromStyle(style, PALETTE_NAMES)
    },
    renderHTML: (attributes: Record<string, unknown>) => {
      const name = attributes.backgroundColor
      if (typeof name !== 'string' || !PALETTE_NAMES.includes(name)) return {}
      return { style: highlightColorStyle(name) }
    },
  },
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellColor: {
      /** Fill the selected cell(s) with a named background; `null` clears it. */
      setCellBackground: (colorName: string | null) => ReturnType
      /** Color all text in the selected cell(s) by name; `null` clears it. */
      setCellTextColor: (colorName: string | null) => ReturnType
    }
  }
}

export const TableCellColor = Extension.create({
  name: 'tableCellColor',

  addCommands() {
    return {
      setCellBackground:
        (colorName) =>
        ({ chain }) => {
          if (colorName !== null && !PALETTE_NAMES.includes(colorName)) {
            return false
          }
          return chain().setCellAttribute('backgroundColor', colorName).run()
        },

      setCellTextColor:
        (colorName) =>
        ({ state, tr, dispatch }) => {
          if (colorName !== null && !PALETTE_NAMES.includes(colorName)) {
            return false
          }
          if (!isInTable(state)) return false
          const markType = state.schema.marks.textStyle
          if (!markType) return false

          // Collect the content range of every targeted cell: each cell in a
          // CellSelection, else just the cell holding the cursor.
          const ranges: Array<{ from: number; to: number }> = []
          const addCell = (cell: PMNode | null, pos: number) => {
            if (!cell) return
            ranges.push({ from: pos + 1, to: pos + cell.nodeSize - 1 })
          }
          const { selection } = state
          if (selection instanceof CellSelection) {
            selection.forEachCell((cell, pos) => addCell(cell, pos))
          } else {
            const $cell = selectionCell(state)
            if ($cell) addCell($cell.nodeAfter, $cell.pos)
          }
          if (!ranges.length) return false

          for (const { from, to } of ranges) {
            // textStyle only carries `color` in this editor, so replacing the
            // whole mark in-range is equivalent to setting the color.
            tr.removeMark(from, to, markType)
            if (colorName) tr.addMark(from, to, markType.create({ color: colorName }))
          }
          if (dispatch) dispatch(tr.scrollIntoView())
          return true
        },
    }
  },
})

export { TableCellColor as default }
