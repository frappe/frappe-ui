import TableRow from '@tiptap/extension-table-row'

export const TableRowExtension = TableRow.extend({
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
                        class: `${attributes.backgroundColor}`
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
                        class: `${attributes.borderColor}!`,
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
})


export default TableRowExtension
