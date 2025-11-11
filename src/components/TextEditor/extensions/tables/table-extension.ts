import Table from '@tiptap/extension-table'
import { tableCellMenuPlugin } from './table-menu-extension';
import { tableBorderMenuPlugin } from './table-border-menu-plugin';
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

export const TableExtension = Table.extend({
  TableRow,
  TableHeader,
  TableCell,
  addAttributes() {
    return {
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
      },
      borderColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.borderColor) {
            return {}
          }

          return {
            class: `${attributes.borderColor}!`,
          }
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
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      tableCellMenuPlugin(this.editor),
      tableBorderMenuPlugin(this.editor),
    ]
  },
})

export default TableExtension
