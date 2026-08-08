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
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
class SelectionOverlay {
    view;
    el = null;
    // The box is measured from live cell rects, but only transactions reach
    // `update` — re-measure when the window reflows or the table itself resizes
    // (column drag, image load) so the box doesn't drift between edits.
    resizeObserver = null;
    observed = null;
    onResize = () => this.update(this.view);
    constructor(view) {
        this.view = view;
        window.addEventListener('resize', this.onResize);
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.update(this.view));
        }
        this.update(view);
    }
    update(view) {
        this.view = view;
        const { selection } = view.state;
        const isRange = selection instanceof CellSelection &&
            selection.$anchorCell.pos !== selection.$headCell.pos;
        view.dom.classList.toggle('table-cell-range', isRange);
        if (!isRange) {
            this.remove();
            return;
        }
        this.draw(view, selection);
    }
    draw(view, selection) {
        let union = null;
        selection.forEachCell((_cell, pos) => {
            const dom = view.nodeDOM(pos);
            if (!(dom instanceof HTMLElement))
                return;
            const r = dom.getBoundingClientRect();
            union = union
                ? {
                    left: Math.min(union.left, r.left),
                    top: Math.min(union.top, r.top),
                    right: Math.max(union.right, r.right),
                    bottom: Math.max(union.bottom, r.bottom),
                }
                : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        });
        if (!union) {
            this.remove();
            return;
        }
        const anchorDom = view.nodeDOM(selection.$anchorCell.pos);
        const host = (anchorDom instanceof HTMLElement
            ? anchorDom.closest('.tableWrapper')
            : null) ?? view.dom;
        const hostRect = host.getBoundingClientRect();
        this.observe(host);
        // Convert viewport rect → host content coordinates (so the box scrolls with
        // the wrapper's horizontal overflow).
        const box = union;
        const el = this.ensure(host);
        el.style.left = `${box.left - hostRect.left + host.scrollLeft}px`;
        el.style.top = `${box.top - hostRect.top + host.scrollTop}px`;
        el.style.width = `${box.right - box.left}px`;
        el.style.height = `${box.bottom - box.top}px`;
    }
    ensure(host) {
        if (this.el && this.el.parentElement === host)
            return this.el;
        this.remove();
        const el = document.createElement('div');
        el.className = 'table-selection-box';
        el.setAttribute('aria-hidden', 'true');
        host.appendChild(el);
        this.el = el;
        return el;
    }
    observe(host) {
        if (!this.resizeObserver || this.observed === host)
            return;
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(host);
        this.observed = host;
    }
    remove() {
        this.el?.remove();
        this.el = null;
        this.resizeObserver?.disconnect();
        this.observed = null;
    }
    destroy() {
        this.view.dom.classList.remove('table-cell-range');
        this.remove();
        window.removeEventListener('resize', this.onResize);
        this.resizeObserver = null;
    }
}
export const TableSelectionOverlay = Extension.create({
    name: 'tableSelectionOverlay',
    addProseMirrorPlugins() {
        return [new Plugin({ view: (view) => new SelectionOverlay(view) })];
    },
});
export { TableSelectionOverlay as default };
