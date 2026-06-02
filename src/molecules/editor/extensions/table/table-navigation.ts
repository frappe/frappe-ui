/**
 * Spreadsheet-style cell navigation for tables.
 *
 * Two modes, distinguished purely by the selection type (no extra state):
 *  - **Navigate** — the selection is a single-cell `CellSelection`. The cell is
 *    highlighted (prosemirror-tables draws `.selectedCell`; styled in style.css),
 *    there's no caret, and arrow keys move between cells.
 *  - **Edit** — a normal `TextSelection` inside the cell. Arrows move the caret
 *    as usual; Escape returns to navigate.
 *
 * Flow: click a cell → navigate (highlight). Enter (or a second click, or
 * typing) → edit. Escape → navigate. Arrow keys in navigate mode → move the
 * active cell.
 *
 * Runs at a high priority so its `handleKeyDown` precedes the Table extension's
 * built-in arrow handling (which would otherwise collapse a CellSelection to a
 * caret on arrow press).
 */
import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { TextSelection } from '@tiptap/pm/state'
import type { ResolvedPos } from '@tiptap/pm/model'
import {
  CellSelection,
  cellAround,
  isInTable,
  nextCell,
  selectionCell,
} from '@tiptap/pm/tables'

type Axis = 'horiz' | 'vert'

/** Select a whole cell (navigate mode), highlighting it. */
function selectCell(editor: Editor, pos: number): boolean {
  const { state, view } = editor
  view.dispatch(
    state.tr
      .setSelection(CellSelection.create(state.doc, pos))
      .scrollIntoView(),
  )
  return true
}

/** Drop the caret into a cell (edit mode), at the end of its content. */
function editCell(editor: Editor, $cell: ResolvedPos, at?: number): boolean {
  const { state, view } = editor
  const cell = $cell.nodeAfter
  if (!cell) return false
  const pos = at ?? $cell.pos + cell.nodeSize - 1
  const selection = TextSelection.near(state.doc.resolve(pos), -1)
  view.dispatch(state.tr.setSelection(selection).scrollIntoView())
  return true
}

/** Move the active cell one step along an axis; no-op (but consumed) at an edge. */
function moveCell(editor: Editor, axis: Axis, dir: number): boolean {
  const { state } = editor
  const $next = nextCell(selectionCell(state), axis, dir)
  if ($next) selectCell(editor, $next.pos)
  return true
}

/** A single-cell CellSelection sitting on exactly the given cell. */
function isOnCell(selection: unknown, $cell: ResolvedPos): boolean {
  return (
    selection instanceof CellSelection &&
    selection.$anchorCell.pos === $cell.pos &&
    selection.$headCell.pos === $cell.pos
  )
}

export const TableNavigation = Extension.create({
  name: 'tableNavigation',
  // Beat the Table extension's own arrow/keymap handling.
  priority: 200,

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        props: {
          handleKeyDown(view, event) {
            const { state } = view
            if (!isInTable(state)) return false
            const navigating = state.selection instanceof CellSelection

            switch (event.key) {
              case 'ArrowRight':
                return navigating ? moveCell(editor, 'horiz', 1) : false
              case 'ArrowLeft':
                return navigating ? moveCell(editor, 'horiz', -1) : false
              case 'ArrowDown':
                return navigating ? moveCell(editor, 'vert', 1) : false
              case 'ArrowUp':
                return navigating ? moveCell(editor, 'vert', -1) : false
              case 'Enter':
                if (navigating) {
                  return editCell(
                    editor,
                    (state.selection as CellSelection).$headCell,
                  )
                }
                return false
              case 'Escape':
                if (!navigating)
                  return selectCell(editor, selectionCell(state).pos)
                return false
              default:
                return false
            }
          },

          handleClick(view, pos) {
            const $cell = cellAround(view.state.doc.resolve(pos))
            if (!$cell) return false
            // Second click on the already-selected cell starts editing at the
            // click point; first click selects the cell (navigate).
            if (isOnCell(view.state.selection, $cell)) {
              return editCell(editor, $cell, pos)
            }
            return selectCell(editor, $cell.pos)
          },

          // Typing while a cell is selected starts editing (append) instead of
          // letting a CellSelection swallow the input.
          handleTextInput(view, _from, _to, text) {
            const { selection } = view.state
            if (!(selection instanceof CellSelection)) return false
            const $cell = selection.$headCell
            const cell = $cell.nodeAfter
            if (!cell) return false
            const end = $cell.pos + cell.nodeSize - 1
            view.dispatch(
              view.state.tr
                .setSelection(
                  TextSelection.near(view.state.doc.resolve(end), -1),
                )
                .insertText(text)
                .scrollIntoView(),
            )
            return true
          },
        },
      }),
    ]
  },
})
