import { getMarkRange } from '@tiptap/core';
import { mapStoredRange } from '#molecules/editor/extensions/shared/node-view';
import { openLinkPopup } from './link-popup-controller';
/**
 * Build the `openLinkEditor` command for the given link mark type.
 *
 * Behaviour:
 *  - Collapsed cursor inside a link → select the whole link, then open the
 *    popup on the next frame (so the selection rect is painted first).
 *  - Collapsed cursor NOT inside a link → no-op, returns `false`.
 *  - Non-empty selection → open the popup over the selection.
 *
 * The captured `{ from, to }` is re-mapped through the live document via
 * {@link mapStoredRange} at apply time, because the popup resolves
 * asynchronously and the document may have changed. Every chain that runs
 * after the `await` is guarded by `editor.isDestroyed`.
 */
export function buildOpenLinkEditor(markType) {
    return (options) => ({ editor }) => {
        const { state } = editor;
        const { from, to } = state.selection;
        let range;
        let delay = false;
        if (from === to) {
            const markRange = getMarkRange(state.selection.$from, markType);
            if (!markRange)
                return false;
            range = { from: markRange.from, to: markRange.to };
            editor
                .chain()
                .setTextSelection({ from: range.from, to: range.to })
                .run();
            delay = true;
        }
        else {
            range = { from, to };
        }
        const existingHref = editor.getAttributes('link').href || null;
        const show = () => {
            void openLinkPopup({
                href: existingHref,
                startInEdit: options?.startInEdit ?? !existingHref,
                anchor: editor.view.dom,
                virtualReference: selectionReference(editor, range),
                onEscape: () => {
                    // Escape leaves focus on <body>; return it to the editor so the
                    // user can keep typing where they left off.
                    if (!editor.isDestroyed) {
                        editor.commands.focus(null, { scrollIntoView: false });
                    }
                },
            }).then((href) => {
                // Cancelled, or the editor went away while the popup was open.
                if (href === null || editor.isDestroyed)
                    return;
                applyLink(editor, range, href);
            });
        };
        if (delay)
            requestAnimationFrame(show);
        else
            show();
        return true;
    };
}
function selectionReference(editor, range) {
    let lastRect = editor.view.dom.getBoundingClientRect();
    return {
        getBoundingClientRect: () => {
            if (editor.isDestroyed)
                return lastRect;
            try {
                lastRect = selectionRect(editor, range);
            }
            catch {
                // Floating UI may ask for one more frame during teardown. Keep returning
                // the last known rect instead of throwing from a destroyed EditorView.
            }
            return lastRect;
        },
    };
}
function selectionRect(editor, range) {
    const { from, to } = mapStoredRange(editor.state, range);
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const top = Math.min(start.top, end.top);
    const bottom = Math.max(start.bottom, end.bottom);
    const left = Math.min(start.left, end.left);
    const right = Math.max(start.right, end.right);
    return {
        width: Math.max(right - left, 0),
        height: Math.max(bottom - top, start.bottom - start.top),
        top,
        right,
        bottom,
        left,
        x: left,
        y: top,
        toJSON: () => ({}),
    };
}
/**
 * Apply the popup result to the document, re-mapping the captured range into
 * the current document first. `href === ''` removes the link; a non-empty
 * href sets/updates it. Stored marks are cleared so typing after the link is
 * not unexpectedly linked.
 */
function applyLink(editor, storedRange, href) {
    const { from, to } = mapStoredRange(editor.state, storedRange);
    const chain = editor.chain().focus(null, { scrollIntoView: false });
    if (href === '') {
        chain
            .setTextSelection({ from, to })
            .unsetLink()
            .command(({ tr }) => {
            tr.setStoredMarks([]);
            return true;
        })
            .run();
        return;
    }
    chain
        .setTextSelection({ from, to })
        .setLink({ href })
        .setTextSelection(to)
        .command(({ tr }) => {
        tr.setStoredMarks([]);
        return true;
    })
        .run();
}
