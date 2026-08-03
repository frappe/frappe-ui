/**
 * Programmatically opening a suggestion menu (a toolbar "+"/"@" button) without
 * leaving the trigger character behind.
 *
 * `@tiptap/suggestion` has no imperative "open" — `active` is derived purely
 * from `findSuggestionMatch` scanning the text before the caret. So a button
 * that opens the menu has to type the trigger char into the document for real,
 * and then own it: picking an item consumes it (every command starts with
 * `deleteRange(range)`), but dismissing the menu (Escape, click-away, typing a
 * query that matches nothing) does not, because the plugin's exit is a
 * meta-only transaction that never edits the doc.
 *
 * `openSuggestionMenu` therefore stamps a marker on the insert transaction, and
 * `autoOpenCleanupPlugin` — registered next to every suggester by
 * `createSuggestionExtension` — removes the injected run if the menu closes
 * with it still sitting in the document. A trigger char the *user* typed
 * carries no marker and is never touched.
 */

import { escapeForRegEx, type Editor } from '@tiptap/core'
import { Plugin, PluginKey, type EditorState } from '@tiptap/pm/state'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { getSuggestionOptions } from './suggestion-helpers'

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
}

/** Adopted marker: the start of the text the opener injected (padding included). */
interface AutoOpenMarker {
  from: number
}

interface SuggestionPluginState {
  active: boolean
  range: { from: number; to: number }
}

/**
 * Open the suggestion menu of `extensionName` at the caret, as if the user had
 * typed its trigger char. Returns `false` when the extension is absent or has
 * no suggestion configured.
 */
export function openSuggestionMenu(
  editor: Editor,
  extensionName: string,
): boolean {
  const options = getSuggestionOptions<{
    suggestion?: Omit<SuggestionOptions, 'editor'>
  }>(editor, extensionName)
  const char = options?.suggestion?.char
  if (!char) return false

  return editor
    .chain()
    .focus()
    .command(({ tr, dispatch }) => {
      if (!dispatch) return true
      const { from, to } = tr.selection
      // `allowedPrefixes` defaults to [' '], so a trigger glued to the end of a
      // word never matches — but an unconditional space would leave a stray
      // blank in an empty paragraph. Pad only when the caret follows text.
      const $from = tr.doc.resolve(from)
      const before =
        from > $from.start() ? tr.doc.textBetween(from - 1, from) : ''
      const text = before && !/\s/.test(before) ? ` ${char}` : char

      tr.insertText(text, from, to)
      tr.setMeta(AUTO_OPEN_META, { char, from } satisfies AutoOpenMeta)
      return true
    })
    .run()
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
        if (meta?.char === char) return { from: meta.from }
        if (!marker) return null
        return { from: tr.mapping.map(marker.from, -1) }
      },
    },

    appendTransaction(transactions, oldState, newState) {
      const marker = key.getState(newState)
      if (!marker) return null
      // Menu still open — the trigger is doing its job.
      if (suggestionState(newState)?.active) return null

      const clear = newState.tr.setMeta(AUTO_OPEN_META, null)
      const previous = suggestionState(oldState)
      // Never opened (e.g. `allow` rejected it inside a code block). Drop the
      // marker so it cannot fire against an unrelated menu later.
      if (!previous?.active) return clear

      // Map the trigger range's end forward with a left bias: a command that
      // replaced the range collapses it onto the marker, which is exactly how
      // "the menu was dismissed" is told apart from "an item was picked".
      let to = previous.range.to
      for (const tr of transactions) to = tr.mapping.map(to, -1)

      const limit = newState.doc.content.size
      const from = Math.min(marker.from, limit)
      to = Math.min(Math.max(to, from), limit)
      if (from < to && injectedRun.test(newState.doc.textBetween(from, to))) {
        clear.delete(from, to)
      }
      return clear
    },
  })
}
