import TableRow from '@tiptap/extension-table-row'

export const TableRowExtension = TableRow.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => {
                    if (element.tagName.toLowerCase() !== 'tr') {
                        return null
                    }
                },
                renderHTML(attributes){
                    if (!attributes.backgroundColor) {
                        return {}
                    }
                    return {
                        class: `${attributes.backgroundColor}`
                    }
                },
            },
            borderColor: {
                default: null,
                parseHTML: element => {
                    if (element.tagName.toLowerCase() !== 'tr') {
                        return null
                    }
                },
                renderHTML(attributes) {
                    if (!attributes.borderColor) {
                        return {}
                    }
                    return {
                        class: `${attributes.borderColor}!`,
                    }
                }
            },
            borderWidth: {
                default: null,
                parseHTML: element => {
                    if (element.tagName.toLowerCase() !== 'tr') {
                        return null
                    }
                    const classList = element.classList
                    const borderWidthClassMatch = Array.from(classList).find(cls => cls.startsWith('border-') && /^border-\d+$/.test(cls))
                    if (borderWidthClassMatch) {
                        return borderWidthClassMatch.replace('border-', '')
                    }
                    return null
                },
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
})


export default TableRowExtension
