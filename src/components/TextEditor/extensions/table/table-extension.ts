import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableHandler from './TableHandler'

export interface TableExtensionOptions {
  showActionHandles: boolean
  minColumnWidth: number
  maxColumnWidth: number
}

const TableMouseHandlerKey = new PluginKey('TableMouseHandlerPlugin')

const tableHandlersMap = new WeakMap<HTMLElement, TableHandler>()

export const TableExtension = Extension.create<TableExtensionOptions>({
  name: 'Table',

  addOptions() {
    return {
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

  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        key: TableMouseHandlerKey,
        view(editorView) {
          return {
            destroy() {
              let editorContainerEl = editorView.dom.closest('.table-editor') as HTMLElement | null
              if (!editorContainerEl) {
                let parent = editorView.dom.parentElement
                while (parent && !parent.classList.contains('table-editor')) {
                  parent = parent.parentElement
                }
                editorContainerEl = parent as HTMLElement | null
              }

              if (editorContainerEl && tableHandlersMap.has(editorContainerEl)) {
                const handler = tableHandlersMap.get(editorContainerEl)
                if (handler && typeof handler.destroy === 'function') {
                  handler.destroy()
                }
                tableHandlersMap.delete(editorContainerEl)
              }
            },
          }
        },
        props: {
          handleDOMEvents: {
            mousemove(editorView, event) {
              if (!(event instanceof MouseEvent) || !extension.options.showActionHandles) {
                return false
              }

              let editorContainerEl = editorView.dom.closest('.table-editor') as HTMLElement | null
              if (!editorContainerEl) {
                let parent = editorView.dom.parentElement
                while (parent && !parent.classList.contains('table-editor')) {
                  parent = parent.parentElement
                }
                editorContainerEl = parent as HTMLElement | null
              }

              if (!editorContainerEl) return false

              let tableHandler = tableHandlersMap.get(editorContainerEl)
              if (!tableHandler) {
                tableHandler = new TableHandler(extension.editor, editorContainerEl)
                tableHandlersMap.set(editorContainerEl, tableHandler)
              }

              tableHandler.handleMouseMove(event)
              return false
            },
          },
        },
      }),
    ]
  },

  addGlobalAttributes() {
    return [
      {
        types: ['table'],
        attributes: {
          // Remove all class application - let CSS handle everything
        },
      },
    ]
  },

  onCreate() {
  },
})

export default TableExtension
