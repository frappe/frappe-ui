/**
 * Draws ONE rounded box around a multi-cell selection instead of ringing each
 * cell on its own.
 *
 * prosemirror-tables flags every selected cell with `.selectedCell`, which by
 * default we paint with a translucent fill + a per-cell ring (see style.css).
 * For a 2+ cell selection that reads as a grid of boxes. Here we instead:
 *  - add a `table-cell-range` class to the editor so the per-cell ring is
 *    suppressed (the fill stays, so the region reads as one block), and
 *  - overlay a single element spanning the union of the selected cells' rects,
 *    appended to the `.tableWrapper` (a positioned, scrollable ancestor) so it
 *    tracks horizontal scroll for free.
 *
 * A single selected cell (navigate mode) is left untouched — it keeps its ring.
 */
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import type { EditorView } from '@tiptap/pm/view'

interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

class SelectionOverlay {
  private el: HTMLElement | null = null

  constructor(private view: EditorView) {
    this.update(view)
  }

  update(view: EditorView): void {
    const { selection } = view.state
    const isRange =
      selection instanceof CellSelection &&
      selection.$anchorCell.pos !== selection.$headCell.pos
    view.dom.classList.toggle('table-cell-range', isRange)
    if (!isRange) {
      this.remove()
      return
    }
    this.draw(view, selection as CellSelection)
  }

  private draw(view: EditorView, selection: CellSelection): void {
    let union: Rect | null = null
    selection.forEachCell((_cell, pos) => {
      const dom = view.nodeDOM(pos)
      if (!(dom instanceof HTMLElement)) return
      const r = dom.getBoundingClientRect()
      union = union
        ? {
            left: Math.min(union.left, r.left),
            top: Math.min(union.top, r.top),
            right: Math.max(union.right, r.right),
            bottom: Math.max(union.bottom, r.bottom),
          }
        : { left: r.left, top: r.top, right: r.right, bottom: r.bottom }
    })
    if (!union) {
      this.remove()
      return
    }

    const anchorDom = view.nodeDOM(selection.$anchorCell.pos)
    const host =
      (anchorDom instanceof HTMLElement
        ? (anchorDom.closest('.tableWrapper') as HTMLElement | null)
        : null) ?? (view.dom as HTMLElement)
    const hostRect = host.getBoundingClientRect()

    // Convert viewport rect → host content coordinates (so the box scrolls with
    // the wrapper's horizontal overflow).
    const box: Rect = union
    const el = this.ensure(host)
    el.style.left = `${box.left - hostRect.left + host.scrollLeft}px`
    el.style.top = `${box.top - hostRect.top + host.scrollTop}px`
    el.style.width = `${box.right - box.left}px`
    el.style.height = `${box.bottom - box.top}px`
  }

  private ensure(host: HTMLElement): HTMLElement {
    if (this.el && this.el.parentElement === host) return this.el
    this.remove()
    const el = document.createElement('div')
    el.className = 'table-selection-box'
    el.setAttribute('aria-hidden', 'true')
    host.appendChild(el)
    this.el = el
    return el
  }

  private remove(): void {
    this.el?.remove()
    this.el = null
  }

  destroy(): void {
    this.view.dom.classList.remove('table-cell-range')
    this.remove()
  }
}

export const TableSelectionOverlay = Extension.create({
  name: 'tableSelectionOverlay',
  addProseMirrorPlugins() {
    return [new Plugin({ view: (view) => new SelectionOverlay(view) })]
  },
})

export { TableSelectionOverlay as default }
