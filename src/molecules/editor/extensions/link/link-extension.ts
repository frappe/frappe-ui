import Link from '@tiptap/extension-link'
import { buildOpenLinkEditor, type OpenLinkEditorOptions } from './link-commands'
import { linkPastePlugin } from './link-paste-plugin'
import { clearLinkOnBoundaryPlugin } from './clear-link-on-boundary-plugin'
import { linkClickPlugin } from './link-click-plugin'
import { linkShortcutPlugin } from './link-shortcut-plugin'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkEditor: {
      /** Opens the link editor bubble menu. */
      openLinkEditor: (options?: OpenLinkEditorOptions) => ReturnType
    }
  }
}

/**
 * The editor's Link mark.
 *
 * Schema/sanitizer (`isAllowedUri`, `protocols`, parse/render) are inherited
 * from `@tiptap/extension-link` via `...this.parent?.()` and deliberately NOT
 * weakened. This extension only adds:
 *  - the `openLinkEditor` command (bubble popup) — see `link-commands.ts`;
 *  - four ProseMirror plugins (paste / boundary / click / shortcut) — one per file.
 *    `Mod-k` lives in the shortcut plugin (not `addKeyboardShortcuts`) so it can
 *    stop the keystroke propagating to app-level listeners; see that file.
 */
export const LinkExtension = Link.extend({
  addOptions() {
    return {
      ...this.parent!(),
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      linkOnPaste: false,
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      openLinkEditor: buildOpenLinkEditor(this.type),
    }
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() ?? []
    plugins.push(
      linkPastePlugin({ editor: this.editor, type: this.type }),
      clearLinkOnBoundaryPlugin({ editor: this.editor, type: this.type }),
      linkClickPlugin({ editor: this.editor, type: this.type }),
      linkShortcutPlugin({ editor: this.editor }),
    )
    return plugins
  },
})

export default LinkExtension
