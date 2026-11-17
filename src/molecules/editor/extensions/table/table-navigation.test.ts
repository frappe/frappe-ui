/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import { Editor } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { TableNavigation } from './table-navigation'
import { TableAddColumnAfter, TableAddColumnBefore } from '../../menu'

const openEditors: Editor[] = []

afterEach(() => {
  while (openEditors.length) openEditors.pop()?.destroy()
  document.documentElement.dir = ''
})

function tableEditor() {
  const editor = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Table,
      TableRow,
      TableCell,
      TableHeader,
      TableNavigation,
    ],
    content:
      '<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr></tbody></table>',
  })
  openEditors.push(editor)
  return editor
}

/** Positions of each cell in the first row, in document order. */
function cellPositions(editor: Editor): number[] {
  const positions: number[] = []
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'tableCell') positions.push(pos)
  })
  return positions
}

function selectCell(editor: Editor, pos: number) {
  const { state } = editor
  editor.view.dispatch(
    state.tr.setSelection(CellSelection.create(state.doc, pos)),
  )
}

function press(editor: Editor, key: string) {
  const event = new KeyboardEvent('keydown', { key })
  editor.view.someProp('handleKeyDown', (handle) => handle(editor.view, event))
}

function activeCell(editor: Editor): number {
  return (editor.state.selection as CellSelection).$anchorCell.pos
}

/** The text of each cell in the first row, in document order. */
function rowText(editor: Editor): string[] {
  const texts: string[] = []
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'tableCell') texts.push(node.textContent)
  })
  return texts
}

describe('table cell navigation', () => {
  it('ArrowRight moves to the next cell on an LTR page', () => {
    const editor = tableEditor()
    const [first, second] = cellPositions(editor)
    selectCell(editor, first)

    press(editor, 'ArrowRight')
    expect(activeCell(editor)).toBe(second)
  })

  it('ArrowLeft moves to the next cell on an RTL page', () => {
    document.documentElement.dir = 'rtl'
    const editor = tableEditor()
    const [first, second] = cellPositions(editor)
    selectCell(editor, first)

    press(editor, 'ArrowLeft')
    expect(activeCell(editor)).toBe(second)
    press(editor, 'ArrowRight')
    expect(activeCell(editor)).toBe(first)
  })
})

describe('insert column left and right', () => {
  function insertBeside(column: typeof TableAddColumnBefore) {
    const editor = tableEditor()
    selectCell(editor, cellPositions(editor)[0])
    column.action(editor)
    return rowText(editor)
  }

  it('inserts on the named side on an LTR page', () => {
    expect(insertBeside(TableAddColumnBefore)).toEqual(['', 'a', 'b'])
    expect(insertBeside(TableAddColumnAfter)).toEqual(['a', '', 'b'])
  })

  it('inserts on the named side on an RTL page, where the row runs right to left', () => {
    document.documentElement.dir = 'rtl'
    // "Left" of the first cell is the second column in an RTL table.
    expect(insertBeside(TableAddColumnBefore)).toEqual(['a', '', 'b'])
    expect(insertBeside(TableAddColumnAfter)).toEqual(['', 'a', 'b'])
  })
})
