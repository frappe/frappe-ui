/** Marks the painter copies across a selection. */
export const COPIED_MARKS = [
    'textStyle',
    'underline',
    'strike',
    'bold',
    'italic',
    'namedHighlight',
    'namedColor',
];
/** Block/node attributes the painter copies (paragraph spacing/line-height). */
export const PARAGRAPH_ATTRS = [
    'lineHeight',
    'spacingBefore',
    'spacingAfter',
];
/** Collect the marks present anywhere in `[from, to)`, keyed by mark name. */
export function collectMarks(state, from, to) {
    const marks = {};
    state.doc.nodesBetween(from, to, (node) => {
        node.marks.forEach((mark) => {
            marks[mark.type.name] = mark.attrs;
        });
    });
    return marks;
}
/** Collect the painter's block attributes from the parent of `from`. */
export function collectBlockAttrs(state, from) {
    const parentAttrs = state.doc.resolve(from).parent.attrs;
    const attrs = {};
    PARAGRAPH_ATTRS.forEach((attr) => {
        if (parentAttrs[attr] !== undefined)
            attrs[attr] = parentAttrs[attr];
    });
    return attrs;
}
/** Remove every {@link COPIED_MARKS} mark across `[from, to)` on `tr`. */
function removeCopiedMarks(state, tr, from, to) {
    COPIED_MARKS.forEach((markName) => {
        const markType = state.schema.marks[markName];
        if (markType)
            tr.removeMark(from, to, markType);
    });
}
/**
 * Apply a captured style payload across `[from, to)`: clear the copyable marks,
 * re-add the stored marks, and overlay the stored paragraph attributes onto
 * each paragraph node in range. Mutates `tr`; the caller dispatches.
 */
export function applyMarksAndAttrs(state, tr, from, to, stored) {
    removeCopiedMarks(state, tr, from, to);
    for (const [markName, attrs] of Object.entries(stored.marks)) {
        const markType = state.schema.marks[markName];
        if (markType)
            tr.addMark(from, to, markType.create(attrs));
    }
    const paragraphType = state.schema.nodes.paragraph;
    if (paragraphType && Object.keys(stored.nodeAttrs).length > 0) {
        state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type === paragraphType) {
                tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    ...stored.nodeAttrs,
                });
            }
        });
    }
}
/**
 * Clear the copyable marks and reset the painter's paragraph attributes to
 * `null` across `[from, to)`. Mutates `tr`; the caller dispatches.
 */
export function clearMarksAndAttrs(state, tr, from, to) {
    removeCopiedMarks(state, tr, from, to);
    const paragraphType = state.schema.nodes.paragraph;
    if (paragraphType) {
        const clearedAttrs = {};
        PARAGRAPH_ATTRS.forEach((attr) => {
            clearedAttrs[attr] = null;
        });
        state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type === paragraphType) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...clearedAttrs });
            }
        });
    }
}
