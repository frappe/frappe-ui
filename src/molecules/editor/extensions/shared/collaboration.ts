import type { EditorState, PluginKey, Transaction } from '@tiptap/pm/state'

/** `PluginKey`'s runtime `key` string, which its public type does not declare. */
type KeyedPluginKey = PluginKey & { key?: string }

/**
 * Whether these transactions carry a remote collaboration update.
 *
 * A remote peer's edit arrives as an ordinary local transaction, so a plugin
 * that rewrites the document in `appendTransaction` cannot tell the two apart
 * without asking. It needs to: that peer runs the same plugin and its own
 * rewrite replicates on its own, so acting here too means two peers editing the
 * same range concurrently — and, worse, silently pushing a local
 * normalisation into someone else's typing.
 *
 * Collaboration is a consumer-supplied extension (`@tiptap/extension-collaboration`
 * brings y-prosemirror), so its plugin key cannot be imported here. Find it on
 * the live state instead: y-prosemirror tags every remote application with the
 * meta of its `y-sync` plugin.
 */
export function isRemoteChange(
  transactions: readonly Transaction[],
  state: EditorState,
): boolean {
  const syncKey = state.plugins.find((plugin) =>
    ((plugin.spec.key as KeyedPluginKey | undefined)?.key ?? '').startsWith(
      'y-sync',
    ),
  )?.spec.key as PluginKey | undefined
  if (!syncKey) return false
  return transactions.some((transaction) => {
    if (transaction.getMeta(syncKey)) return true
    // Another plugin appending to the same dispatch (TrailingNode does, on any
    // structural change) produces a transaction that carries no sync meta of
    // its own. ProseMirror tags it with the root transaction that caused it,
    // so ask that one — otherwise the guard would depend on plugin order.
    const root = transaction.getMeta('appendedTransaction') as
      | Transaction
      | undefined
    return Boolean(root?.getMeta(syncKey))
  })
}
