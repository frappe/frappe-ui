import type { Editor } from '@tiptap/core'
import { getMarkRange } from '@tiptap/core'
import type { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Options for {@link linkClickPlugin}.
 */
export interface LinkClickPluginOptions {
  editor: Editor
  type: MarkType
}

/**
 * Handle clicks on link marks.
 *
 *  - Not editable → `return false` (let the browser follow the link).
 *  - Not on a link → `return false`.
 *  - Cmd/Meta-click → open the href in a new tab; `return true`.
 *  - Plain click   → open the link editor popup; `return true`.
 *
 * Always returns a boolean so ProseMirror knows whether the click was handled
 * (the legacy handler returned `undefined` from the editable/meta branches).
 */
export function linkClickPlugin(options: LinkClickPluginOptions): Plugin {
  const { editor, type } = options
  return new Plugin({
    key: new PluginKey('handleLinkClick'),
    props: {
      handleClick: (view, pos, event): boolean => {
        if (!editor.isEditable) return false

        const target = event.target as HTMLElement | null
        const anchor = target?.closest('a[href]')
        if (!anchor || !view.dom.contains(anchor)) return false

        event.preventDefault()

        if (event.metaKey || event.ctrlKey) {
          const url = anchor.getAttribute('href') || undefined
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
          editor.commands.focus()
          return true
        }

        const resolved = view.state.doc.resolve(pos)
        const range = getMarkRange(resolved, type)
        if (range) {
          editor.chain().setTextSelection(range).run()
        }
        requestAnimationFrame(() => {
          if (!editor.isDestroyed) editor.commands.openLinkEditor()
        })
        return true
      },
    },
  })
}
