import { Table } from '@tiptap/extension-table'
import { columnResizing, CellSelection } from '@tiptap/pm/tables'
import { tableBorderMenuPlugin } from './table-border-menu-plugin';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'

export const TableExtension = Table.extend({
  addAttributes() {
    return {
      backgroundColor: {
        parseHTML: element => {
          if (!element.closest('table') && element.tagName.toLowerCase() !== 'table') {
            return null
          }
          const classList = element.classList
          const bgColors = ['red', 'orange', 'yellow', 'green', 'teal', 'cyan', 'blue', 'purple', 'pink', 'gray']
          for (const color of bgColors) {
            if (classList.contains(color)) {
              return color
            }
          }
          return null
        },
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
        parseHTML: element => {
          if (!element.closest('table') && element.tagName.toLowerCase() !== 'table') {
            return null
          }
          const classList = element.classList
          const borderColors = ['red', 'orange', 'yellow', 'green', 'teal', 'cyan', 'blue', 'purple', 'pink', 'gray']
          for (const color of borderColors) {
            if (classList.contains(`${color}!`)) {
              return color
            }
          }
          return null
        },
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
        parseHTML: element => {
          if (!element.closest('table') && element.tagName.toLowerCase() !== 'table') {
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
  
  addProseMirrorPlugins() {
    return [
      tableBorderMenuPlugin(this.editor),
      ...(this.parent?.() ?? []),
      columnResizing({
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,
        defaultCellMinWidth: this.options.cellMinWidth,
        View: this.options.View,
        lastColumnResizable: this.options.lastColumnResizable,
      }),
    ]
  },
})

export default TableExtension
