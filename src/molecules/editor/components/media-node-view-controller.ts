/**
 * Imperative glue for the shared media node view.
 *
 * Cursor commands, caption keydown handling and alignment dispatch — every one
 * resolves its node position through `safeGetPos`, so a stale node view never
 * runs position math with `undefined`/`NaN` (the old node view passed the raw
 * `getPos()` straight into `setTextSelection`).
 *
 * This is imperative orchestration glue (it drives `editor.chain()`), not pure
 * logic — hence the `*-controller.ts` suffix per CONVENTIONS §3.2.
 */
import type { Editor } from '@tiptap/core'
import { safeGetPos } from '@molecules/editor/extensions/shared/node-view'
import type { MediaAlign } from './media-node-view-utils'

type GetPos = () => number | undefined

/** Focus and move the selection to an absolute document position. */
function setCursorAt(editor: Editor, pos: number): void {
  editor.commands.focus()
  editor.chain().setTextSelection(pos).scrollIntoView().run()
}

/**
 * Insert a paragraph immediately after the media node (Enter inside caption).
 */
export function createParagraphAfterMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  editor.commands.focus()
  editor
    .chain()
    .setTextSelection(pos + 1)
    .createParagraphNear()
    .scrollIntoView()
    .run()
}

/** Move the cursor just after the media node (Escape / ArrowDown). */
export function setCursorAfterMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  setCursorAt(editor, pos + 1)
}

/** Move the cursor just before the media node (ArrowUp). */
export function setCursorBeforeMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  setCursorAt(editor, pos - 1)
}

/** Select the media node itself (click). */
export function selectMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  editor.commands.setNodeSelection(pos)
}

/**
 * Set image alignment. Guarded `isVideo` here so callers cannot accidentally
 * dispatch the image-only `setImageAlign` command for a video node.
 */
export function setMediaAlign(
  editor: Editor,
  isVideo: boolean,
  align: MediaAlign,
): void {
  if (isVideo) return
  editor.commands.setImageAlign(align)
}

export interface CaptionKeydownActions {
  /** Insert a paragraph after the node and move the cursor into it. */
  onParagraphAfter: () => void
  /** Move the cursor just after the node. */
  onCursorAfter: () => void
  /** Move the cursor just before the node. */
  onCursorBefore: () => void
  /** Toggle the caption off (Backspace on an empty caption). */
  onToggleCaption: () => void
  /** Current caption text, used to decide the Backspace branch. */
  getCaption: () => string
}

/**
 * Handle a keydown inside the caption input. Mirrors the original node view's
 * keymap: Enter → paragraph after; Escape/ArrowDown → cursor after;
 * ArrowUp → cursor before; Backspace on empty caption → toggle caption off.
 */
export function handleCaptionKeydown(
  event: KeyboardEvent,
  actions: CaptionKeydownActions,
): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    actions.onParagraphAfter()
  } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
    event.preventDefault()
    actions.onCursorAfter()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    actions.onCursorBefore()
  } else if (event.key === 'Backspace' && actions.getCaption() === '') {
    event.preventDefault()
    actions.onToggleCaption()
  }
}
