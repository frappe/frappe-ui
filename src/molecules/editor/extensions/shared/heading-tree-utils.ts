/**
 * Pure level→tree fold for the table-of-contents.
 *
 * One stack-based fold projected twice:
 *  - `headingsToRenderSpec` → typed render spec for the extension `renderHTML`
 *  - `foldHeadings`          → generic anchor tree for the live node view
 *
 * No Vue, no DOM, no `any` — fully unit-testable.
 */

/** A node in a folded heading tree. `value` carries the projected payload. */
export interface HeadingTreeNode<T> {
  value: T
  children: HeadingTreeNode<T>[]
}

/** Typed render spec consumed by the extension `renderHTML` (replaces `any[]`). */
export interface TocRenderNode {
  text: string
  children: TocRenderNode[]
}

/**
 * Fold a flat, document-ordered list of `{ level }` items into a tree using a
 * level stack: an item nests under the nearest preceding item with a strictly
 * lower level. `makeNode` projects each source item into the tree payload.
 */
export function foldHeadings<T>(
  items: { level: number }[],
  makeNode: (item: { level: number }) => T,
): HeadingTreeNode<T>[] {
  const roots: HeadingTreeNode<T>[] = []
  const stack: { level: number; node: HeadingTreeNode<T> }[] = []

  for (const item of items) {
    const node: HeadingTreeNode<T> = { value: makeNode(item), children: [] }

    while (stack.length && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      roots.push(node)
    } else {
      stack[stack.length - 1].node.children.push(node)
    }

    stack.push({ level: item.level, node })
  }

  return roots
}

/**
 * Project a folded heading tree into the typed render spec. The source tree
 * must carry at least `{ text, level }` payloads.
 */
export function headingsToRenderSpec(
  tree: HeadingTreeNode<{ text: string; level: number }>[],
): TocRenderNode[] {
  return tree.map((node) => ({
    text: node.value.text,
    children: headingsToRenderSpec(node.children),
  }))
}
