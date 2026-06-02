import type { Editor } from '@tiptap/core'
import type { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isSafeUrl } from '#molecules/editor/extensions/shared/url-safety'

/**
 * Options for {@link linkPastePlugin}.
 */
export interface LinkPastePluginOptions {
  editor: Editor
  type: MarkType
}

/**
 * Turn a pasted URL into a link over the current (non-empty) selection.
 *
 * Hardened vs. the legacy `linkPasteHandler`:
 *  - validates the pasted text with the shared `isSafeUrl` (http/https only),
 *    so bare relative slugs / anchors / `javascript:` no longer become links;
 *  - only fires when the pasted slice is a single node on a single line
 *    (`childCount <= 1`, no `\r`/`\n`) so multi-paragraph pastes fall through
 *    to the default paste behaviour.
 */
export function linkPastePlugin(options: LinkPastePluginOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handlePasteLink'),
    props: {
      handlePaste: (view, _event, slice): boolean => {
        const { selection } = view.state
        if (selection.empty) return false

        // Single node, single line only.
        if (slice.content.childCount > 1) return false

        let textContent = ''
        slice.content.forEach((node) => {
          textContent += node.textContent
        })
        const text = textContent.trim()
        if (!text || /[\r\n]/.test(text)) return false

        if (!isSafeUrl(text, { allowedSchemes: ['http', 'https'] })) {
          return false
        }

        return options.editor
          .chain()
          .setTextSelection({ from: selection.from, to: selection.to })
          .setLink({ href: text })
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
