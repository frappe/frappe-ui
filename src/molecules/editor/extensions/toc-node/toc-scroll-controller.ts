/**
 * Imperative scroll-to-heading glue for the table-of-contents node view.
 *
 * Resolves the heading element (preferring the stable `data-toc-id`, then `id`,
 * then a DOM walk from the document position), moves the selection there, and
 * scrolls the container into view. Uses `CSS.escape` so ids with special
 * characters can't break the selector.
 */
import type { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import type { HeadingInfo } from '@molecules/editor/extensions/shared/heading-scope'

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6'
const SCROLL_OFFSET = 20

function escapeId(id: string): string {
  return typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(id)
    : id.replace(/["\\]/g, '\\$&')
}

/** Locate the DOM element for `anchor`, or `null` if it can't be resolved. */
function resolveHeadingElement(
  editor: Editor,
  anchor: HeadingInfo,
): Element | null {
  const editorDom = editor.view.dom

  if (anchor.id) {
    const escaped = escapeId(anchor.id)
    const byAttr =
      editorDom.querySelector(`[data-toc-id="${escaped}"]`) ||
      editorDom.querySelector(`#${escaped}`)
    if (byAttr) return byAttr
  }

  const domPos = editor.view.domAtPos(anchor.pos)
  if (domPos.node && domPos.node.nodeType === Node.ELEMENT_NODE) {
    const node = domPos.node as Element
    const heading = node.matches(HEADING_SELECTOR)
      ? node
      : node.closest(HEADING_SELECTOR)
    if (heading) return heading
  }

  const all = Array.from(editorDom.querySelectorAll(HEADING_SELECTOR))
  return (
    all.find((el) => el.textContent?.trim() === anchor.text) ?? null
  )
}

/** Scroll `element` into view within `container` (falls back to native). */
function scrollElementIntoView(
  element: Element,
  container: HTMLElement | null,
): void {
  if (container) {
    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const top =
      elementRect.top - containerRect.top + container.scrollTop - SCROLL_OFFSET
    container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    return
  }
  element.scrollIntoView({ block: 'start', inline: 'nearest' })
}

/**
 * Move the selection to `anchor`'s position, focus the editor, and scroll the
 * heading into view inside `container`.
 */
export function scrollToHeading(
  editor: Editor,
  anchor: HeadingInfo,
  container: HTMLElement | null,
): void {
  if (editor.isDestroyed) return
  const view = editor.view
  const pos = anchor.pos
  if (pos < 0 || pos > view.state.doc.content.size) return

  const tr = view.state.tr
  tr.setSelection(TextSelection.create(tr.doc, pos))
  view.dispatch(tr)
  view.focus()

  const element = resolveHeadingElement(editor, anchor)
  if (element) scrollElementIntoView(element, container)
}
