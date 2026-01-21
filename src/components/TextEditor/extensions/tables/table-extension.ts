
import { tableBorderMenuPlugin } from './table-border-menu-plugin';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
// import tableIndividualCellPlugin from './table-individual-cell-plugin'

export const TableExtension = Table.extend({
  TableRow,
  TableHeader,
  TableCell,
  addAttributes() {
    return {
      backgroundColor: {
        renderHTML(attributes){
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            class: `${attributes.backgroundColor}`,
          }
        },
      },
      borderColor: {
        default: null,
        renderHTML(attributes){
          if (!attributes.borderColor) {
            return {}
          }
          return {
            class: `${attributes.borderColor}!`,
          }
        },
      },
      borderWidth: {
        renderHTML(attributes){
          if (!attributes.borderWidth) {
            return {}
          }
          return {
            class: `border-${attributes.borderWidth}`,
          }
        },
      },
    }
  },
  
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      tableBorderMenuPlugin(this.editor),
      // tableIndividualCellPlugin(this.editor)
    ]
  },
})

export default TableExtension
