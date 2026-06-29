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
import type { EditorState } from '@tiptap/pm/state'
import type { MarkType, Node as PMNode } from '@tiptap/pm/model'
import { CellSelection, isInTable, selectionCell } from '@tiptap/pm/tables'
import { PALETTE_NAMES } from '../shared/color-palette'

/** Block node types that carry the `textAlign` attribute. */
const ALIGNABLE_NODES = new Set(['paragraph', 'heading'])

/**
 * Content ranges (text positions) of every cell in the active selection: each
 * cell of a `CellSelection`, else just the cell holding the cursor. Shared by
 * all cell-aware commands so they fan out identically.
 */
function cellContentRanges(
  state: EditorState,
): Array<{ from: number; to: number }> {
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
  return ranges
}

/** True when every text node in `[from, to)` already carries `markType`. */
function isRangeFullyMarked(
  state: EditorState,
  from: number,
  to: number,
  markType: MarkType,
): boolean {
  let hasText = false
  let allMarked = true
  state.doc.nodesBetween(from, to, (node) => {
    if (!node.isText) return
    hasText = true
    if (!markType.isInSet(node.marks)) allMarked = false
  })
  return hasText && allMarked
}
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
      /** Set `textAlign` on every alignable block in the selected cell(s). */
      setCellTextAlign: (alignment: string) => ReturnType
      /** Toggle the `bold` mark across every selected cell's content. */
      toggleCellBold: () => ReturnType
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

          const ranges = cellContentRanges(state)
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

      setCellTextAlign:
        (alignment) =>
        ({ state, tr, dispatch }) => {
          if (!isInTable(state)) return false
          const ranges = cellContentRanges(state)
          if (!ranges.length) return false

          for (const { from, to } of ranges) {
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (!ALIGNABLE_NODES.has(node.type.name)) return
              tr.setNodeAttribute(pos, 'textAlign', alignment)
            })
          }
          if (dispatch) dispatch(tr.scrollIntoView())
          return true
        },

      toggleCellBold:
        () =>
        ({ state, tr, dispatch }) => {
          if (!isInTable(state)) return false
          const markType = state.schema.marks.bold
          if (!markType) return false
          const ranges = cellContentRanges(state)
          if (!ranges.length) return false

          // Toggle semantics: if every non-empty cell range is already fully
          // bold, clear bold everywhere; otherwise bold every cell.
          const allBold = ranges.every(({ from, to }) =>
            from >= to ? true : isRangeFullyMarked(state, from, to, markType),
          )
          for (const { from, to } of ranges) {
            if (from >= to) continue
            if (allBold) tr.removeMark(from, to, markType)
            else tr.addMark(from, to, markType.create())
          }
          if (dispatch) dispatch(tr.scrollIntoView())
          return true
        },
    }
  },
})

export { TableCellColor as default }
