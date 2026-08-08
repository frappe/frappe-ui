const HEADING = 'heading';
const TAB = 'tab';
const TOC = 'tocNode';
/**
 * Read the active tab id via the host-injected `getCurrentTab` command.
 * Returns `null` when the command is absent or throws (no tabs in this host).
 */
export function getActiveTabId(editor) {
    const commands = editor.commands;
    if (typeof commands?.getCurrentTab !== 'function')
        return null;
    try {
        return commands.getCurrentTab() || null;
    }
    catch {
        return null;
    }
}
/**
 * Resolve the document range `{ start, end }` of the active tab node, or `null`
 * when there is no active tab (so headings are collected document-wide).
 */
export function getActiveTabRange(editor) {
    const activeTabId = getActiveTabId(editor);
    if (!activeTabId)
        return null;
    const doc = editor.state?.doc;
    if (!doc)
        return null;
    let range = null;
    doc.descendants((node, pos) => {
        if (range !== null)
            return false;
        if (node.type.name === TAB && node.attrs?.id === activeTabId) {
            range = { start: pos, end: pos + node.nodeSize };
            return false;
        }
        return true;
    });
    return range;
}
/**
 * Collect headings (level 1–6, non-empty text) in document order. When `range`
 * is provided, only headings inside `[start, end)` are returned. Pass
 * `getActiveTabRange(editor)` to scope to the active tab.
 */
export function collectHeadings(editor, range) {
    const doc = editor.state?.doc;
    if (!doc)
        return [];
    const headings = [];
    doc.descendants((node, pos) => {
        if (node.type.name === TOC)
            return false;
        if (node.type.name !== HEADING)
            return false;
        if (range && (pos < range.start || pos >= range.end))
            return false;
        const level = node.attrs?.level;
        const text = node.textContent?.trim();
        if (!text || !level || level < 1 || level > 6)
            return false;
        const id = node.attrs?.id || '';
        headings.push({ id, level, text, pos });
        return false;
    });
    return headings;
}
