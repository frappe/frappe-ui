/**
 * Pure level→tree fold for the table-of-contents.
 *
 * One stack-based fold projected twice:
 *  - `headingsToRenderSpec` → typed render spec for the extension `renderHTML`
 *  - `foldHeadings`          → generic anchor tree for the live node view
 *
 * No Vue, no DOM, no `any` — fully unit-testable.
 */
/**
 * Fold a flat, document-ordered list of `{ level }` items into a tree using a
 * level stack: an item nests under the nearest preceding item with a strictly
 * lower level. `makeNode` projects each source item into the tree payload.
 */
export function foldHeadings(items, makeNode) {
    const roots = [];
    const stack = [];
    for (const item of items) {
        const node = { value: makeNode(item), children: [] };
        while (stack.length && stack[stack.length - 1].level >= item.level) {
            stack.pop();
        }
        if (stack.length === 0) {
            roots.push(node);
        }
        else {
            stack[stack.length - 1].node.children.push(node);
        }
        stack.push({ level: item.level, node });
    }
    return roots;
}
/**
 * Project a folded heading tree into the typed render spec. The source tree
 * must carry at least `{ text, level }` payloads.
 */
export function headingsToRenderSpec(tree) {
    return tree.map((node) => ({
        text: node.value.text,
        children: headingsToRenderSpec(node.children),
    }));
}
