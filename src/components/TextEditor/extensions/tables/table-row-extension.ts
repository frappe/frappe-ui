import { TableRow } from '@tiptap/extension-table'

export const TableRowExtension = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        renderHTML(attributes) {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            class: `${attributes.backgroundColor}`,
          }
        },
      },
      borderColor: {
        renderHTML(attributes) {
          if (!attributes.borderColor) {
            return {}
          }
          return {
            class: `${attributes.borderColor}!`,
          }
        },
      },
      borderWidth: {
        renderHTML(attributes) {
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
})

export default TableRowExtension
