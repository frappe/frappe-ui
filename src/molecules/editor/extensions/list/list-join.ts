import { Extension } from '@tiptap/core'
import type { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { canJoin } from '@tiptap/pm/transform'

const LIST_NODE_NAMES = ['bulletList', 'orderedList', 'taskList']

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
    if (child.content.size > 0) {
      collectJoinPositions(child, start + 1, listTypes, out)
    }
    previous = child
  })
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
    const listTypes = new Set(
      LIST_NODE_NAMES.map((name) => this.editor.schema.nodes[name]).filter(
        (type): type is NodeType => Boolean(type),
      ),
    )
    if (listTypes.size === 0) return []

    return [
      new Plugin({
        key: new PluginKey('listJoin'),
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null
          }
          const positions: number[] = []
          collectJoinPositions(newState.doc, 0, listTypes, positions)
          if (positions.length === 0) return null

          const tr = newState.tr
          // Join back-to-front so each join leaves the earlier positions valid.
          for (const pos of positions.sort((a, b) => b - a)) {
            if (canJoin(tr.doc, pos)) tr.join(pos)
          }
          return tr.docChanged ? tr : null
        },
      }),
    ]
  },
})

export default ListJoin
