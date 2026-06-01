/**
 * Absolutize root-relative media `src`s inside a pasted/copied fragment.
 *
 * When content is copied out of the editor, image/video nodes whose `src` is a
 * site-root-relative path (`/files/foo.png`) become unusable once pasted into a
 * different origin. `absolutizeMediaSrcs` rewrites those to absolute URLs using
 * the supplied origin, recursing into child content. Nodes are only `copy()`-ed
 * when their `src` actually changes, so untouched subtrees keep their identity.
 */
import { Fragment } from '@tiptap/pm/model'
import type { Node } from '@tiptap/pm/model'

const MEDIA_NODES = new Set(['image', 'video'])

/**
 * Return a fragment with every root-relative media `src` rewritten to
 * `${origin}${src}`. Returns the same fragment reference when nothing changed.
 */
export function absolutizeMediaSrcs(
  fragment: Fragment,
  origin: string,
): Fragment {
  const children: Node[] = []
  let changed = false

  fragment.forEach((node) => {
    let next = node

    if (MEDIA_NODES.has(node.type.name)) {
      const src = node.attrs.src as string | null | undefined
      if (typeof src === 'string' && src.startsWith('/')) {
        next = node.type.create(
          { ...node.attrs, src: `${origin}${src}` },
          node.content,
          node.marks,
        )
        changed = true
      }
    }

    if (node.content.size > 0) {
      const newContent = absolutizeMediaSrcs(next.content, origin)
      if (newContent !== next.content) {
        next = next.copy(newContent)
        changed = true
      }
    }

    children.push(next)
  })

  return changed ? Fragment.fromArray(children) : fragment
}
