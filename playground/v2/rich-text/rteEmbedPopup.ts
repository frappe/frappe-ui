// The file's embed card (RteEmbedSource) raised beside an embed already
// in the document — what the pencil and "Replace" on the embed's menu ask
// with. The slot raises the same card from its own button; here it hangs
// from the chrome in the frame's top-right corner, as the file draws it
// (32354:128183): its right edge on the dots button's, 8px under it,
// flipped above when there is no room, and gone with a press anywhere
// else. The embed's position is carried through every transaction while
// the card is up, since the document may move underneath it.
import type { Editor } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import { useFloatingPopup } from '../../../src/molecules/editor/composables/useFloatingPopup'
import { getIframeAllowlist } from '../../../src/molecules/editor/extensions/iframe'
import {
  resolveUploadOptions,
  uploadFile,
} from '../../../src/molecules/editor/extensions/shared/media-upload-engine'
import RteEmbedSource from './RteEmbedSource.vue'

/** the card's Upload tab, sent through the editor's own upload */
export function embedUploader(editor: Editor): (file: File) => Promise<string> {
  const options = resolveUploadOptions({ editor })
  return async (file) => (await uploadFile(file, options)).file_url
}

/** where the chrome sits in a frame: 28px square, 10px in from the top right */
const CHROME_INSET = 10
const CHROME_SIZE = 28

export interface LinkedEmbed {
  src: string
  aspectRatio: number
}

export function openEmbedSourcePopup(
  editor: Editor,
  pos: number,
  take: (pos: number, embed: LinkedEmbed) => void,
): void {
  let at = pos
  const track = ({ transaction }: { transaction: Transaction }) => {
    at = transaction.mapping.map(at)
  }
  editor.on('transaction', track)

  const anchor = editor.view.dom
  const rectOf = () => {
    const el = editor.isDestroyed ? null : editor.view.nodeDOM(at)
    if (!(el instanceof HTMLElement)) return anchor.getBoundingClientRect()
    // the dots button's own box, read off the frame rather than the button,
    // which is only in the page while the embed is selected
    const frame = el.querySelector('[data-embed-frame]') ?? el
    const r = frame.getBoundingClientRect()
    return new DOMRect(
      r.right - CHROME_INSET - CHROME_SIZE,
      r.top + CHROME_INSET,
      CHROME_SIZE,
      CHROME_SIZE,
    )
  }

  let settled = false
  const done = () => {
    if (settled) return
    settled = true
    editor.off('transaction', track)
    destroy()
  }
  const popup = useFloatingPopup({
    anchor,
    component: RteEmbedSource,
    closeOnAnchorPointerDown: true,
    virtualReference: { getBoundingClientRect: rectOf },
    floatingOptions: { placement: 'bottom-end', offset: 8 },
    props: {
      allowlist: getIframeAllowlist(editor),
      initial: (editor.state.doc.nodeAt(at)?.attrs.src as string) ?? '',
      upload: embedUploader(editor),
      onLink: (embed: LinkedEmbed) => {
        const target = at
        done()
        take(target, embed)
      },
      onClose: done,
    },
  })
  const destroy = popup.destroy
  popup.destroy = done
}
