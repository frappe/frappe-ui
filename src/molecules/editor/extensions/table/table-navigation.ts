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
 * typing) → edit. Edit mode is sticky: clicks inside the cell only move the
 * caret; it exits only via Enter, Escape (→ navigate) or Tab (→ next cell).
 * Arrow keys in navigate mode → move the active cell; at the top/bottom edge
 * they leave the table (so keyboard users are never trapped inside it).
 *
 * Runs at a high priority so its `handleKeyDown` precedes the Table extension's
 * built-in arrow handling (which would otherwise collapse a CellSelection to a
 * caret on arrow press).
 */
import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { Plugin, Selection, TextSelection } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { ResolvedPos } from '@tiptap/pm/model'
import {
  CellSelection,
  TableMap,
  cellAround,
  columnResizingPluginKey,
  goToNextCell,
  isInTable,
  nextCell,
  selectionCell,
} from '@tiptap/pm/tables'
import { trackPointerDrag } from './drag-scroll'

type Axis = 'horiz' | 'vert'

const ARROWS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'] as const

const LONG_PRESS_MS = 500
const LONG_PRESS_SLOP = 8

/**
 * In edit mode, true when a plain arrow press would move the caret out of the
 * current cell (so we can swallow it — the cell is a sandbox; leave via Escape or
 * Tab). Caret movement that stays inside the cell is left to the default.
 */
function arrowLeavesCell(view: EditorView, event: KeyboardEvent): boolean {
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
    return false
  }
  const { state } = view
  if (!state.selection.empty) return false
  const $head = state.selection.$head
  const $cell = cellAround($head)
  if (!$cell) return false
  const cell = $cell.nodeAfter
  if (!cell) return false
  // First / last caret positions inside the cell, and their textblocks.
  const firstPos = Selection.near(state.doc.resolve($cell.pos + 1), 1).from
  const lastPos = Selection.near(
    state.doc.resolve($cell.pos + cell.nodeSize - 1),
    -1,
  ).from
  switch (event.key) {
    case 'ArrowLeft':
      return $head.pos <= firstPos
    case 'ArrowRight':
      return $head.pos >= lastPos
    case 'ArrowUp':
      // At the top line of the cell's first block.
      return (
        view.endOfTextblock('up') &&
        $head.start() === state.doc.resolve(firstPos).start()
      )
    case 'ArrowDown':
      // At the bottom line of the cell's last block.
      return (
        view.endOfTextblock('down') &&
        $head.start() === state.doc.resolve(lastPos).start()
      )
    default:
      return false
  }
}

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

/** The table node enclosing a cell position, with its map and start offset. */
function tableAround($cell: ResolvedPos) {
  const table = $cell.node(-1)
  return { table, start: $cell.start(-1), map: TableMap.get(table) }
}

/**
 * Leave the table vertically: put the caret in the nearest textblock before/
 * after it, creating an adjacent paragraph when the table is the document's
 * first/last node — so navigate mode is never a keyboard trap.
 */
function exitTable(editor: Editor, dir: 1 | -1): boolean {
  const { state, view } = editor
  const $cell = selectionCell(state)
  let depth = $cell.depth
  while (depth > 0 && $cell.node(depth).type.name !== 'table') depth--
  if (!depth) return true
  const pos = dir === 1 ? $cell.after(depth) : $cell.before(depth)
  const target = Selection.findFrom(state.doc.resolve(pos), dir, true)
  if (target) {
    view.dispatch(state.tr.setSelection(target).scrollIntoView())
    return true
  }
  const paragraph = state.schema.nodes.paragraph
  if (!paragraph) return true
  const tr = state.tr.insert(pos, paragraph.create())
  tr.setSelection(TextSelection.create(tr.doc, pos + 1)).scrollIntoView()
  view.dispatch(tr)
  return true
}

/**
 * Move the active cell one step along an axis. A horizontal edge is a consumed
 * no-op; a vertical edge exits the table.
 */
function moveCell(editor: Editor, axis: Axis, dir: number): boolean {
  const { state } = editor
  const $next = nextCell(selectionCell(state), axis, dir)
  if ($next) return selectCell(editor, $next.pos)
  if (axis === 'vert') return exitTable(editor, dir as 1 | -1)
  return true
}

/**
 * Grow/shrink the cell selection one step along an axis (spreadsheet-style
 * Shift-Arrow): keep the anchor cell fixed, move only the head cell. The
 * selection is always rectangular, so moving the head fills in the block.
 * No-op (but consumed) at an edge.
 */
function extendCell(editor: Editor, axis: Axis, dir: number): boolean {
  const { state, view } = editor
  const sel = state.selection
  if (!(sel instanceof CellSelection)) return false
  const $next = nextCell(sel.$headCell, axis, dir)
  if ($next) {
    view.dispatch(
      state.tr
        .setSelection(new CellSelection(sel.$anchorCell, $next))
        .scrollIntoView(),
    )
  }
  return true
}

/**
 * Tab / Shift-Tab: move to the next/previous cell and land in navigate mode
 * (highlight, no caret), exiting edit mode. Wraps across rows via the table's
 * own `goToNextCell`; Tab on the very last cell appends a row first
 * (spreadsheet convention, and what the stock TipTap Tab shortcut did before
 * this plugin intercepted it).
 */
