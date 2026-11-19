import {
  getHTMLFromFragment,
  type Editor,
  type JSONContent,
} from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import { Transform } from '@tiptap/pm/transform'

export type ContentFormat = 'html' | 'json' | 'markdown'

const MEDIA_NODES = new Set(['image', 'video'])

/** Nodes that must hold at least one media node, such as an image gallery. */
const MEDIA_GROUPS = new Set(['imageGroup'])

/**
 * The document without images and videos that have no `src` yet: uploads that
 * are still running, or that failed.
 *
 * Those nodes stay in the editor so it can show their progress, or their error
 * with "Try again". Their `uploadId`, `loading` and `error` are editor state and
 * never reach HTML, so saved as a bare `<video>` they would load back as media
 * with nothing to show and nothing to retry. Returns `doc` itself when there is
 * nothing to drop.
 */
function withoutUnfinishedMedia(doc: PMNode): PMNode {
  const ranges: Array<[number, number]> = []
  doc.descendants((node, pos) => {
    // Emptied, a gallery would be refilled by ProseMirror with a new image
    // that has no `src`, so a gallery of unfinished uploads goes whole.
    const drop =
      isUnfinishedMedia(node) ||
      (MEDIA_GROUPS.has(node.type.name) && everyChildUnfinished(node))
    if (!drop) return true
    ranges.push([pos, pos + node.nodeSize])
    return false
  })
  if (!ranges.length) return doc
  const transform = new Transform(doc)
  for (const [from, to] of ranges.reverse()) transform.delete(from, to)
  return transform.doc
}

function isUnfinishedMedia(node: PMNode) {
  return MEDIA_NODES.has(node.type.name) && !node.attrs.src
}

function everyChildUnfinished(node: PMNode) {
  let every = true
  node.forEach((child) => {
    if (!isUnfinishedMedia(child)) every = false
  })
  return every
}

/**
 * The editor's content in `format`, as `v-model` and `change` carry it. Same as
 * `getHTML()`, `getJSON()` or `getMarkdown()`, except that unfinished uploads
 * are left out (see `withoutUnfinishedMedia`).
 */
export function serializeContent(
  editor: Editor,
  format: ContentFormat,
): string | JSONContent {
  const doc = withoutUnfinishedMedia(editor.state.doc)
  if (doc === editor.state.doc) {
    if (format === 'json') return editor.getJSON()
    if (format === 'markdown') return editor.getMarkdown()
    return editor.getHTML()
  }
  if (format === 'json') return doc.toJSON()
  if (format === 'markdown') return editor.markdown!.serialize(doc.toJSON())
  return getHTMLFromFragment(doc.content, editor.schema)
}
