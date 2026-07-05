/**
 * Static `renderHTML` body for the table-of-contents node.
 *
 * Used for serialization / non-interactive rendering (the live editor uses the
 * Vue node view instead). Collects headings via the shared `heading-scope` +
 * `heading-tree-utils` so the tree logic is not duplicated.
 */
import type { Editor } from '@tiptap/core'
import type { DOMOutputSpec } from '@tiptap/pm/model'
import {
  collectHeadings,
  getActiveTabRange,
} from '#molecules/editor/extensions/shared/heading-scope'
import {
  foldHeadings,
  headingsToRenderSpec,
  type TocRenderNode,
} from '#molecules/editor/extensions/shared/heading-tree-utils'

const OL_STYLE =
  'list-style-type: decimal; margin: 0.5em 0; padding-left: 1.5em'
const NESTED_OL_STYLE = 'list-style-type: decimal; padding-left: 1.5em'

/** Element-spec tuple: `[tag, attrs, ...children]`. Assignable to DOMOutputSpec. */
type ElementSpec = readonly [string, Record<string, string>, ...any[]]

function renderNode(node: TocRenderNode): ElementSpec {
  const paragraph: ElementSpec = ['p', { style: 'margin: 0' }, node.text]
  if (node.children.length === 0) {
    return ['li', {}, paragraph]
  }
  const nested: ElementSpec = [
    'ol',
    { style: NESTED_OL_STYLE },
    ...node.children.map(renderNode),
  ]
  return ['li', {}, paragraph, nested]
}

/**
 * Build the `renderHTML` output spec for the toc node. Delegated to from the
 * extension's `renderHTML` (one-liner there).
 */
export function renderTocHTML(
  editor: Editor | undefined,
  htmlAttributes: Record<string, unknown>,
): DOMOutputSpec {
  const attrs: Record<string, unknown> = {
    ...htmlAttributes,
    'data-type': 'toc-node',
    class: 'table-of-contents-node',
  }

  if (!editor) {
    return ['div', attrs, 'No headings found in this document.']
  }

  const headings = collectHeadings(editor, getActiveTabRange(editor))
  if (headings.length === 0) {
    return ['div', attrs, 'No headings found in this document.']
  }

  const tree = foldHeadings(
    headings,
    (item) => item as (typeof headings)[number],
  )
  const spec = headingsToRenderSpec(tree)
  const list: ElementSpec = ['ol', { style: OL_STYLE }, ...spec.map(renderNode)]

  return ['div', attrs, list]
}