function tabToCell(editor: Editor, dir: 1 | -1): boolean {
  const { state, view } = editor
  if (!isInTable(state)) return false
  if (!goToNextCell(dir)(state, view.dispatch)) {
    if (dir !== 1) return true
    if (!editor.can().addRowAfter()) return true
    editor.chain().addRowAfter().run()
    if (!goToNextCell(dir)(editor.state, view.dispatch)) return true
  }
  const $cell = cellAround(editor.state.selection.$head)
  if ($cell) selectCell(editor, $cell.pos)
  return true
}

/** Select every cell of the table containing `$cell`. */
function selectWholeTable(editor: Editor, $cell: ResolvedPos): boolean {
  const { state, view } = editor
  const { start, map } = tableAround($cell)
  view.dispatch(
    state.tr.setSelection(
      new CellSelection(
        state.doc.resolve(start + map.map[0]),
        state.doc.resolve(start + map.map[map.map.length - 1]),
      ),
    ),
  )
  return true
}

/**
 * Mod+A inside a table escalates instead of jumping straight to the document:
 * cell content → whole table → (default select-all) whole doc. Keeps the
 * cell-as-sandbox model consistent for selection too.
 */
function escalateSelectAll(editor: Editor): boolean {
  const { state, view } = editor
  const sel = state.selection
  if (sel instanceof CellSelection) {
    const { start, map } = tableAround(sel.$anchorCell)
    const rect = map.rectBetween(
      sel.$anchorCell.pos - start,
      sel.$headCell.pos - start,
    )
    const wholeTable =
      rect.left === 0 &&
      rect.top === 0 &&
      rect.right === map.width &&
      rect.bottom === map.height
    if (wholeTable) return false
    return selectWholeTable(editor, sel.$anchorCell)
  }
  const $cell = cellAround(sel.$head)
  if (!$cell) return false
  const cell = $cell.nodeAfter
  if (!cell) return false
  const from = Selection.near(state.doc.resolve($cell.pos + 1), 1).from
  const to = Selection.near(
    state.doc.resolve($cell.pos + cell.nodeSize - 1),
    -1,
  ).from
  if (sel.from === from && sel.to === to) {
    return selectWholeTable(editor, $cell)
  }
  view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)))
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

/** The cell (if any) under a pointer event. */
function cellAtCoords(
  view: EditorView,
  event: { clientX: number; clientY: number },
): ResolvedPos | null {
  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (!coords) return null
  return cellAround(view.state.doc.resolve(coords.pos))
}

/**
 * Touch: leave taps to the default (caret + keyboard — navigate mode has
 * little value without physical arrow keys), but surface the table context
 * menu on long-press, since iOS never fires `contextmenu` on its own. Android
 * does — the capture listener below cancels the timer so it can't double-open.
 */
