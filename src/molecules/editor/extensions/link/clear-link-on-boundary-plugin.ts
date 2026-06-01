import type { Editor } from '@tiptap/core'
import type { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Options for {@link clearLinkOnBoundaryPlugin}.
 */
export interface ClearLinkOnBoundaryPluginOptions {
  editor: Editor
  type: MarkType
}

/**
 * Clear a stored link mark when the cursor sits at a link boundary but the
 * document at the cursor has no active link mark.
 *
 * Without this, typing immediately after a link (with the link still in
 * `storedMarks`) would extend the link onto the new text. Lifted verbatim
 * from the legacy `link-extension.ts` `appendTransaction`.
 */
export function clearLinkOnBoundaryPlugin(
  options: ClearLinkOnBoundaryPluginOptions,
): Plugin {
  return new Plugin({
    key: new PluginKey('clearLinkMarkOnBoundary'),
    appendTransaction: (_transactions, _oldState, newState) => {
      if (!options.editor.isEditable) {
        return null
      }

      const { tr, selection, storedMarks } = newState
      const { $from, empty } = selection

      if (!empty || !storedMarks || storedMarks.length === 0) {
        // Only apply for cursor selections and if there are stored marks
        return null
      }

      const linkMarkType = options.type
      const hasStoredLinkMark = storedMarks.some(
        (mark) => mark.type === linkMarkType,
      )

      if (!hasStoredLinkMark) {
        return null
      }

      // Check if the cursor position itself has an active link mark in the document
      const marksAtCursor = $from.marks()
      const activeLinkAtCursor = marksAtCursor.some(
        (mark) => mark.type === linkMarkType,
      )

      if (activeLinkAtCursor) {
        // If there's an actual link mark active in the document at the cursor,
        // then it's correct for the stored mark to be there.
        return null
      }

      // Selection is a collapsed cursor, there's a stored link mark, and the
      // document has no active link at the cursor: clear the stored mark.
      return tr.setStoredMarks([])
    },
  })
}
