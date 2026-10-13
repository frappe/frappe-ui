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
import { NodeSelection } from '@tiptap/pm/state'
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view'
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
export function createParagraphAfterMedia(
  editor: Editor,
  getPos: GetPos,
): void {
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
 * Set media alignment on the hosted node. Both node types declare an `align`
 * attribute, so this dispatches a plain `updateAttributes` against whichever
 * type the node view hosts (no per-type command needed).
 */
export function setMediaAlign(
  editor: Editor,
  isVideo: boolean,
  align: MediaAlign,
): void {
  editor.commands.updateAttributes(isVideo ? 'video' : 'image', { align })
}

/** Delete the hosted node, whatever it is in the middle of. */
export function removeMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  const { state } = editor.view
  const node = state.doc.nodeAt(pos)
  if (!node) return
  editor.view.dispatch(state.tr.delete(pos, pos + node.nodeSize))
}

/**
 * A copy of the hosted node right after it, selected so it can be captioned
 * or moved straight away. An inline media gets a paragraph of its own, so
 * the copy reads as the next block rather than running on in the same line.
 * The copy is a fresh node: no upload id, no error, the same picture.
 */
export function duplicateMedia(editor: Editor, getPos: GetPos): void {
  const pos = safeGetPos(getPos)
  if (pos === null) return
  const { state } = editor.view
  const node = state.doc.nodeAt(pos)
  if (!node) return
  const copy = node.type.create(
    { ...node.attrs, uploadId: null, error: null },
    node.content,
    node.marks,
  )
  const tr = state.tr
  let at: number
  if (node.isInline) {
    const paragraph = state.schema.nodes.paragraph
    if (!paragraph) return
    const after = state.doc.resolve(pos).after()
    tr.insert(after, paragraph.create(null, copy))
    at = after + 1
  } else {
    at = pos + node.nodeSize
    tr.insert(at, copy)
  }
  tr.setSelection(NodeSelection.create(tr.doc, at)).scrollIntoView()
  editor.view.dispatch(tr)
}

/** The file name a media address ends in, or a plain `image`/`video`. */
export function mediaFileName(src: string, kind = 'image'): string {
  try {
    const last = new URL(src, window.location.href).pathname.split('/').pop()
    const name = decodeURIComponent(last ?? '')
    return name || kind
  } catch {
    return kind
  }
}

/**
 * Save the media to disk under its own file name. The bytes are fetched so
 * the save is a download even for a host that would otherwise navigate to
 * the file; a host that will not hand its bytes to a script gets the
 * browser's own download, which may open the file instead.
 */
export async function downloadMedia(
  src: string,
  kind = 'image',
): Promise<void> {
  const name = mediaFileName(src, kind)
  try {
    const blob = await (await fetch(src)).blob()
    const url = URL.createObjectURL(blob)
    clickDownload(url, name)
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  } catch {
    clickDownload(src, name, true)
  }
}

function clickDownload(href: string, name: string, newTab = false): void {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  a.rel = 'noopener'
  if (newTab) a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * Put the picture on the clipboard as an image — a PNG, the one kind the
 * clipboard takes — so it pastes into a document or a chat as a picture.
 * Resolves `true` when it did; when the bytes cannot be read (a host that
 * will not share them) the address is copied instead and it resolves `false`.
 */
export async function copyImageToClipboard(src: string): Promise<boolean> {
  try {
    const blob = await (await fetch(src)).blob()
    const png = blob.type === 'image/png' ? blob : await toPng(blob)
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })])
    return true
  } catch {
    try {
      await navigator.clipboard.writeText(src)
    } catch {
      // nothing to copy with: no clipboard at all
    }
    return false
  }
}

async function toPng(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (png) => (png ? resolve(png) : reject(new Error('Could not encode'))),
      'image/png',
    ),
  )
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
