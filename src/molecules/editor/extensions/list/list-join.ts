import { Extension } from '@tiptap/core'
import type {
  Node as ProseMirrorNode,
  NodeType,
  Schema,
} from '@tiptap/pm/model'
import { Plugin, PluginKey, type EditorState } from '@tiptap/pm/state'
import type { Transaction } from '@tiptap/pm/state'
import { canJoin } from '@tiptap/pm/transform'

const LIST_NODE_NAMES = ['bulletList', 'orderedList', 'taskList']

function listTypesIn(schema: Schema): Set<NodeType> {
  return new Set(
    LIST_NODE_NAMES.map((name) => schema.nodes[name]).filter(
      (type): type is NodeType => Boolean(type),
    ),
  )
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
  if (before.type !== after.type || !listTypes.has(before.type)) return false
  const keys = new Set([
    ...Object.keys(before.attrs),
    ...Object.keys(after.attrs),
  ])
  for (const key of keys) {
    if (before.attrs[key] !== after.attrs[key]) return false
  }
  return true
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
 * Transaction that merges every pair of adjacent same-kind lists in `state`,
 * or `null` when the document already has none.
 */
function joinAdjacentLists(
  state: EditorState,
  listTypes: Set<NodeType>,
): Transaction | null {
  const positions: number[] = []
  collectJoinPositions(state.doc, 0, listTypes, positions)
  if (positions.length === 0) return null

  const tr = state.tr
  // Join back-to-front so each join leaves the earlier positions valid.
  for (const pos of positions.sort((a, b) => b - a)) {
    if (canJoin(tr.doc, pos)) tr.join(pos)
  }
  return tr.docChanged ? tr : null
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

  addProseMirrorPlugins() {
    const listTypes = listTypesIn(this.editor.schema)
    if (listTypes.size === 0) return []

    return [
      new Plugin({
        key: new PluginKey('listJoin'),
        /**
         * Initial content is parsed straight into the state, with no
         * transaction, so `appendTransaction` never sees it. A document saved
         * back while this bug was live would keep rendering `1.` mid-list —
         * until the first keystroke, and forever in a read-only editor.
         * Repair it here: this runs synchronously as the view is created, so
         * the first paint is already correct.
         */
        view: (view) => {
          const tr = joinAdjacentLists(view.state, listTypes)
          if (tr) {
            // `preventUpdate` keeps the repair out of the `update` event:
            // opening a document must not mark it dirty or fire an autosave
            // the user never asked for. Any later edit saves the fixed doc.
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
          return joinAdjacentLists(newState, listTypes)
        },
      }),
    ]
  },
})

export default ListJoin
