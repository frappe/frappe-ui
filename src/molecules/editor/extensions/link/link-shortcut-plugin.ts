import type { Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Options for {@link linkShortcutPlugin}.
 */
export interface LinkShortcutPluginOptions {
  editor: Editor
}

/**
 * Bind `Mod-k` to the link editor popup.
 *
 * This lives in a ProseMirror plugin rather than `addKeyboardShortcuts` so it can
 * reach the native event and call `stopPropagation()`. TipTap's keyboard-shortcut
 * handlers only `preventDefault()` (never stop propagation), so the keystroke would
 * otherwise still bubble to `document`-level listeners — e.g. an app's `Cmd-K`
 * command palette would open at the same time as the link popup.
 *
 * Scoped to editable views: a read-only editor shouldn't hijack `Cmd-K`.
 */
export function linkShortcutPlugin(options: LinkShortcutPluginOptions): Plugin {
  const { editor } = options
  return new Plugin({
    key: new PluginKey('linkShortcut'),
    props: {
      handleKeyDown: (view, event): boolean => {
        const isModK =
          (event.metaKey || event.ctrlKey) &&
          !event.shiftKey &&
          !event.altKey &&
          event.key.toLowerCase() === 'k'
        if (!isModK || !editor.isEditable) return false

        event.preventDefault()
        event.stopPropagation()
        // An explicit selection (e.g. selecting a link) → edit its URL straight
        // away; a bare cursor in a link → the default read-only view.
        const hasSelection = !view.state.selection.empty
        editor.commands.openLinkEditor(
          hasSelection ? { startInEdit: true } : undefined,
        )
        return true
      },
    },
  })
}
