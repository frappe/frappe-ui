import { Editor } from '@tiptap/core'
import { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isValidUrl } from '../../utils/url-validation'

type PasteHandlerOptions = {
  editor: Editor
  defaultProtocol: string
  type: MarkType
}

export function linkPasteHandler(options: PasteHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handlePasteLink'),
    props: {
      handlePaste: (view, event, slice) => {
        const { state } = view
        const { selection } = state
        const { empty } = selection

        if (empty) {
          return false
        }

        let textContent = ''
        slice.content.forEach((node) => {
          textContent += node.textContent
        })
        if (!textContent) {
          return false
        }

        let link = isValidUrl(textContent) ? textContent : null
        if (!link) {
          return false
        }

        return options.editor
          .chain()
          .setTextSelection({ from: selection.from, to: selection.to })
          .setLink({ href: link })
          .setTextSelection(selection.to)
          .command(({ tr }) => {
            tr.setStoredMarks([])
            return true
          })
          .run()
      },
    },
  })
}
