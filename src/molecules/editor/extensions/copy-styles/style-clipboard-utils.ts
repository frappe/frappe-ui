/**
 * Pure ProseMirror style-clipboard operations for the format painter.
 *
 * No Vue, no console, no editor command calls — every function takes explicit
 * state/transaction inputs so it is unit-testable. The format painter carries
 * BOTH inline marks AND block/node attributes (locked product decision): styles
 * are captured with {@link collectMarks} + {@link collectBlockAttrs} and applied
 * together by {@link applyMarksAndAttrs}.
 */
import type { EditorState, Transaction } from '@tiptap/pm/state'
import type { MarkType } from '@tiptap/pm/model'

/** Marks the painter copies across a selection. */
export const COPIED_MARKS: readonly string[] = [
  'textStyle',
  'underline',
  'strike',
  'bold',
  'italic',
  'namedHighlight',
  'namedColor',
]

/** Block/node attributes the painter copies (paragraph spacing/line-height). */
export const PARAGRAPH_ATTRS: readonly string[] = [
  'lineHeight',
  'spacingBefore',
  'spacingAfter',
]

/** Captured style payload: mark attrs keyed by mark name + block attrs. */
export interface StyleClipboardState {
  marks: Record<string, Record<string, unknown>>
  nodeAttrs: Record<string, unknown>
}

/** Collect the marks present anywhere in `[from, to)`, keyed by mark name. */
export function collectMarks(
  state: EditorState,
  from: number,
  to: number,
): Record<string, Record<string, unknown>> {
  const marks: Record<string, Record<string, unknown>> = {}
  state.doc.nodesBetween(from, to, (node) => {
    node.marks.forEach((mark) => {
      marks[mark.type.name] = mark.attrs
    })
  })
  return marks
}

/** Collect the painter's block attributes from the parent of `from`. */
export function collectBlockAttrs(
  state: EditorState,
  from: number,
): Record<string, unknown> {
  const parentAttrs = state.doc.resolve(from).parent.attrs
  const attrs: Record<string, unknown> = {}
  PARAGRAPH_ATTRS.forEach((attr) => {
    if (parentAttrs[attr] !== undefined) attrs[attr] = parentAttrs[attr]
  })
  return attrs
}

/** Remove every {@link COPIED_MARKS} mark across `[from, to)` on `tr`. */
function removeCopiedMarks(
  state: EditorState,
  tr: Transaction,
  from: number,
  to: number,
): void {
  COPIED_MARKS.forEach((markName) => {
    const markType: MarkType | undefined = state.schema.marks[markName]
    if (markType) tr.removeMark(from, to, markType)
  })
}

/**
 * Apply a captured style payload across `[from, to)`: clear the copyable marks,
 * re-add the stored marks, and overlay the stored paragraph attributes onto
 * each paragraph node in range. Mutates `tr`; the caller dispatches.
 */
export function applyMarksAndAttrs(
  state: EditorState,
  tr: Transaction,
  from: number,
  to: number,
  stored: StyleClipboardState,
): void {
  removeCopiedMarks(state, tr, from, to)

  for (const [markName, attrs] of Object.entries(stored.marks)) {
    const markType: MarkType | undefined = state.schema.marks[markName]
    if (markType) tr.addMark(from, to, markType.create(attrs))
  }

  const paragraphType = state.schema.nodes.paragraph
  if (paragraphType && Object.keys(stored.nodeAttrs).length > 0) {
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === paragraphType) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...stored.nodeAttrs,
        })
      }
    })
  }
}

/**
 * Clear the copyable marks and reset the painter's paragraph attributes to
 * `null` across `[from, to)`. Mutates `tr`; the caller dispatches.
 */
export function clearMarksAndAttrs(
  state: EditorState,
  tr: Transaction,
  from: number,
  to: number,
): void {
  removeCopiedMarks(state, tr, from, to)

  const paragraphType = state.schema.nodes.paragraph
  if (paragraphType) {
    const clearedAttrs: Record<string, null> = {}
    PARAGRAPH_ATTRS.forEach((attr) => {
      clearedAttrs[attr] = null
    })
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === paragraphType) {
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...clearedAttrs })
      }
    })
  }
}
