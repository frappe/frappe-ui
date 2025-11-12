import TableHeader from '@tiptap/extension-table-header'
import { CellSelection } from 'prosemirror-tables'

export const TableHeaderExtension = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            class: `${attributes.backgroundColor}`,
          }
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, '')
        },
      },
      borderColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.borderColor) {
            return {}
          }
          return {
            class: `${attributes.borderColor}-border`,
          }
        },
        parseHTML: (element) => {
          return element.style.borderColor.replace(/['"]+/g, '')
        },
      },
      borderWidth: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.borderWidth) {
            return {}
          }
          return {
            class: `border-${attributes.borderWidth}`,
          }
        },
        parseHTML: (element) => {
          return element.style.borderWidth.replace(/['"]+/g, '')
        },
      },
    }
  },

  addCommands() {
    return {
      selectRow:
        (cellPos: number) =>
        ({ tr, state, dispatch }) => {
          try {
            const $cell = state.doc.resolve(cellPos + 1)
            const sel = CellSelection.rowSelection($cell)
            if (dispatch) dispatch(tr.setSelection(sel))
            return true
          } catch {
            return false
          }
        },
      selectColumn:
        (cellPos: number) =>
        ({ tr, state, dispatch }) => {
          try {
            const $cell = state.doc.resolve(cellPos + 1)
            const sel = CellSelection.colSelection($cell)
            if (dispatch) dispatch(tr.setSelection(sel))
            return true
          } catch {
            return false
          }
        },
    }
  },
})


export default TableHeaderExtension
