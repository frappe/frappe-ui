import type { Editor, Range } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'

/**
 * Shared helpers for slash/emoji/mention/tag suggesters: DRY node-insertion,
 * the single case-insensitive filter, and a typed options lookup.
 *
 * Canonical import path:
 *   `#molecules/editor/extensions/shared/suggestion-helpers`
 */

/**
 * Insert an atom node at `range`, replacing the trigger text (e.g. `@foo`/`#bar`).
 *
 * Behavior-preserving extraction of the `command()` body shared by the mention
 * and tag extensions: focuses, then `insertContentAt(range, ...)` the node,
 * optionally followed by a trailing space text node so the caret lands clear of
 * the atom. Defaults to inserting the trailing space (existing behavior).
 */
export function insertSuggestionNode(
  editor: Editor,
  range: Range,
  nodeType: string,
  attrs: Record<string, unknown>,
  opts: { trailingSpace?: boolean } = {},
): void {
  const { trailingSpace = true } = opts
  const content: Array<
    { type: string; attrs: Record<string, unknown> } | { type: 'text'; text: string }
  > = [{ type: nodeType, attrs }]
  if (trailingSpace) {
    content.push({ type: 'text', text: ' ' })
  }
  editor.chain().focus().insertContentAt(range, content).run()
}

/**
 * The ONE matcher for all four suggesters: case-insensitive SUBSTRING (`includes`)
 * match on `item[key]`. Both sides are lowercased. Non-string values at `key`
 * (or `undefined`) never match.
 */
export function filterByQuery<T>(items: T[], query: string, key: keyof T): T[] {
  const needle = query.toLowerCase()
  return items.filter((item) => {
    const value = item[key]
    return typeof value === 'string' && value.toLowerCase().includes(needle)
  })
}

/**
 * True when `pos` sits inside a code context — either a code-block node or text
 * carrying the inline `code` mark. Suggesters (`@`/`#`/`:`) use this to stay
 * inert inside code, where a `:emoji`/`#tag`/`@mention` trigger would otherwise
 * corrupt the literal source the author is typing.
 *
 * Detection is structural: code-block nodes carry `spec.code === true`, and
 * inline code is a mark — so we walk the resolved ancestors for the former and
 * test the position's mark set for the latter.
 */
export function isInCode(state: EditorState, pos: number): boolean {
  const $pos = state.doc.resolve(pos)
  for (let depth = $pos.depth; depth > 0; depth--) {
    if ($pos.node(depth).type.spec.code) return true
  }
  const codeMark = state.schema.marks.code
  return codeMark ? codeMark.isInSet($pos.marks()) != null : false
}

/**
 * Typed replacement for
 * `editor.extensionManager.extensions.find((e) => e.name === name)!.options`.
 * Returns the extension's options cast to `T`, or `undefined` (no throw) when
 * the extension is absent.
 */
export function getSuggestionOptions<T = Record<string, unknown>>(
  editor: Editor,
  extensionName: string,
): T | undefined {
  const extension = editor.extensionManager.extensions.find(
    (ext) => ext.name === extensionName,
  )
  return extension?.options as T | undefined
}
