import type { Editor } from '@tiptap/core'

/**
 * Shared backtick (`) keyboard handler for both `ExtendedCodeBlock` and
 * `ExtendedCode`.
 *
 * Returns `false` on an empty selection (lets the default `` ` `` input/typing
 * behavior run), otherwise toggles the inline `code` mark over the selection.
 */
export function toggleCodeOnBacktick(editor: Editor): boolean {
  const { from, to } = editor.state.selection
  if (from === to) return false
  return editor.commands.toggleCode()
}
