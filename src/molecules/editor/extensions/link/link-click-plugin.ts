import type { Editor } from '@tiptap/core'
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
 *  - Plain click   → `return false`; let the caret land where the user clicked so
 *    link text stays editable. The link editor is opened via the hover affordance
 *    / `Mod-k`, not by trapping a plain click.
 *
 * Always returns a boolean so ProseMirror knows whether the click was handled
 * (the legacy handler returned `undefined` from the editable/meta branches).
 */
export function linkClickPlugin(options: LinkClickPluginOptions): Plugin {
  const { editor } = options
  return new Plugin({
    key: new PluginKey('handleLinkClick'),
    props: {
      handleClick: (view, _pos, event): boolean => {
        if (!editor.isEditable) return false

        const target = event.target as HTMLElement | null
        const anchor = target?.closest('a[href]')
        if (!anchor || !view.dom.contains(anchor)) return false

        if (event.metaKey || event.ctrlKey) {
          event.preventDefault()
          const url = anchor.getAttribute('href') || undefined
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
          editor.commands.focus()
          return true
        }

        // Plain click: don't preventDefault or reselect the whole link range —
        // that stole focus into the editor popup and trapped the caret. Let the
        // browser place the caret where the user clicked.
        return false
      },
    },
  })
}
