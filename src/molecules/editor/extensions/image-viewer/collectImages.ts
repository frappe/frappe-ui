import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export interface ViewableImage {
  src: string
  alt: string | null
}

/**
 * Collect every viewable image in the document, in document order.
 *
 * Skips images that are not actually viewable: nodes with a null/empty `src`,
 * nodes still `loading`, and nodes in an `error` state. This keeps the viewer's
 * navigation list aligned with what the reader can see, and prevents the
 * "broken image" placeholders from polluting the gallery.
 */
export function collectViewableImages(
  doc: ProseMirrorNode,
): ViewableImage[] {
  const images: ViewableImage[] = []
  doc.descendants((node: ProseMirrorNode) => {
    if (node.type.name !== 'image') return true
    const src = node.attrs.src
    if (typeof src !== 'string' || src.length === 0) return true
    if (node.attrs.loading) return true
    if (node.attrs.error) return true
    images.push({ src, alt: node.attrs.alt ?? null })
    return true
  })
  return images
}

/**
 * Index of the first viewable image whose `src` matches `src`, or `0` when not
 * found (so the viewer still opens at a sensible position).
 */
export function indexOfSrc(images: ViewableImage[], src: string): number {
  const index = images.findIndex((image) => image.src === src)
  return index === -1 ? 0 : index
}
