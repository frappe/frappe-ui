import { collectHeadings, getActiveTabRange, } from '#molecules/editor/extensions/shared/heading-scope';
import { foldHeadings, headingsToRenderSpec, } from '#molecules/editor/extensions/shared/heading-tree-utils';
const OL_STYLE = 'list-style-type: decimal; margin: 0.5em 0; padding-left: 1.5em';
const NESTED_OL_STYLE = 'list-style-type: decimal; padding-left: 1.5em';
function renderNode(node) {
    const paragraph = ['p', { style: 'margin: 0' }, node.text];
    if (node.children.length === 0) {
        return ['li', {}, paragraph];
    }
    const nested = [
        'ol',
        { style: NESTED_OL_STYLE },
        ...node.children.map(renderNode),
    ];
    return ['li', {}, paragraph, nested];
}
/**
 * Build the `renderHTML` output spec for the toc node. Delegated to from the
 * extension's `renderHTML` (one-liner there).
 */
export function renderTocHTML(editor, htmlAttributes) {
    const attrs = {
        ...htmlAttributes,
        'data-type': 'toc-node',
        class: 'table-of-contents-node',
    };
    if (!editor) {
        return ['div', attrs, 'No headings found in this document.'];
    }
    const headings = collectHeadings(editor, getActiveTabRange(editor));
    if (headings.length === 0) {
        return ['div', attrs, 'No headings found in this document.'];
    }
    const tree = foldHeadings(headings, (item) => item);
    const spec = headingsToRenderSpec(tree);
    const list = ['ol', { style: OL_STYLE }, ...spec.map(renderNode)];
    return ['div', attrs, list];
}
