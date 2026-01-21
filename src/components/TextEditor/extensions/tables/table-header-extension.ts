import TableHeader from '@tiptap/extension-table-header'

export const TableHeaderExtension = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        parseHTML: (element) => {
          if (element.tagName.toLowerCase() !== 'th') {
            return null
          }
        },
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
        parseHTML: (element) => {
          if (element.tagName.toLowerCase() !== 'th') {
            return null
          }
        },
        renderHTML(attributes) {
          if (!attributes.borderColor) {
            return {}
          }
          return {
            class: `${attributes.borderColor}-border`,
          }
        },
      },
      borderWidth: {
        default: null,
        parseHTML: (element) => {
          if (element.tagName.toLowerCase() !== 'th') {
            return null
          }
          const style = element.getAttribute('style') || ''
          const borderWidthMatch = style.match(/border-width:\s*(\d+px)/i)
          if (borderWidthMatch) {
            return borderWidthMatch[1]
          }
          const classList = element.classList
          const borderWidthClassMatch = Array.from(classList).find(
            (cls) => typeof cls === 'string' && cls.startsWith('border-') && /^border-\d+$/.test(cls),
          )
          if (borderWidthClassMatch) {
            const width = (borderWidthClassMatch as string).replace('border-', '')
            return `${width}px`
          }
          return null
        },
        renderHTML(attributes) {
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


