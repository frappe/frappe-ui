import { safeGetPos } from '#molecules/editor/extensions/shared/node-view';
/** Focus and move the selection to an absolute document position. */
function setCursorAt(editor, pos) {
    editor.commands.focus();
    editor.chain().setTextSelection(pos).scrollIntoView().run();
}
/**
 * Insert a paragraph immediately after the media node (Enter inside caption).
 */
export function createParagraphAfterMedia(editor, getPos) {
    const pos = safeGetPos(getPos);
    if (pos === null)
        return;
    editor.commands.focus();
    editor
        .chain()
        .setTextSelection(pos + 1)
        .createParagraphNear()
        .scrollIntoView()
        .run();
}
/** Move the cursor just after the media node (Escape / ArrowDown). */
export function setCursorAfterMedia(editor, getPos) {
    const pos = safeGetPos(getPos);
    if (pos === null)
        return;
    setCursorAt(editor, pos + 1);
}
/** Move the cursor just before the media node (ArrowUp). */
export function setCursorBeforeMedia(editor, getPos) {
    const pos = safeGetPos(getPos);
    if (pos === null)
        return;
    setCursorAt(editor, pos - 1);
}
/** Select the media node itself (click). */
export function selectMedia(editor, getPos) {
    const pos = safeGetPos(getPos);
    if (pos === null)
        return;
    editor.commands.setNodeSelection(pos);
}
/**
 * Set media alignment on the hosted node. Both node types declare an `align`
 * attribute, so this dispatches a plain `updateAttributes` against whichever
 * type the node view hosts (no per-type command needed).
 */
export function setMediaAlign(editor, isVideo, align) {
    editor.commands.updateAttributes(isVideo ? 'video' : 'image', { align });
}
/**
 * Handle a keydown inside the caption input. Mirrors the original node view's
 * keymap: Enter → paragraph after; Escape/ArrowDown → cursor after;
 * ArrowUp → cursor before; Backspace on empty caption → toggle caption off.
 */
export function handleCaptionKeydown(event, actions) {
    if (event.key === 'Enter') {
        event.preventDefault();
        actions.onParagraphAfter();
    }
    else if (event.key === 'Escape' || event.key === 'ArrowDown') {
        event.preventDefault();
        actions.onCursorAfter();
    }
    else if (event.key === 'ArrowUp') {
        event.preventDefault();
        actions.onCursorBefore();
    }
    else if (event.key === 'Backspace' && actions.getCaption() === '') {
        event.preventDefault();
        actions.onToggleCaption();
    }
}
