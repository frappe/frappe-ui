// The link card (31823:54797, 31823:54816) over the selection, and the
// `openLinkEditor` command that raises it — the one command the toolbar's
// and the floating bar's Link buttons and ⌘K all run, so every way in
// shows the same card. A port of the library's link-commands and popup
// controller with the playground's panel in place of the library's:
// the range is kept and re-mapped through the live document, since the
// card settles later and the document may have moved underneath it.
import { getMarkRange, type Editor } from '@tiptap/core'
import type { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { ref } from 'vue'
import {
  useFloatingPopup,
  type FloatingPopupHandle,
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
  /** raised by the pointer resting on a link: the page keeps scrolling,
   *  and a press in the editor is the hover controller's to judge */
  hover?: {
    onOpen: (popup: FloatingPopupHandle) => void
    onEditing: () => void
  }
}): Promise<string | null> {
  const { editor } = args
  const anchor = editor.view.dom
  const unlockScroll = args.hover ? () => {} : lockScroll(scrollParent(anchor))
  openCards++
  linkCardOpen.value = true
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
      closeOnAnchorPointerDown: !args.hover,
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
        onEditing: () => args.hover?.onEditing(),
      },
    })
    const destroy = popup.destroy
    let gone = false
    popup.destroy = () => {
      if (!gone) {
        gone = true
        markPending(editor, null)
        openCards--
        linkCardOpen.value = openCards > 0
      }
      unlockScroll()
      settle(null)
      destroy()
    }
    if (!popup.floating) {
      popup.destroy()
      return
    }
    // a frame on: the card may be raised from inside a command, and a
    // transaction of its own mid-command would be one too many
    requestAnimationFrame(() => {
      if (!gone) markPending(editor, mapStoredRange(editor.state, args.range))
    })
    args.hover?.onOpen(popup)
  })
}

// ---- the run a card is for stays marked while it is up: the card's field
// takes the focus, and with it the browser stops drawing the selection, so
// the text being linked would be lost to sight. It is drawn as the file's
// Edit Link state (32467:13501), the gray-100 ground of .rte-link-on.
type Pending = Range | null
const pendingKey = new PluginKey<Pending>('rteLinkPending')

export function rteLinkPendingPlugin() {
  return new Plugin<Pending>({
    key: pendingKey,
    state: {
      init: () => null,
      apply(tr, value) {
        const meta = tr.getMeta(pendingKey) as Pending | undefined
        if (meta !== undefined) return meta
        if (!value || !tr.docChanged) return value
        const from = tr.mapping.map(value.from, 1)
        const to = tr.mapping.map(value.to, -1)
        return from < to ? { from, to } : null
      },
    },
    props: {
      decorations(state) {
        const range = pendingKey.getState(state)
        if (!range) return null
        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, { class: 'rte-link-on' }),
        ])
      },
    },
  })
}

function markPending(editor: Editor, range: Pending) {
  if (editor.isDestroyed) return
  editor.view.dispatch(editor.state.tr.setMeta(pendingKey, range))
}

/** how many link cards are up; the pointer raises none over another */
let openCards = 0
/** a link card is up: the floating bar stands down while it is, so the
 *  card takes its place rather than landing on top of it */
export const linkCardOpen = ref(false)

// ---- hover: the file's Hover and Selected states (32467:13501). Over a
// link the pointer is the hand; resting there a moment, or pressing the
// link, raises the card read — the address (a press on it opens the link),
// copy and the pencil. It stays while the pointer is on the link or the
// card, and goes a beat after it leaves both; once the pencil is pressed
// it is an edit like any other, and stays until it is done.
const SHOW_DELAY = 300
const HIDE_DELAY = 250

export function rteLinkHoverPlugin(editor: Editor, markType: MarkType) {
  return new Plugin({
    key: new PluginKey('rteLinkHover'),
    view(view) {
      let link: HTMLAnchorElement | null = null
      let popup: FloatingPopupHandle | null = null
      let editing = false
      let showTimer: ReturnType<typeof setTimeout> | undefined
      let hideTimer: ReturnType<typeof setTimeout> | undefined

      const linkAt = (target: EventTarget | null) => {
        const el = target instanceof Element ? target : null
        const a = el?.closest<HTMLAnchorElement>('a[href]')
        if (!a || !view.dom.contains(a)) return null
        // a link inside a node view (an attachment row) is that view's own
        if (a.closest('[contenteditable="false"]')) return null
        return a
      }
      const inCard = (target: EventTarget | null) =>
        !!popup?.floating &&
        target instanceof Node &&
        popup.floating.contains(target)

      const close = () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
        popup?.destroy()
        popup = null
        link = null
        editing = false
      }
      const scheduleHide = () => {
        if (editing || !popup) return
        clearTimeout(hideTimer)
        hideTimer = setTimeout(close, HIDE_DELAY)
      }
      const open = (a: HTMLAnchorElement) => {
        if (editor.isDestroyed || !editor.isEditable) return
        if (popup && link === a) return
        if (popup && editing) return
        close()
        // another card (the toolbar's, ⌘K) is up: leave it be
        if (openCards > 0) return
        const href = a.getAttribute('href')
        if (!href) return
        let range: Range | null = null
        try {
          const pos = view.posAtDOM(a, 0)
          const markRange =
            getMarkRange(view.state.doc.resolve(pos), markType) ??
            getMarkRange(view.state.doc.resolve(pos + 1), markType)
          if (markRange) range = { from: markRange.from, to: markRange.to }
        } catch {
          range = null
        }
        if (!range) return
        const stored = range
        link = a
        void openRteLinkPopup({
          editor,
          href,
          startInEdit: false,
          range: stored,
          hover: {
            onOpen: (handle) => {
              popup = handle
              handle.floating?.addEventListener('mouseenter', () =>
                clearTimeout(hideTimer),
              )
              handle.floating?.addEventListener('mouseleave', scheduleHide)
            },
            onEditing: () => {
              editing = true
              clearTimeout(hideTimer)
            },
          },
        }).then((next) => {
          popup = null
          link = null
          editing = false
          if (next === null || editor.isDestroyed) return
          applyLink(editor, stored, next)
        })
      }

      const onOver = (e: MouseEvent) => {
        const a = linkAt(e.target)
        if (!a) return
        if (a === link) {
          clearTimeout(hideTimer)
          return
        }
        clearTimeout(showTimer)
        showTimer = setTimeout(() => open(a), SHOW_DELAY)
      }
      const onOut = (e: MouseEvent) => {
        const a = linkAt(e.target)
        if (!a) return
        // still on the same link, or gone onto its card
        if (a.contains(e.relatedTarget as Node | null)) return
        clearTimeout(showTimer)
        if (a === link && !inCard(e.relatedTarget)) scheduleHide()
      }
      const onDown = (e: PointerEvent) => {
        const a = linkAt(e.target)
        // a press on the link the card is for keeps it; anywhere else in
        // the editor puts it away
        if (popup && a !== link) close()
      }
      const onClick = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        const a = linkAt(e.target)
        if (a) {
          clearTimeout(showTimer)
          open(a)
        }
      }

      view.dom.addEventListener('mouseover', onOver)
      view.dom.addEventListener('mouseout', onOut)
      view.dom.addEventListener('pointerdown', onDown)
      view.dom.addEventListener('click', onClick)
      return {
        destroy() {
          view.dom.removeEventListener('mouseover', onOver)
          view.dom.removeEventListener('mouseout', onOut)
          view.dom.removeEventListener('pointerdown', onDown)
          view.dom.removeEventListener('click', onClick)
          close()
        },
      }
    },
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
