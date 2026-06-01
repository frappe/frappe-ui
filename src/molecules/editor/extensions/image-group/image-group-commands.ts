/**
 * ProseMirror command builders for the image-group node.
 *
 * The extension's `addCommands` delegates here; the node view drives edit-save
 * and per-image removal through these too. All position math uses `safeGetPos`
 * and maps through `tr.mapping` so interleaved content between images (e.g. a
 * heading) can never corrupt the delete/insert positions.
 */
import type { CommandProps, RawCommands } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import { safeGetPos } from '@molecules/editor/extensions/shared/node-view'
import { clampColumns } from './image-group-utils'
import type { ExistingImage } from '@molecules/editor/extensions/shared/upload-types'

const IMAGE_GROUP = 'imageGroup'

/** Build the node-spec content for a list of images. */
function imageContent(images: ExistingImage[]): {
  type: string
  attrs: { src: string; alt: string }
}[] {
  return images.map((img) => ({
    type: 'image',
    attrs: { src: img.src, alt: img.alt },
  }))
}

/** `setImageGroup(attrs)` — insert a gallery node at the selection. */
export function buildSetImageGroup(
  nodeName: string,
): (attrs: {
  columns?: number
  images: { src: string; alt?: string }[]
}) => (props: CommandProps) => boolean {
  return (attrs) =>
    ({ commands }) =>
      commands.insertContent({
        type: nodeName,
        attrs: { columns: clampColumns(attrs.columns) },
        content: attrs.images.map((img) => ({
          type: 'image',
          attrs: { src: img.src, alt: img.alt ?? '' },
        })),
      })
}

/**
 * `groupSelectedImages()` — collect the images in the current selection and
 * replace them with one gallery node.
 *
 * Images are inline nodes, so the group block must be inserted via the
 * slice-based `insertContentAt` (which splits the surrounding paragraph) rather
 * than a raw `tr.insert` at an inline position. Deletions run in descending
 * position order so an earlier delete never shifts a later one, then the insert
 * position is mapped through the chain's accumulated mapping. Returns the
 * command's actual boolean result (the legacy version discarded it).
 */
export function buildGroupSelectedImages(
  nodeName: string,
): () => (props: CommandProps) => boolean {
  return () =>
    ({ state, chain }) => {
      const { from, to } = state.selection
      const collected: { src: string; alt: string; pos: number }[] = []
      state.doc.nodesBetween(from, to, (node: ProseMirrorNode, pos: number) => {
        if (node.type.name === 'image') {
          collected.push({
            src: node.attrs.src as string,
            alt: (node.attrs.alt as string) ?? '',
            pos,
          })
        }
      })

      if (collected.length < 2) return false

      const insertAnchor = Math.min(...collected.map((img) => img.pos))
      const descending = [...collected].sort((a, b) => b.pos - a.pos)

      let cmd = chain()
      for (const img of descending) {
        const node = state.doc.nodeAt(img.pos)
        if (node && node.type.name === 'image') {
          cmd = cmd.deleteRange({ from: img.pos, to: img.pos + node.nodeSize })
        }
      }
      return cmd
        .insertContentAt(insertAnchor, {
          type: nodeName,
          attrs: { columns: clampColumns(collected.length) },
          content: imageContent(
            collected.map((img) => ({ src: img.src, alt: img.alt })),
          ),
        })
        .run()
    }
}

/**
 * Replace a gallery node's children + columns (edit-save path). Returns whether
 * the command ran. Used from the node view after the edit dialog resolves.
 */
export function replaceImageGroup(
  editor: Editor,
  getPos: () => number | undefined,
  data: { images: ExistingImage[]; columns: number },
): boolean {
  if (editor.isDestroyed) return false
  return editor.commands.command(({ tr, state, dispatch }) => {
    const pos = safeGetPos(getPos)
    if (pos === null) return false
    const node = state.doc.nodeAt(pos)
    if (!node || node.type.name !== IMAGE_GROUP) return false
    const newNode = node.type.create(
      { ...node.attrs, columns: clampColumns(data.columns) },
      data.images.map((img) =>
        state.schema.nodes.image.create({ src: img.src, alt: img.alt }),
      ),
    )
    tr.replaceWith(pos, pos + node.nodeSize, newNode)
    if (dispatch) dispatch(tr)
    return true
  })
}

/**
 * Remove the image at `index` from the gallery. Deletes the whole gallery node
 * when it would otherwise be left empty. Returns whether the command ran.
 */
export function removeImageAt(
  editor: Editor,
  getPos: () => number | undefined,
  index: number,
): boolean {
  if (editor.isDestroyed) return false
  return editor.commands.command(({ tr, state, dispatch }) => {
    const pos = safeGetPos(getPos)
    if (pos === null) return false
    const node = state.doc.nodeAt(pos)
    if (!node || node.type.name !== IMAGE_GROUP) return false
    if (index < 0 || index >= node.childCount) return false

    if (node.childCount <= 1) {
      tr.delete(pos, pos + node.nodeSize)
      if (dispatch) dispatch(tr)
      return true
    }

    const kept: ProseMirrorNode[] = []
    node.forEach((child, _offset, i) => {
      if (i !== index) kept.push(child)
    })
    tr.replaceWith(pos + 1, pos + node.nodeSize - 1, kept)
    if (dispatch) dispatch(tr)
    return true
  })
}

/** Update the column count on the gallery node at `getPos`. */
export function setImageGroupColumns(
  editor: Editor,
  getPos: () => number | undefined,
  columns: number,
): boolean {
  if (editor.isDestroyed) return false
  return editor.commands.command(({ tr, state, dispatch }) => {
    const pos = safeGetPos(getPos)
    if (pos === null) return false
    const node = state.doc.nodeAt(pos)
    if (!node || node.type.name !== IMAGE_GROUP) return false
    tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      columns: clampColumns(columns),
    })
    if (dispatch) dispatch(tr)
    return true
  })
}

/** Build the `addCommands` record for the extension. */
export function buildImageGroupCommands(nodeName: string): Partial<RawCommands> {
  return {
    setImageGroup: buildSetImageGroup(nodeName),
    groupSelectedImages: buildGroupSelectedImages(nodeName),
  } as Partial<RawCommands>
}
