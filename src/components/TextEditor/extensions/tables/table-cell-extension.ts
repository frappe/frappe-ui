import TableCell from '@tiptap/extension-table-cell'

export const TableCellExtension = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
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
                renderHTML(attributes){
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


export default TableCellExtension

