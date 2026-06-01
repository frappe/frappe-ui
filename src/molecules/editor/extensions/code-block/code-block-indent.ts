import type { EditorState } from '@tiptap/pm/state'

/** Indentation unit inserted/removed by Tab / Shift-Tab inside a code block. */
export const INDENT = ' '.repeat(4)

export interface CodeBlockCtx {
  /** Document position of the start of the code block's text content. */
  start: number
  /** Full text content of the code block. */
  text: string
  /** Selection start offset relative to `start`. */
  fromOffset: number
  /** Selection end offset relative to `start`. */
  toOffset: number
}

/**
 * Resolve the enclosing `codeBlock` node for the current selection.
 *
 * Returns `null` when the selection is not inside a code block.
 */
export function getCodeBlockCtx(state: EditorState): CodeBlockCtx | null {
  const { $from, from, to } = state.selection
  let depth = $from.depth
  while (depth > 0 && $from.node(depth).type.name !== 'codeBlock') depth--
  if (depth === 0) return null

  const node = $from.node(depth)
  const start = $from.start(depth)
  const text = node.textContent
  const fromOffset = from - start
  const toOffset = to - start
  return { start, text, fromOffset, toOffset }
}

/**
 * Given a code block's text and a selection range (as offsets), return the
 * offset of the start of every line that the selection touches.
 *
 * Used to apply Tab / Shift-Tab to each line of a multi-line selection.
 */
export function lineStartsBetween(
  text: string,
  fromOffset: number,
  toOffset: number,
): number[] {
  const startOff = text.lastIndexOf('\n', Math.max(0, fromOffset - 1)) + 1
  let endOff = toOffset
  if (endOff > 0 && text[endOff - 1] === '\n') endOff--

  const starts: number[] = [startOff]
  let i = startOff
  while (true) {
    const nl = text.indexOf('\n', i)
    if (nl === -1 || nl >= endOff) break
    starts.push(nl + 1)
    i = nl + 1
  }
  return starts
}
