// The file's embed card (RteEmbedSource) raised beside an embed already
// in the document — what "Replace" on the embed's menu asks with. The
// slot raises the same card from its own button; an embed has no button
// to hang it on, so it floats under the frame, flipped above when there
// is no room, and goes with a press anywhere else. The embed's position
// is carried through every transaction while the card is up, since the
// document may move underneath it.
import type { Editor } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import { useFloatingPopup } from '../../../src/molecules/editor/composables/useFloatingPopup'
import { getIframeAllowlist } from '../../../src/molecules/editor/extensions/iframe'
import RteEmbedSource from './RteEmbedSource.vue'

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
    component: RteEmbedSource,
    closeOnAnchorPointerDown: true,
    virtualReference: { getBoundingClientRect: rectOf },
    floatingOptions: { placement: 'bottom', offset: 8 },
    props: {
      allowlist: getIframeAllowlist(editor),
      initial: (editor.state.doc.nodeAt(at)?.attrs.src as string) ?? '',
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