function watchLongPress(event: PointerEvent): boolean {
  const { clientX, clientY, pointerId } = event
  const target = event.target
  if (!(target instanceof Element)) return false

  const cleanup = () => {
    clearTimeout(timer)
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onEnd)
    document.removeEventListener('pointercancel', onEnd)
    document.removeEventListener('contextmenu', onNativeMenu, true)
  }
  const timer = window.setTimeout(() => {
    cleanup()
    target.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      }),
    )
  }, LONG_PRESS_MS)
  const onMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    if (
      Math.hypot(e.clientX - clientX, e.clientY - clientY) > LONG_PRESS_SLOP
    ) {
      cleanup()
    }
  }
  const onEnd = (e: PointerEvent) => {
    if (e.pointerId === pointerId) cleanup()
  }
  const onNativeMenu = () => cleanup()
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onEnd)
  document.addEventListener('pointercancel', onEnd)
  document.addEventListener('contextmenu', onNativeMenu, true)
  return false
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
            // Read-only: leave caret/selection to the default. No cell nav.
            if (!editor.isEditable) return false
            const { state } = view
            if (!isInTable(state)) return false
            const navigating = state.selection instanceof CellSelection

            // Mod+A escalates: cell content → whole table → whole doc.
            if (
              (event.metaKey || event.ctrlKey) &&
              !event.altKey &&
              !event.shiftKey &&
              event.key.toLowerCase() === 'a'
            ) {
              return escalateSelectAll(editor)
            }

            // Tab moves to the next/previous cell in navigate mode, exiting edit
            // mode (works from either mode). Consume it in a table either way so
            // focus never leaves the cell grid.
            if (event.key === 'Tab') {
              if (event.metaKey || event.ctrlKey || event.altKey) return false
              tabToCell(editor, event.shiftKey ? -1 : 1)
              return true
            }

            // Shift+Arrow grows the cell selection (spreadsheet-style), anchor
            // fixed. Only once a CellSelection exists (navigate mode); in edit
            // mode let the default extend the text selection within the cell.
            if (
              event.shiftKey &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.altKey &&
              (ARROWS as readonly string[]).includes(event.key)
            ) {
              if (!navigating) return false
              switch (event.key) {
                case 'ArrowRight':
                  return extendCell(editor, 'horiz', 1)
                case 'ArrowLeft':
                  return extendCell(editor, 'horiz', -1)
                case 'ArrowDown':
                  return extendCell(editor, 'vert', 1)
                case 'ArrowUp':
                  return extendCell(editor, 'vert', -1)
              }
            }

            // In edit mode, keep arrows inside the cell (no escaping to the next
            // cell or out of the table); leave the cell via Escape or Tab.
            if (
              !navigating &&
              (ARROWS as readonly string[]).includes(event.key)
            ) {
              return arrowLeavesCell(view, event)
            }

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
                    (state.selection as CellSelection).$anchorCell,
                  )
                }
                // Plain Enter in edit mode returns to navigate mode
                // (spreadsheet-style); Shift+Enter still inserts a line break.
                if (
                  !event.shiftKey &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.altKey
                ) {
                  return selectCell(editor, selectionCell(state).pos)
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

          handleDOMEvents: {
            // Select the cell on pointerdown — before the browser places a text
            // caret — so a click lands straight in navigate mode with no caret
            // flash. A second click on the already-active cell falls through to
            // the default (caret) to start editing.
            pointerdown(view, event: PointerEvent) {
              // Read-only: don't hijack clicks into cell selection.
              if (!editor.isEditable) return false

              // Touch: taps keep the default caret behavior (and scrolling);
              // a long-press opens the table context menu.
              if (event.pointerType === 'touch') {
                if (!cellAtCoords(view, event)) return false
                return watchLongPress(event)
              }

              // Pointer is over a column-resize border (the resize plugin set its
              // active handle on the preceding mousemove). Bail so its own,
              // lower-priority mousedown can start the drag instead of us
              // swallowing it as a cell selection.
              const resizeState = columnResizingPluginKey.getState(view.state)
              if (resizeState && resizeState.activeHandle > -1) return false
              if (
                event.button !== 0 ||
                event.shiftKey ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey
              ) {
                return false
              }
              const $cell = cellAtCoords(view, event)
              if (!$cell) return false
              // Clicking the active cell again → let the default place the caret.
              if (isOnCell(view.state.selection, $cell)) return false
              // Already editing this cell → let the default move the caret;
              // clicks never exit edit mode (only Enter / Escape / Tab do).
              const $editing = cellAround(view.state.selection.$head)
              if (
                !(view.state.selection instanceof CellSelection) &&
                $editing &&
                $editing.pos === $cell.pos
              ) {
                return false
              }

              event.preventDefault()
              const anchorPos = $cell.pos
              view.dispatch(
                view.state.tr.setSelection(
                  CellSelection.create(view.state.doc, anchorPos),
                ),
              )
              if (!view.hasFocus()) view.focus()

              // Drag to extend into a multi-cell selection (e.g. for merge),
              // with edge auto-scroll so wide tables can be selected past the
              // wrapper's visible window.
              const anchorDom = view.nodeDOM(anchorPos)
              const wrapper =
                anchorDom instanceof HTMLElement
                  ? anchorDom.closest<HTMLElement>('.tableWrapper')
                  : null
              trackPointerDrag({
                event,
                area: wrapper,
                onPoint(x, y) {
                  const $head = cellAtCoords(view, { clientX: x, clientY: y })
                  if (!$head) return
                  // Never extend across table boundaries.
                  const $anchor = view.state.doc.resolve(anchorPos)
                  if ($head.start(-1) !== $anchor.start(-1)) return
                  const next = CellSelection.create(
                    view.state.doc,
                    anchorPos,
                    $head.pos,
                  )
                  if (!view.state.selection.eq(next)) {
                    view.dispatch(view.state.tr.setSelection(next))
                  }
                },
              })
              return true
            },

            // IME input never reaches handleTextInput, so drop into edit mode
            // before the composition starts — composing against a CellSelection
            // (which has no DOM caret) drops or mangles the input.
            compositionstart(view) {
              if (!editor.isEditable) return false
              const { selection } = view.state
              if (!(selection instanceof CellSelection)) return false
              editCell(editor, selection.$anchorCell)
              return false
            },
          },

          // Typing while a cell is selected starts editing (append) instead of
          // letting a CellSelection swallow the input. Input lands in the
          // anchor cell — the active cell of a multi-cell selection.
          handleTextInput(view, _from, _to, text) {
            if (!editor.isEditable) return false
            const { selection } = view.state
            if (!(selection instanceof CellSelection)) return false
            const $cell = selection.$anchorCell
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

          // Match type-to-append: pasting non-table content on a selected cell
          // drops the caret at the end of the anchor cell and pastes there,
          // instead of replacing the cell's content. Table-shaped slices keep
          // prosemirror-tables' structured cell paste.
          handlePaste(view, _event, slice) {
            if (!editor.isEditable) return false
            const { selection } = view.state
            if (!(selection instanceof CellSelection)) return false
            let tableContent = false
            slice.content.forEach((node) => {
              if (node.type.spec.tableRole) tableContent = true
            })
            if (tableContent) return false
            editCell(editor, selection.$anchorCell)
            return false
          },
        },
      }),
    ]
  },
})
