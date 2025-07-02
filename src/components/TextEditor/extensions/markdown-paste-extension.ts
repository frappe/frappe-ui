import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DOMParser } from '@tiptap/pm/model'
import { detectMarkdown, markdownToHTML } from '../../../utils/markdown'
import { EditorView } from 'prosemirror-view'
import { processMultipleImages } from './image/image-extension'

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
    const extensionThis = this
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (
            view: EditorView,
            event: ClipboardEvent,
            slice: any,
          ) => {
            if (!this.options.enabled) return false

            // Check for images first
            const files: File[] | [] = Array.from(
              event.clipboardData?.files || [],
            )
            const images = Array.from(files).filter((file) =>
              file.type.startsWith('image/'),
            )
            if (images.length > 0) {
              processMultipleImages(images, view, null, extensionThis.options)
              return true
            }

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
