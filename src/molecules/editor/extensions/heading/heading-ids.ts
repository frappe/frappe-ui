/**
 * Stable heading ids — the blocking PRODUCER for the table-of-contents.
 *
 * Adds a global `id` attribute to `heading` nodes and assigns a STABLE id to any
 * heading that lacks one. The id is rendered to the DOM as both `id` and
 * `data-toc-id` so the toc can resolve a heading element regardless of position.
 *
 * Stability matters: the toc must NOT key on `heading-${pos}` (positions shift
 * on every edit). Ids are generated once and preserved through
 * serialization/round-trips via `parseHTML`/`renderHTML`.
 */
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Transaction } from '@tiptap/pm/state'
import type { Node } from '@tiptap/pm/model'

const HEADING = 'heading'

let counter = 0

/** Deterministic-per-session unique id; not position-derived. */
function createHeadingId(): string {
  counter += 1
  return `toc-${Date.now().toString(36)}-${counter.toString(36)}`
}

export const HeadingIds = Extension.create({
  name: 'headingIds',

  addGlobalAttributes() {
    return [
      {
        types: [HEADING],
        attributes: {
          id: {
            default: null,
            parseHTML: (element: HTMLElement) =>
              element.getAttribute('data-toc-id') ||
              element.getAttribute('id') ||
              null,
            renderHTML: (attributes: { id?: string | null }) => {
              if (!attributes.id) return {}
              return {
                id: attributes.id,
                'data-toc-id': attributes.id,
              }
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('headingIds'),
        appendTransaction: (_transactions, _oldState, newState) => {
          const seen = new Set<string>()
          const assignments: { pos: number; id: string }[] = []

          newState.doc.descendants((node: Node, pos: number) => {
            if (node.type.name !== HEADING) return true
            const current = node.attrs.id as string | null
            // Reassign when missing OR duplicated (e.g. after a copy/paste).
            if (current && !seen.has(current)) {
              seen.add(current)
              return false
            }
            const id = createHeadingId()
            seen.add(id)
            assignments.push({ pos, id })
            return false
          })

          if (assignments.length === 0) return null

          const tr: Transaction = newState.tr
          for (const { pos, id } of assignments) {
            const node = tr.doc.nodeAt(pos)
            if (!node) continue
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, id })
          }
          tr.setMeta('addToHistory', false)
          return tr
        },
      }),
    ]
  },
})

export default HeadingIds
