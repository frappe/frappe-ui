// The file's image card (RteImageSource) raised beside a picture already
// in the document — what "Replace" on the picture's menu asks with. The
// slot raises the same card from its own button; a picture has no button
// to hang it on, so it floats under the picture, flipped above when there
// is no room, and goes with a press anywhere else. The picture's position
// is carried through every transaction while the card is up, since the
// document may move underneath it.
import type { Editor } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import { useFloatingPopup } from '../../../src/molecules/editor/composables/useFloatingPopup'
import RteImageSource from './RteImageSource.vue'

export interface LinkedImage {
  src: string
  width: number
  height: number
}

export function openImageSourcePopup(
  editor: Editor,
  pos: number,
  take: {
    file: (pos: number, file: File) => void
    link: (pos: number, image: LinkedImage) => void
  },
): void {
  let at = pos
  const track = ({ transaction }: { transaction: Transaction }) => {
    at = transaction.mapping.map(at)
  }
  editor.on('transaction', track)

  const anchor = editor.view.dom
  const rectOf = () => {
    const el = editor.isDestroyed ? null : editor.view.nodeDOM(at)
    return el instanceof HTMLElement
      ? el.getBoundingClientRect()
      : anchor.getBoundingClientRect()
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
    component: RteImageSource,
    closeOnAnchorPointerDown: true,
    virtualReference: { getBoundingClientRect: rectOf },
    floatingOptions: { placement: 'bottom', offset: 8 },
    props: {
      onFile: (file: File) => {
        const target = at
        done()
        take.file(target, file)
      },
      onLink: (image: LinkedImage) => {
        const target = at
        done()
        take.link(target, image)
      },
      onClose: done,
    },
  })
  const destroy = popup.destroy
  popup.destroy = done
}
