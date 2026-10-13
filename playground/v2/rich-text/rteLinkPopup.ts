// The link card (31823:54797, 31823:54816) over the selection, and the
// `openLinkEditor` command that raises it — the one command the toolbar's
// and the floating bar's Link buttons and ⌘K all run, so every way in
// shows the same card. A port of the library's link-commands and popup
// controller with the playground's panel in place of the library's:
// the range is kept and re-mapped through the live document, since the
// card settles later and the document may have moved underneath it.
import { getMarkRange, type Editor } from '@tiptap/core'
import type { MarkType } from '@tiptap/pm/model'
import {
  useFloatingPopup,
  type VirtualReference,
} from '../../../src/molecules/editor/composables/useFloatingPopup'
import { mapStoredRange } from '../../../src/molecules/editor/extensions/shared/node-view'
import { lockScroll } from '../../../src/molecules/editor/extensions/link/link-popup-controller'
import RteLinkPanel from './RteLinkPanel.vue'

type Range = { from: number; to: number }

export function buildOpenRteLinkEditor(markType: MarkType) {
  return (options?: { startInEdit?: boolean }) =>
    ({ editor }: { editor: Editor }): boolean => {
      const { state } = editor
      const { from, to } = state.selection

      let range: Range
      let delay = false
      if (from === to) {
        // a caret in a link: the whole link, and the card once its
        // selection has painted
        const markRange = getMarkRange(state.selection.$from, markType)
        if (!markRange) return false
        range = { from: markRange.from, to: markRange.to }
        editor.chain().setTextSelection(range).run()
        delay = true
      } else {
        range = { from, to }
      }

      const existing =
        (editor.getAttributes('link').href as string | undefined) || null

      const show = () => {
        void openRteLinkPopup({
          editor,
          href: existing,
          startInEdit: options?.startInEdit ?? !existing,
          range,
        }).then((href) => {
          if (href === null || editor.isDestroyed) return
          applyLink(editor, range, href)
        })
      }
      if (delay) requestAnimationFrame(show)
      else show()
      return true
    }
}

/**
 * Resolves with the address to set, `''` to unlink, or `null` when the
 * card was left — never rejects.
 */
function openRteLinkPopup(args: {
  editor: Editor
  href: string | null
  startInEdit: boolean
  range: Range
}): Promise<string | null> {
  const { editor } = args
  const anchor = editor.view.dom
  const unlockScroll = lockScroll(scrollParent(anchor))
  return new Promise<string | null>((resolve) => {
    let settled = false
    const settle = (value: string | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    const popup = useFloatingPopup({
      anchor,
      component: RteLinkPanel,
      closeOnAnchorPointerDown: true,
      // the card owns Escape: editing steps back to reading first
      closeOnEscape: false,
      virtualReference: selectionReference(editor, args.range),
      floatingOptions: { placement: 'top', offset: 8 },
      props: {
        href: args.href ?? '',
        startInEdit: args.startInEdit,
        onClose: () => {
          settle(null)
          popup.destroy()
          if (!editor.isDestroyed)
            editor.commands.focus(null, { scrollIntoView: false })
        },
        onUpdateHref: (href: string) => {
          settle(href)
          popup.destroy()
        },
      },
    })
    const destroy = popup.destroy
    popup.destroy = () => {
      unlockScroll()
      settle(null)
      destroy()
    }
    if (!popup.floating) {
      unlockScroll()
      settle(null)
    }
  })
}

function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const { overflowY } = getComputedStyle(n)
    if (overflowY === 'auto' || overflowY === 'scroll') return n
  }
  return null
}

function selectionReference(editor: Editor, range: Range): VirtualReference {
  let last = editor.view.dom.getBoundingClientRect()
  return {
    getBoundingClientRect: () => {
      if (editor.isDestroyed) return last
      try {
        last = selectionRect(editor, range)
      } catch {
        // floating-ui may ask once more during teardown
      }
      return last
    },
  }
}

function selectionRect(editor: Editor, range: Range): DOMRect {
  const { from, to } = mapStoredRange(editor.state, range)
  const start = editor.view.coordsAtPos(from)
  const end = editor.view.coordsAtPos(to)
  const top = Math.min(start.top, end.top)
  const bottom = Math.max(start.bottom, end.bottom)
  const left = Math.min(start.left, end.left)
  const right = Math.max(start.right, end.right)
  return {
    width: Math.max(right - left, 0),
    height: Math.max(bottom - top, start.bottom - start.top),
    top,
    right,
    bottom,
    left,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

/** `''` unlinks; an address sets it. Stored marks go, so typing on is plain. */
function applyLink(editor: Editor, stored: Range, href: string): void {
  const { from, to } = mapStoredRange(editor.state, stored)
  const chain = editor.chain().focus(null, { scrollIntoView: false })
  if (href === '') {
    chain
      .setTextSelection({ from, to })
      .unsetLink()
      .command(({ tr }) => {
        tr.setStoredMarks([])
        return true
      })
      .run()
    return
  }
  chain
    .setTextSelection({ from, to })
    .setLink({ href })
    .setTextSelection(to)
    .command(({ tr }) => {
      tr.setStoredMarks([])
      return true
    })
    .run()
}
