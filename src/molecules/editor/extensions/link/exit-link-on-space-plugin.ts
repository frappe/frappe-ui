import type { Editor } from '@tiptap/core'
import type { MarkType, ResolvedPos } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Options for {@link exitLinkOnSpacePlugin}.
 */
export interface ExitLinkOnSpacePluginOptions {
  editor: Editor
  type: MarkType
}

/**
 * End the link when whitespace is typed at the end of one.
 *
 * The Link mark is *inclusive* whenever `autolink` is on (tiptap ties the two
 * together, so the mark can grow while a URL is still being typed). The side
 * effect is that a space typed right after a link is pulled inside the `<a>`,
 * and everything typed after it stays linked too. So `<a>docs</a>` becomes
 * `<a>docs and more</a>` one keystroke at a time.
 *
 * Whitespace is where a URL unambiguously ends, so it is the boundary we act
 * on: strip the link mark off a whitespace run the user just typed at the end
 * of a link. Text typed after it then inherits the (unlinked) space's marks,
 * which ends the link without touching the inclusive-mark behaviour that
 * autolink relies on while a URL is mid-typing.
 *
 * Runs as `appendTransaction` rather than `handleTextInput` so input rules keep
 * their first crack at the keystroke, and so pasted or IME-composed whitespace
 * is covered as well.
 */
export function exitLinkOnSpacePlugin(
  options: ExitLinkOnSpacePluginOptions,
): Plugin {
  return new Plugin({
    key: new PluginKey('exitLinkOnSpace'),
    appendTransaction: (transactions, _oldState, newState) => {
      if (!options.editor.isEditable) {
        return null
      }

      if (!transactions.some((transaction) => transaction.docChanged)) {
        return null
      }

      const { selection } = newState
      if (!selection.empty) {
        // Only a collapsed cursor means "the user is typing here".
        return null
      }

      const range = linkedTrailingSpace(selection.$from, options.type)
      if (!range) {
        return null
      }

      return newState.tr.removeMark(range.from, range.to, options.type)
    },
  })
}

/**
 * The run of linked whitespace immediately before `$pos`, when `$pos` is the
 * end of that link. Returns `null` when there is no such run, or when the link
 * continues past the cursor — a space typed *inside* link text stays linked,
 * because splitting a link in two is never what the keystroke meant.
 */
function linkedTrailingSpace(
  $pos: ResolvedPos,
  type: MarkType,
): { from: number; to: number } | null {
  const before = $pos.nodeBefore
  if (!before?.isText || !before.text) {
    return null
  }

  const link = before.marks.find((mark) => mark.type === type)
  if (!link) {
    return null
  }

  const after = $pos.nodeAfter
  if (after && link.isInSet(after.marks)) {
    // Mid-link: the whitespace separates link text rather than ending it.
    return null
  }

  const trailing = before.text.length - before.text.trimEnd().length
  if (trailing === 0) {
    return null
  }

  return { from: $pos.pos - trailing, to: $pos.pos }
}
