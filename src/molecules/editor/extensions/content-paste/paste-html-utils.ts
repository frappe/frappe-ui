/**
 * Pure helpers for the HTML-paste path.
 *
 * No DOM mutation of the live document and no ProseMirror dispatch — these are
 * unit-testable string/DOM-fragment transforms used by
 * `paste-image-controller.ts` and `content-paste-extension.ts`.
 *
 * Pasted HTML comes from any page the user copied from. It is parsed into an
 * inert document (see {@link parseInert}), never into an element of the live
 * page, where `<img onerror>` and similar handlers would run.
 */
import { DOMParser, Slice } from '@tiptap/pm/model'
import type { Node, Schema } from '@tiptap/pm/model'

/**
 * Rewrite Google-Docs-style `font-size: Npt` declarations to pixels (96/72).
 * Returns the input unchanged when no `pt` font sizes are present.
 */
export function normalizeFontSizePtToPx(html: string): string {
  return html.replace(/font-size:\s*([\d.]+)pt/gi, (_match, pt: string) => {
    const px = Math.round((parseFloat(pt) * 96) / 72)
    return `font-size:${px}px`
  })
}

/** True iff the HTML string contains at least one `<img>` element. */
export function htmlContainsImage(html: string): boolean {
  return parseInert(html).querySelector('img') !== null
}

/**
 * Parse an HTML string into a ProseMirror {@link Slice} against `schema`,
 * applying the `pt`→`px` font-size normalization first. Whitespace is preserved
 * so pasted code/pre content survives.
 */
export function parseHtmlToSlice(html: string, schema: Schema): Slice {
  const body = parseInert(normalizeFontSizePtToPx(html))
  return DOMParser.fromSchema(schema).parseSlice(body, {
    preserveWhitespace: true,
  })
}

/** A located `image` node within an inserted slice (post-mapping doc position). */
export interface PastedImage {
  node: Node
  pos: number
  src: string
}

/**
 * Collect every `image` node inside `[from, to)` of `doc` whose `src` is a
 * `data:`/`blob:` URL (the only sources that must be re-uploaded). Each entry is
 * deduped by node identity so the same node is never queued twice.
 */
export function collectImageNodes(
  doc: Node,
  from: number,
  to: number,
): PastedImage[] {
  const seen = new Set<Node>()
  const images: PastedImage[] = []
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name !== 'image') return
    if (seen.has(node)) return
    const src = node.attrs.src as string | null | undefined
    if (typeof src !== 'string') return
    if (!src.startsWith('data:') && !src.startsWith('blob:')) return
    seen.add(node)
    images.push({ node, pos, src })
  })
  return images
}

/**
 * The `<body>` of `html` parsed by the browser's `DOMParser`. That document
 * has no browsing context: it runs no scripts or event handlers and loads no
 * images, so untrusted markup is safe to query and walk.
 */
function parseInert(html: string): HTMLElement {
  return new globalThis.DOMParser().parseFromString(html, 'text/html').body
}
