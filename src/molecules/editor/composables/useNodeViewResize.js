/**
 * Aspect-ratio-locked resize-drag for media / embed node views.
 *
 * Behavior preserved from `MediaNodeView.vue` + `IframeNodeView.vue`:
 * - `startResize` (on the handle's `pointerdown`) records the start X and the
 *   element's current `offsetWidth`, locks the aspect ratio, and registers
 *   `mousemove` / `mouseup` listeners on `window` plus an `ew-resize` body cursor.
 * - `mousemove` applies temporary inline `width`/`height` to the element for
 *   live visual feedback, clamping width between `minWidth` and the editor's
 *   content width (minus `maxWidthPadding`).
 * - `mouseup` reads the final rendered size, clears the temporary inline styles,
 *   and commits via `onCommit` — guarded by `safeGetPos` so a stale node view
 *   never writes back into the document.
 *
 * Window listeners are removed on stop AND on `onUnmounted`, fixing the leak
 * where a drag interrupted by unmount left handlers attached to `window`.
 */
import { ref, onUnmounted } from 'vue';
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view';
export function useNodeViewResize(editor, args) {
    const isResizing = ref(false);
    const minWidth = args.minWidth ?? 50;
    const maxWidthPadding = args.maxWidthPadding ?? 0;
    let startDragX = 0;
    let startWidth = 0;
    let aspectRatio = 1;
    let dragDirection = 1;
    function startResize(event, edge = 'right') {
        if (!editor.isEditable)
            return;
        const el = args.mediaEl();
        if (!el)
            return;
        isResizing.value = true;
        startDragX = event.clientX;
        startWidth = el.offsetWidth;
        // Lock the ratio to the element's painted box so the drag preserves the
        // exact shape on screen. Falls back to the supplied aspect only when the
        // element isn't laid out yet (offsetWidth 0). Reading the rendered size
        // avoids the stored-attrs mismatch (e.g. a node with width but no height,
        // whose true height comes from CSS `height: auto`) that distorted media
        // mid-drag — it became "wide" while dragging, then snapped back on release.
        const renderedAspect = el.offsetWidth ? el.offsetHeight / el.offsetWidth : 0;
        aspectRatio = renderedAspect || args.getAspectRatio() || 1;
        // Dragging the LEFT handle outward moves the pointer left (negative
        // clientX delta) but should grow the node — invert the delta.
        dragDirection = edge === 'left' ? -1 : 1;
        window.addEventListener('pointermove', handleResize);
        window.addEventListener('pointerup', stopResize);
        window.addEventListener('pointercancel', stopResize);
        document.body.style.cursor = 'ew-resize';
    }
    function handleResize(event) {
        if (!isResizing.value)
            return;
        const el = args.mediaEl();
        if (!el)
            return;
        const editorWidth = editor.view.dom.clientWidth;
        const deltaX = (event.clientX - startDragX) * dragDirection;
        const newWidth = Math.max(minWidth, Math.min(startWidth + deltaX, editorWidth - maxWidthPadding));
        const newHeight = newWidth * aspectRatio;
        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
        // Grow the clipping wrapper in lockstep so the live drag isn't clipped.
        const container = args.containerEl?.();
        if (container)
            container.style.width = `${newWidth}px`;
    }
    function stopResize() {
        if (!isResizing.value)
            return;
        isResizing.value = false;
        removeWindowListeners();
        document.body.style.cursor = '';
        const el = args.mediaEl();
        if (!el)
            return;
        // Capture final dimensions while the temporary inline styles still apply.
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        if (safeGetPos(args.getPos) === null) {
            // No commit happened — drop the drag styles so the (possibly stale)
            // view falls back to its bound size.
            el.style.width = '';
            el.style.height = '';
            const container = args.containerEl?.();
            if (container)
                container.style.width = '';
            return;
        }
        onCommitGuarded(width, height);
        // Container width and a 'style'-sized media element are owned by Vue
        // `:style` bindings on the SAME properties the drag wrote. Their inline
        // values already equal the committed size, so leave them in place — the
        // next binding VALUE change overwrites them. Clearing them here used to
        // race the commit re-render: Vue wrote the committed width first, the
        // deferred clear wiped it, and Vue never re-writes an unchanged value —
        // leaving the block container at full editor width until some later
        // value-changing render (the "huge ring around a small image" bug).
        //
        // Only an 'attribute'-sized media element (img/video, width=/height=)
        // needs its inline styles cleared, or they'd mask future attribute
        // updates. rAF defers that past the commit re-render so the old attribute
        // size never paints (clearing synchronously flashed a page jump).
        if ((args.mediaSizing ?? 'attribute') === 'attribute') {
            requestAnimationFrame(() => {
                el.style.width = '';
                el.style.height = '';
            });
        }
    }
    function onCommitGuarded(width, height) {
        args.onCommit({ width, height });
    }
    function removeWindowListeners() {
        window.removeEventListener('pointermove', handleResize);
        window.removeEventListener('pointerup', stopResize);
        window.removeEventListener('pointercancel', stopResize);
    }
    onUnmounted(() => {
        removeWindowListeners();
        if (isResizing.value)
            document.body.style.cursor = '';
    });
    return { isResizing, startResize };
}
