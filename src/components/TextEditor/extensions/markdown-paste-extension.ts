import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DOMParser } from '@tiptap/pm/model'
import { detectMarkdown, markdownToHTML } from '../../../utils/markdown'

export interface MarkdownPasteOptions {
  enabled: boolean
  showConfirmation: boolean
}

export const MarkdownPasteExtension = Extension.create<MarkdownPasteOptions>({
  name: 'markdownPaste',

  addOptions() {
    return {
      enabled: true,
      showConfirmation: true,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (view, event, slice) => {
            if (!this.options.enabled) return false

            const text = event.clipboardData?.getData('text/plain')
            if (!text) return false

            if (!detectMarkdown(text)) return false

            if (this.options.showConfirmation) {
              const shouldConvert = confirm(
                'Do you want to convert markdown content to HTML before pasting?',
              )
              if (!shouldConvert) return false
            }

            const htmlContent = markdownToHTML(text)
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = htmlContent

            const parser = DOMParser.fromSchema(view.state.schema)
            const parsedSlice = parser.parseSlice(tempDiv, {
              preserveWhitespace: true,
            })

            const tr = view.state.tr.replaceSelection(parsedSlice)
            view.dispatch(tr)

            return true
          },
        },
      }),
    ]
  },
})
