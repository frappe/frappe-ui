/**
 * Programmatically opening a suggestion menu (a toolbar "+"/"@" button) without
 * leaving the trigger character behind.
 *
 * Internal to the package: `createSuggestionExtension` exposes this as
 * `editor.commands.openSuggestionMenu(extensionName)`, which is how callers
 * should reach it. Nothing here is exported from `frappe-ui/editor`.
 *
 * `@tiptap/suggestion` has no imperative "open" — `active` is derived purely
 * from `findSuggestionMatch` scanning the text before the caret. So a button
 * that opens the menu has to type the trigger char into the document for real,
 * and then own it: dismissing the menu (Escape, click-away, typing a query that
 * matches nothing) leaves it behind, because the plugin's exit is a meta-only
 * transaction that never edits the doc — and even picking an item only consumes
 * the trigger and the query (`deleteRange(range)`), never the space the opener
 * had to prepend for the trigger to match after a word.
 *
 * `insertSuggestionTrigger` therefore stamps a marker on the insert
 * transaction, and `autoOpenCleanupPlugin` — registered next to every suggester
 * by `createSuggestionExtension` — removes whatever the opener injected and the
 * close left over. A trigger char the *user* typed carries no marker and is
 * never touched.
 */

import { escapeForRegEx } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import {
  Plugin,
  PluginKey,
  type EditorState,
  type Transaction,
} from '@tiptap/pm/state'

/**
 * Transaction meta identifying an auto-opened trigger. Shared by every
 * suggester (a plain string, not a PluginKey — each cleanup plugin needs its
 * own key, but they can all read one meta): a cleanup plugin only adopts a
 * marker whose `char` is its own trigger. Setting the meta to `null` clears an
 * adopted marker.
 */
const AUTO_OPEN_META = 'suggestionAutoOpen'

interface AutoOpenMeta {
  char: string
  from: number
  to: number
  padded: boolean
}

/** Adopted marker: the span of text the opener injected (padding included). */
interface AutoOpenMarker {
  from: number
  /** End of that span, so the never-opened path can take back exactly it. */
  to: number
  /** Whether that injected text starts with a padding space. */
  padded: boolean
}

interface SuggestionPluginState {
  active: boolean
  range: { from: number; to: number }
}

/**
 * True when the padding space at `pos` has nothing left to keep apart: its text
 * block ends there, or the next character is whitespace anyway.
 *
 * Picking an item consumes the trigger and the query (`deleteRange(range)`) but
 * not the space the opener prepended in front of them, so a block command such
 * as "Bullet list" leaves a blank the user never typed. A command that inserted
 * inline content instead — a mention chip, an emoji — lands right after that
 * space, and there it is doing the job a user-typed space would have done:
 * removing it would glue the insertion onto the preceding word, a worse edit
 * than the blank we are trying to take back.
 */
function isStrandedPadding(doc: ProseMirrorNode, pos: number): boolean {
  if (pos + 1 > doc.content.size) return false
  const padding = doc.resolve(pos).nodeAfter
  if (!padding?.isText || !padding.text?.startsWith(' ')) return false
  const next = doc.resolve(pos + 1).nodeAfter
  return !next || (next.isText && /^\s/.test(next.text ?? ''))
}

/**
 * Type `char` into `tr` at the caret so the suggester matches it, and mark the
 * insertion so `autoOpenCleanupPlugin` can take it back out again.
 *
 * Writes to the caller's transaction rather than dispatching its own: the
 * `openSuggestionMenu` command runs mid-dispatch, and a nested `editor.chain()`
 * there throws `Applying a mismatched transaction`.
 */
export function insertSuggestionTrigger(tr: Transaction, char: string): void {
  const { from, to } = tr.selection
  // `allowedPrefixes` defaults to [' '], so a trigger glued to the end of a
  // word never matches — but an unconditional space would leave a stray blank
  // in an empty paragraph. Pad only when the caret follows text.
  const $from = tr.doc.resolve(from)
  const before = from > $from.start() ? tr.doc.textBetween(from - 1, from) : ''
  const text = before && !/\s/.test(before) ? ` ${char}` : char

  tr.insertText(text, from, to)
  tr.setMeta(AUTO_OPEN_META, {
    char,
    from,
    to: from + text.length,
    // Not `text.length > 1`: a multi-char trigger is unpadded but longer than
    // one, and the "used" path would then eat a real character.
    padded: text !== char,
  } satisfies AutoOpenMeta)
}

/**
 * Companion plugin for `createSuggestionExtension`. MUST be registered after
 * the `Suggestion` plugin itself, so the suggester's state for the new document
 * is already computed when this one inspects it.
 */
export function autoOpenCleanupPlugin(options: {
  char: string
  pluginKey: PluginKey
}): Plugin<AutoOpenMarker | null> {
  const { char, pluginKey } = options
  // Each suggester gets its own plugin key: prosemirror-state rejects two
  // plugin instances sharing one key.
  const key = new PluginKey<AutoOpenMarker | null>('suggestionAutoOpenCleanup')
  // What the opener injected: an optional padding space, the trigger, and
  // whatever the user typed as a query afterwards.
  const injectedRun = new RegExp(`^ ?${escapeForRegEx(char)}[^\\n]*$`)

  const suggestionState = (state: EditorState) =>
    pluginKey.getState(state) as SuggestionPluginState | undefined

  return new Plugin<AutoOpenMarker | null>({
    key,

    state: {
      init: () => null,
      apply(tr, marker) {
        const meta = tr.getMeta(AUTO_OPEN_META) as
          | AutoOpenMeta
          | null
          | undefined
        if (meta === null) return null
        if (meta?.char === char) {
          return { from: meta.from, to: meta.to, padded: meta.padded }
        }
        if (!marker) return null
        return {
          ...marker,
          from: tr.mapping.map(marker.from, -1),
          to: tr.mapping.map(marker.to, -1),
        }
      },
    },

    appendTransaction(transactions, oldState, newState) {
      const marker = key.getState(newState)
      if (!marker) return null
      // Menu still open — the trigger is doing its job.
      if (suggestionState(newState)?.active) return null

      const clear = newState.tr.setMeta(AUTO_OPEN_META, null)
      const limit = newState.doc.content.size
      const previous = suggestionState(oldState)

      // Never opened (e.g. `allow` rejected it inside a code block). The
      // trigger we typed to open a menu has no menu to open, so take it back
      // out — leaving it would be the same stray char this plugin exists to
      // prevent, just on a path the user cannot see coming. Appending to this
      // transaction rather than dispatching a second one keeps the insert and
      // its removal a single undo step.
      if (!previous?.active) {
        const from = Math.min(marker.from, limit)
        const to = Math.min(Math.max(marker.to, from), limit)
        if (from < to && injectedRun.test(newState.doc.textBetween(from, to))) {
          clear.delete(from, to)
        }
        return clear
      }

      // Map the trigger range's end forward with a left bias: a command that
      // replaced the range collapses it onto the marker, which is exactly how
      // "the menu was dismissed" is told apart from "an item was picked".
      let to = previous.range.to
      for (const tr of transactions) to = tr.mapping.map(to, -1)

      const from = Math.min(marker.from, limit)
      to = Math.min(Math.max(to, from), limit)
      if (from < to && injectedRun.test(newState.doc.textBetween(from, to))) {
        // Dismissed: the whole injected run is still sitting in the document.
        clear.delete(from, to)
      } else if (marker.padded && isStrandedPadding(newState.doc, from)) {
        // Used: the command took the trigger and the query with it, but not the
        // space we put in front of them to make the trigger match.
        clear.delete(from, from + 1)
      }
      return clear
    },
  })
}
