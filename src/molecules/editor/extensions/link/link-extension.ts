import Link from '@tiptap/extension-link'
import { buildOpenLinkEditor } from './link-commands'
import { linkPastePlugin } from './link-paste-plugin'
import { clearLinkOnBoundaryPlugin } from './clear-link-on-boundary-plugin'
import { linkClickPlugin } from './link-click-plugin'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkEditor: {
      /** Opens the link editor bubble menu. */
      openLinkEditor: () => ReturnType
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
 *  - `Mod-k` to invoke it;
 *  - three ProseMirror plugins (paste / boundary / click) — one per file.
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

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.openLinkEditor(),
    }
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() ?? []
    plugins.push(
      linkPastePlugin({ editor: this.editor, type: this.type }),
      clearLinkOnBoundaryPlugin({ editor: this.editor, type: this.type }),
      linkClickPlugin({ editor: this.editor, type: this.type }),
    )
    return plugins
  },
})

export default LinkExtension
