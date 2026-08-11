import { Extension } from '@tiptap/core'
import type {
  Node as ProseMirrorNode,
  NodeType,
  Schema,
} from '@tiptap/pm/model'
import { Plugin, PluginKey, type Transaction } from '@tiptap/pm/state'
import { canJoin } from '@tiptap/pm/transform'
import { isRemoteChange } from '#molecules/editor/extensions/shared/collaboration'

const listTypeCache = new WeakMap<Schema, Set<NodeType>>()

/**
 * Every list node TipTap ships declares `group: 'block list'`, so reading the
 * group covers a consumer's own list node too, with no list of names to keep
 * in sync.
 */
function listTypesIn(schema: Schema): Set<NodeType> {
  // A schema is fixed for the life of an editor, so resolve it once instead of
  // on every doc-changing transaction.
  const cached = listTypeCache.get(schema)
  if (cached) return cached

  const types = new Set<NodeType>()
  for (const name of Object.keys(schema.nodes)) {
    const type = schema.nodes[name]
    const groups = String(type.spec.group ?? '').split(' ')
    if (groups.includes('list')) types.add(type)
  }
  listTypeCache.set(schema, types)
  return types
}

/**
 * Two sibling lists of the same kind are indistinguishable on screen, so they
 * must be one node. Merge only when the attributes match: a list carrying its
 * own `start` (or `type`) was numbered deliberately and keeps its identity.
 */
function isJoinablePair(
  before: ProseMirrorNode,
  after: ProseMirrorNode,
  listTypes: Set<NodeType>,
): boolean {
  // sameMarkup deep-compares attributes, so a list node with an object or
  // array attribute still merges with its twin.
  return listTypes.has(before.type) && before.sameMarkup(after)
}

/** Absolute positions of every boundary between two joinable sibling lists. */
function collectJoinPositions(
  node: ProseMirrorNode,
  contentStart: number,
  listTypes: Set<NodeType>,
  out: number[],
): void {
  let previous: ProseMirrorNode | null = null
  node.forEach((child, offset) => {
    const start = contentStart + offset
    if (previous && isJoinablePair(previous, child, listTypes)) out.push(start)
    // A list can never live in inline content, so don't walk paragraph text.
    if (child.content.size > 0 && !child.type.inlineContent) {
      collectJoinPositions(child, start + 1, listTypes, out)
    }
    previous = child
  })
}

/**
 * Boundaries in `doc` where two adjacent same-kind lists can be joined,
 * ordered back-to-front so applying them leaves the earlier ones valid.
 */
function joinablePositions(doc: ProseMirrorNode, schema: Schema): number[] {
  const listTypes = listTypesIn(schema)
  if (listTypes.size === 0) return []

  const positions: number[] = []
  collectJoinPositions(doc, 0, listTypes, positions)
  return positions.sort((a, b) => b - a).filter((pos) => canJoin(doc, pos))
}

/**
 * Merge every pair of adjacent same-kind lists in `tr.doc`. Returns whether
 * anything was joined.
 */
function joinAdjacentListsIn(tr: Transaction, schema: Schema): boolean {
  const positions = joinablePositions(tr.doc, schema)
  for (const pos of positions) tr.join(pos)
  return positions.length > 0
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    listJoin: {
      /**
       * Merge every pair of adjacent same-kind lists in the document. Runs
       * automatically on every edit and when the editor view is created;
       * call it directly to repair a document in an editor that has not been
       * mounted yet (see `useEditor`).
       *
       * It sets no transaction metadata, so it composes in a chain without
       * changing how the caller's own edit is recorded. Repairing a document
       * on open is not the user's edit — mark that at the call site:
       * `chain().joinAdjacentLists().setMeta('preventUpdate', true)
       *   .setMeta('addToHistory', false).run()`
       */
      joinAdjacentLists: () => ReturnType
    }
  }
}

/**
 * Keeps adjacent lists of the same kind merged into a single list.
 *
 * ProseMirror never re-joins siblings on its own, so any edit that splits a
 * list — lifting an item out, then deleting the paragraph it left behind —
 * leaves two `orderedList` nodes touching each other. Both render with
 * `start: 1`, so the tail of the list silently restarts its numbering.
 */
export const ListJoin = Extension.create({
  name: 'listJoin',

  addCommands() {
    return {
      joinAdjacentLists:
        () =>
        ({ tr, dispatch }) => {
          // Answer without touching `tr` when this is only a probe: a
          // `can().chain()` shares one transaction, so joining here would test
          // every later command against an already-joined document.
          const positions = joinablePositions(tr.doc, tr.doc.type.schema)
          if (positions.length === 0) return false
          if (!dispatch) return true

          for (const pos of positions) tr.join(pos)
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('listJoin'),
        /**
         * Initial content is parsed straight into the state, with no
         * transaction, so `appendTransaction` never sees it. A document saved
         * back while this bug was live would keep rendering `1.` mid-list —
         * until the first keystroke, and forever in a read-only editor.
         *
         * This runs synchronously as the view is created, so the first paint
         * is already correct. It does not cover an editor built with
         * `element: null`, which has no view and, until it mounts, no plugins
         * at all — `useEditor` runs the command directly for that.
         */
        view: (view) => {
          const tr = view.state.tr
          if (joinAdjacentListsIn(tr, view.state.schema)) {
            // Repairing a document on open is not the user's edit: keep it out
            // of the `update` event and out of the undo stack. The `transaction`
            // event still fires — dirty-tracking should listen to `update`.
            view.dispatch(
              tr.setMeta('preventUpdate', true).setMeta('addToHistory', false),
            )
          }
          return {}
        },
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null
          }
          // A remote peer's edit arrives as a local transaction. That peer runs
          // this same plugin, and its join replicates on its own — joining here
          // as well means two peers moving the same nodes concurrently, which
          // is a duplicate-content shape rather than a converging one.
          if (isRemoteChange(transactions, newState)) return null

          const tr = newState.tr
          return joinAdjacentListsIn(tr, newState.schema) ? tr : null
        },
      }),
    ]
  },
})

export default ListJoin
