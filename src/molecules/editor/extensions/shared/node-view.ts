/**
 * Shared node-view position / dispatch guards.
 *
 * Used by every node view and extension that does ProseMirror position math.
 * All functions are pure / side-effect-free except `dispatchIfAlive`.
 */
import type { EditorState, Transaction } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'

/**
 * TipTap v3 node views expose `getPos` as `() => number | undefined`.
 * Normalize to `number | null`, rejecting `undefined` and `NaN`, so callers
 * can safely guard position math (`if (pos === null) return`).
 */
export function safeGetPos(getPos: () => number | undefined): number | null {
  const pos = getPos()
  if (pos === undefined || Number.isNaN(pos)) return null
  return pos
}

/**
 * Walk the document and return the position of the first node of `typeName`
 * whose attribute `attr` strictly equals `value`. Returns `null` if none match.
 */
export function findNodeByAttr(
  view: EditorView,
  typeName: string,
  attr: string,
  value: unknown,
): number | null {
  let found: number | null = null
  view.state.doc.descendants((node: Node, pos: number) => {
    if (found !== null) return false
    if (node.type.name === typeName && node.attrs[attr] === value) {
      found = pos
      return false
    }
    return true
  })
  return found
}

/**
 * Convenience wrapper: find a node of `typeName` by its `uploadId` attribute.
 */
export function findNodeByUploadId(
  view: EditorView,
  typeName: string,
  uploadId: string,
): number | null {
  return findNodeByAttr(view, typeName, 'uploadId', uploadId)
}

/**
 * Dispatch a transaction only if the view is still alive. Use after any
 * `await` / `.then()` to avoid dispatching into a destroyed view.
 * Returns whether the transaction was dispatched.
 */
export function dispatchIfAlive(view: EditorView, tr: Transaction): boolean {
  if (view.isDestroyed) return false
  view.dispatch(tr)
  return true
}

/**
 * Read an extension's configured `HTMLAttributes` by name. Replaces the inline
 * `extensionManager.extensions.find(...)` duplicates (e.g. in the toc view).
 * Returns an empty object when the extension or its attributes are absent.
 */
export function getExtensionHTMLAttributes(
  editor: Editor,
  name: string,
): Record<string, unknown> {
  const extension = editor.extensionManager?.extensions.find(
    (ext) => ext.name === name,
  )
  const options = extension?.options as
    | { HTMLAttributes?: Record<string, unknown> }
    | undefined
  return options?.HTMLAttributes ?? {}
}

/**
 * Map a stored `{ from, to }` range through the current document. Use when an
 * async command captured a range earlier and must write back into a document
 * that may have changed in the meantime.
 */
export function mapStoredRange(
  state: EditorState,
  range: { from: number; to: number },
): { from: number; to: number } {
  const size = state.doc.content.size
  const from = Math.min(Math.max(range.from, 0), size)
  const to = Math.min(Math.max(range.to, from), size)
  return { from, to }
}
