/**
 * Pure(-ish) document operations for the media upload pipeline.
 *
 * Extracted from `media-upload-engine.ts` to keep that module ≤300 lines. Each
 * function is parameterized by the schema `nodeName` so it serves both image and
 * video. All post-`await` dispatches go through `dispatchIfAlive`; these
 * functions are only ever called after the view-alive check, but route through
 * the guard anyway so they are safe to reuse.
 */
import type { EditorView } from '@tiptap/pm/view'
import {
  dispatchIfAlive,
  findNodeByUploadId,
} from '#molecules/editor/extensions/shared/node-view'
import type { MediaDimensions } from '#molecules/editor/extensions/shared/media-dimensions'
import type {
  InsertMode,
  UploadedFile,
} from '#molecules/editor/extensions/shared/media-upload-types'

/** Optional intrinsic dimensions (null when the probe failed). */
export interface OptionalDimensions {
  width: number | null
  height: number | null
  poster?: string
}

/**
 * Find a node of `nodeName` by `src` (or by `uploadId` when provided). Returns
 * the position of the first match, else `null`.
 */
export function findNodeBySource(
  view: EditorView,
  nodeName: string,
  src: string,
  uploadId?: string,
): number | null {
  if (uploadId) return findNodeByUploadId(view, nodeName, uploadId)
  let found: number | null = null
  view.state.doc.descendants((node, pos) => {
    if (found !== null) return false
    if (node.type.name === nodeName && node.attrs.src === src) {
      found = pos
      return false
    }
    return true
  })
  return found
}

/** Back-fill width/height on the node at `pos` (no-op if already sized). */
export function backfillDimensions(
  view: EditorView,
  nodeName: string,
  pos: number,
  dims: MediaDimensions,
): void {
  const node = view.state.doc.nodeAt(pos)
  if (!node || node.type.name !== nodeName) return
  const attrs = node.attrs
  if (attrs.width != null && attrs.height != null) return
  dispatchIfAlive(
    view,
    view.state.tr.setNodeMarkup(pos, undefined, {
      ...attrs,
      width: attrs.width ?? dims.width,
      height: attrs.height ?? dims.height,
    }),
  )
}

/** Insert the loading placeholder node for an in-flight upload. */
export function insertPlaceholder(
  view: EditorView,
  nodeName: string,
  pos: number | null | undefined,
  mode: InsertMode,
  uploadId: string,
  dims: OptionalDimensions,
  attrs: Record<string, unknown> = {},
): void {
  const node = view.state.schema.nodes[nodeName].create({
    ...attrs,
    loading: true,
    uploadId,
    src: null,
    width: dims.width,
    height: dims.height,
  })
  const tr = view.state.tr
  if (mode === 'replace') {
    if (pos == null) tr.replaceSelectionWith(node)
    else {
      const nodeAtPos = view.state.doc.nodeAt(pos)
      if (nodeAtPos) tr.replaceWith(pos, pos + nodeAtPos.nodeSize, node)
    }
  } else if (pos != null) {
    tr.insert(pos, node)
  } else {
    tr.insert(view.state.selection.from, node)
  }
  dispatchIfAlive(view, tr)
}

/** Remove a loading placeholder after user cancellation. */
export function removeNodeByUploadId(
  view: EditorView,
  nodeName: string,
  uploadId: string,
): void {
  const pos = findNodeByUploadId(view, nodeName, uploadId)
  if (pos === null) return
  const node = view.state.doc.nodeAt(pos)
  if (!node) return
  dispatchIfAlive(view, view.state.tr.delete(pos, pos + node.nodeSize))
}

/** Write the uploaded src/dimensions back onto the placeholder node. */
export function applyUploadSuccess(
  view: EditorView,
  nodeName: string,
  uploadId: string,
  uploaded: UploadedFile,
): void {
  const pos = findNodeByUploadId(view, nodeName, uploadId)
  if (pos === null) return
  const node = view.state.doc.nodeAt(pos)
  if (!node) return
  dispatchIfAlive(
    view,
    view.state.tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      src: uploaded.file_url,
      width: uploaded.width || node.attrs.width,
      height: uploaded.height || node.attrs.height,
      loading: false,
      error: null,
    }),
  )
}

/** Mark the placeholder node as failed with an error message. */
export function applyUploadError(
  view: EditorView,
  nodeName: string,
  uploadId: string,
  message: string,
): void {
  const pos = findNodeByUploadId(view, nodeName, uploadId)
  if (pos === null) return
  const node = view.state.doc.nodeAt(pos)
  if (!node) return
  dispatchIfAlive(
    view,
    view.state.tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      loading: false,
      error: message,
    }),
  )
}
