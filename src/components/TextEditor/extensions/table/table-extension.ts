import { Extension } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from 'prosemirror-state'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableActionMenu from './TableActionMenu.vue'
import TableCellActionHandle from './TableCellActionHandle.vue'
import TableHandler from './TableHandler'

export interface TableExtensionOptions {
  scrollable: boolean
  showActionHandles: boolean
  minColumnWidth: number
  maxColumnWidth: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableEditor: {
      insertTable: (options: {
        rows: number
        cols: number
        withHeaderRow?: boolean
      }) => ReturnType
      addColumnBefore: () => ReturnType
      addColumnAfter: () => ReturnType
      deleteColumn: () => ReturnType
      addRowBefore: () => ReturnType
      addRowAfter: () => ReturnType
      deleteRow: () => ReturnType
      deleteTable: () => ReturnType
      toggleHeaderRow: () => ReturnType
      toggleHeaderColumn: () => ReturnType
    }
  }
}

declare global {
  interface HTMLElement {
    tableHandler?: TableHandler
  }
}

const TableMouseHandlerKey = new PluginKey('tableMouseHandler')

export const TableExtension = Extension.create<TableExtensionOptions>({
  name: 'Table',

  addOptions() {
    return {
      scrollable: true,
      showActionHandles: true,
      minColumnWidth: 120,
      maxColumnWidth: 300,
    }
  },

  addExtensions() {
    return [
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ]
  },

  addCommands() {
    return {
      insertTable:
        (options) =>
        ({ commands }) => {
          return commands.insertTable(options)
        },
      addColumnBefore:
        () =>
        ({ commands }) => {
          return commands.addColumnBefore()
        },
      addColumnAfter:
        () =>
        ({ commands }) => {
          return commands.addColumnAfter()
        },
      deleteColumn:
        () =>
        ({ commands }) => {
          return commands.deleteColumn()
        },
      addRowBefore:
        () =>
        ({ commands }) => {
          return commands.addRowBefore()
        },
      addRowAfter:
        () =>
        ({ commands }) => {
          return commands.addRowAfter()
        },
      deleteRow:
        () =>
        ({ commands }) => {
          return commands.deleteRow()
        },
      deleteTable:
        () =>
        ({ commands }) => {
          return commands.deleteTable()
        },
      toggleHeaderRow:
        () =>
        ({ commands }) => {
          return commands.toggleHeaderRow()
        },
      toggleHeaderColumn:
        () =>
        ({ commands }) => {
          return commands.toggleHeaderColumn()
        },
    }
  },

  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        key: TableMouseHandlerKey,
        props: {
          handleDOMEvents: {
            mousemove(view, event) {
              let editorElement = view.dom.closest(
                '.table-editor',
              ) as HTMLElement

              if (!editorElement) {
                let parent = view.dom.parentElement
                while (parent && !parent.classList.contains('table-editor')) {
                  parent = parent.parentElement
                }
                editorElement = parent as HTMLElement
              }

              if (!editorElement || !extension.options.showActionHandles) {
                return false
              }

              const tableHandler = editorElement.tableHandler

              if (tableHandler) {
                tableHandler.handleMouseMove(event)
              }
              return false
            },
          },
        },
        view(editorView) {
          return {
            update: () => {},
            destroy: () => {},
          }
        },
      }),
    ]
  },

  addGlobalAttributes() {
    return [
      {
        types: ['table'],
        attributes: {
          class: {
            default: 'table-editor-styles',
          },
        },
      },
    ]
  },

  onCreate() {
    if (this.options.scrollable) {
      const styleId = 'table-editor-styles'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          .table-editor {
            position: relative;
          }

          .table-editor .scrollable-tables table {
            table-layout: fixed !important;
            width: 100%;
            min-width: 100%;
            max-width: none;
            overflow-x: auto;
            display: block;
            border-collapse: separate;
            border-spacing: 0;
          }

          .table-editor .scrollable-tables table thead,
          .table-editor .scrollable-tables table tbody,
          .table-editor .scrollable-tables table tfoot {
            display: table;
            width: 100%;
            table-layout: fixed;
          }

          .table-editor .scrollable-tables table tr {
            display: table-row;
          }

          .table-editor .scrollable-tables table th,
          .table-editor .scrollable-tables table td {
            display: table-cell;
            white-space: normal;
            word-wrap: break-word;
            width: ${this.options.minColumnWidth}px;
            min-width: ${this.options.minColumnWidth}px;
            max-width: ${this.options.minColumnWidth}px;
            overflow-wrap: break-word;
            vertical-align: top;
            box-sizing: border-box;
          }

          .table-editor .scrollable-tables table .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
            background: #dbeafe;
            opacity: 0.3;
          }

          .table-editor .scrollable-tables table .column-resize-handle {
            position: absolute;
            right: -1px;
            top: 0;
            bottom: -2px;
            width: 4px;
            background-color: #dbeafe;
            pointer-events: none;
          }

          @media (max-width: 768px) {
            .table-editor .scrollable-tables table th,
            .table-editor .scrollable-tables table td {
              min-width: 100px;
              max-width: 100px;
            }
          }

          @media (max-width: 480px) {
            .table-editor .scrollable-tables table th,
            .table-editor .scrollable-tables table td {
              min-width: 80px;
              max-width: 80px;
            }
          }
        `
        document.head.appendChild(style)
      }
    }
  },
})

export default TableExtension
