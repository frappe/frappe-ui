import {
  combineTransactionSteps,
  getChangedRanges,
  getMarkRange,
  type Editor,
} from '@tiptap/core'
import type { MarkType, ResolvedPos } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isRemoteChange } from '#molecules/editor/extensions/shared/collaboration'

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
    appendTransaction: (transactions, oldState, newState) => {
      if (!options.editor.isEditable) {
        return null
      }

      if (!transactions.some((transaction) => transaction.docChanged)) {
        return null
      }

      // A remote peer's space is that peer's link to end: it runs this same
      // plugin and the result replicates. Ending it here too would push a local
      // rewrite into their typing.
      if (isRemoteChange(transactions, newState)) {
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

      // The whitespace has to be part of what just changed. Otherwise an edit
      // anywhere else — a collaborator's keystroke, an undo — would rewrite
      // marks the user never touched, just because the cursor happened to be
      // resting after an already-linked space.
      const changes = getChangedRanges(
        combineTransactionSteps(oldState.doc, [...transactions]),
      )
      const justWritten = changes.some(
        ({ newRange }) =>
          newRange.to >= range.from && newRange.from <= range.to,
      )
      if (!justWritten) {
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

  const from = $pos.pos - trailing
  const linkRange = getMarkRange($pos, type)
  if (linkRange && from <= linkRange.from) {
    // The link is whitespace all the way down, so ending it here would delete
    // it outright. Ending a link is this plugin's job; removing one is not.
    return null
  }

  return { from, to: $pos.pos }
}
