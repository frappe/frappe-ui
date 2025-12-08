import { Table } from '@tiptap/extension-table'
import { columnResizing } from '@tiptap/pm/tables'
import { tableBorderMenuPlugin } from './table-border-menu-plugin';

export const TableExtension = Table.extend({
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
      columnResizing({
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,
        defaultCellMinWidth: this.options.cellMinWidth,
        View: this.options.View,
        lastColumnResizable: this.options.lastColumnResizable,
      }),
      tableBorderMenuPlugin(this.editor),
    ]
  },
})

export default TableExtension
