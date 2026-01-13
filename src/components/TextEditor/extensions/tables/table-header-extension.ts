import {TableHeader} from '@tiptap/extension-table'

export const TableHeaderExtension = TableHeader.extend({
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
        renderHTML (attributes) {
          if (!attributes.borderColor) {
            return {}
          }
          return {
            class: `${attributes.borderColor}-border`,
          }
        },

      },
      borderWidth: {
        renderHTML(attributes){
          if (!attributes.borderWidth) {
            return {}
          }
          return {
            style: `border-width: ${attributes.borderWidth};`,
          }
        },
      },
    }
  },
})


export default TableHeaderExtension
