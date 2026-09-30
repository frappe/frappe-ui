<script setup lang="ts">
// A block's grip, as Notion draws it: six dots in the margin beside the
// block under the pointer, "Drag to move" beneath, that carry the block
// to wherever it is dropped. Every top-level block has one — a paragraph,
// a heading, a list, a quote, a code block, a table, an image, a callout,
// the columns — and inside a list the item under the pointer has its own,
// down to the innermost list.
//
// The grip lives outside the editor, so ProseMirror's own dragstart never
// runs for it: the press selects the block, the drag hands ProseMirror the
// block as what is being moved, and ProseMirror's drop puts it where the
// drop cursor showed. A click selects the block.
import { ref, shallowRef, watch } from 'vue'
import { NodeSelection } from '@tiptap/pm/state'
import { Tooltip } from '../../../src'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import type { TiptapEditor } from '../../../src/molecules/editor'
import RteIcon from './RteIcon.vue'

type View = TiptapEditor['view']

const editor = useResolvedEditor(() => undefined)
const layer = ref<HTMLElement | null>(null)
const target = shallowRef<HTMLElement | null>(null)
const left = ref(0)
const top = ref(0)
const dragging = ref(false)

/** how far left of the document the grip still answers the pointer */
const GUTTER = 72
const SIZE = 24
/** the gap between the grip and the block */
const GAP = 6
/** how far past a block's edge, into the gap around it, its grip still answers */
const REACH = 16

/** what the editor draws at the top level that is not a block */
const SKIP =
  '.ProseMirror-gapcursor, .ProseMirror-widget, .ProseMirror-separator, br'
const spans = (el: Element, y: number) => {
  const r = el.getBoundingClientRect()
  return y >= r.top && y < r.bottom
}

/** the block under the pointer: a top-level block, or a list's item */
function blockAt(view: View, x: number, y: number): HTMLElement | null {
  const dom = view.dom as HTMLElement
  const d = dom.getBoundingClientRect()
  if (x < d.left - GUTTER || x > d.right || y < d.top || y > d.bottom)
    return null
  // the block the pointer is on, or the nearest one when it is in the gap
  // between blocks — a rule is a pixel tall
  let el: HTMLElement | null = null
  let nearest = Infinity
  for (const child of dom.children) {
    if (!(child instanceof HTMLElement) || child.matches(SKIP)) continue
    const r = child.getBoundingClientRect()
    const distance = y < r.top ? r.top - y : y >= r.bottom ? y - r.bottom : 0
    if (distance < nearest) {
      nearest = distance
      el = child
    }
  }
  if (!el || nearest > REACH) return null
  while (el.matches('ul, ol')) {
    const item = [...el.children].find(
      (c): c is HTMLElement => c instanceof HTMLElement && spans(c, y),
    )
    if (!item) break
    el = item
    const nested = [...item.children].find(
      (c): c is HTMLElement =>
        c instanceof HTMLElement && c.matches('ul, ol') && spans(c, y),
    )
    if (!nested) break
    el = nested
  }
  return el
}

/** the document position of the node an element draws, if it is one */
function posOf(view: View, el: HTMLElement): number | null {
  let p: number
  try {
    p = view.posAtDOM(el, 0)
  } catch {
    return null
  }
  const $p = view.state.doc.resolve(p)
  const candidates = [p, p - 1]
  for (let d = $p.depth; d > 0; d--) candidates.push($p.before(d))
  for (const c of candidates) {
    if (c < 0) continue
    try {
      if (view.nodeDOM(c) === el) return c
    } catch {
      // not a node boundary
    }
  }
  return null
}

function place() {
  const el = target.value
  if (!el || !el.isConnected) {
    hide()
    return
  }
  const r = el.getBoundingClientRect()
  // centred on the block's first line; a block shorter than a line (a
  // rule) has the grip centred on itself
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || SIZE
  const line = Math.min(lineHeight, r.height)
  top.value = r.top + (line - SIZE) / 2
  // an item's grip sits before its marker, at its list's edge
  const edge = el.matches('li')
    ? (el.parentElement?.getBoundingClientRect().left ?? r.left)
    : r.left
  left.value = edge - GAP - SIZE
}
function hide() {
  target.value = null
}

function onMove(e: MouseEvent) {
  if (dragging.value) return
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable) {
    hide()
    return
  }
  const t = e.target instanceof Element ? e.target : null
  if (t && layer.value?.contains(t)) return
  const el = blockAt(ed.view, e.clientX, e.clientY)
  if (!el) {
    hide()
    return
  }
  target.value = el
  place()
}

function selectBlock(): NodeSelection | null {
  const ed = editor.value
  const el = target.value
  if (!ed || ed.isDestroyed || !el) return null
  const pos = posOf(ed.view, el)
  if (pos === null) return null
  const sel = NodeSelection.create(ed.view.state.doc, pos)
  ed.view.dispatch(ed.view.state.tr.setSelection(sel))
  return sel
}

function onDragStart(e: DragEvent) {
  const ed = editor.value
  const el = target.value
  const sel = selectBlock()
  if (!ed || !el || !sel || !e.dataTransfer) {
    e.preventDefault()
    return
  }
  // what ProseMirror's drop reads: the block, and that it moves
  ed.view.dragging = { slice: sel.content(), move: true }
  e.dataTransfer.effectAllowed = 'copyMove'
  e.dataTransfer.clearData()
  e.dataTransfer.setData('text/html', el.outerHTML)
  e.dataTransfer.setData('text/plain', el.textContent ?? '')
  e.dataTransfer.setDragImage(el, 0, 0)
  dragging.value = true
  ed.view.dom.classList.add('rte-dragging')
}
function onDragEnd() {
  const ed = editor.value
  dragging.value = false
  hide()
  if (!ed || ed.isDestroyed) return
  ed.view.dom.classList.remove('rte-dragging')
  // as ProseMirror does after its own drags: the drop has read it by now
  const held = ed.view.dragging
  window.setTimeout(() => {
    if (!ed.isDestroyed && ed.view.dragging === held) ed.view.dragging = null
  }, 50)
}
function onClick() {
  const ed = editor.value
  if (selectBlock() && ed) ed.view.focus()
}

watch(
  () => editor.value,
  (ed, _old, onCleanup) => {
    if (!ed) return
    const settle = () => place()
    ed.on('transaction', settle)
    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('scroll', settle, true)
    document.addEventListener('mouseleave', hide)
    window.addEventListener('resize', settle)
    onCleanup(() => {
      ed.off('transaction', settle)
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('scroll', settle, true)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('resize', settle)
    })
  },
  { immediate: true },
)

const px = (n: number) => `${n}px`
</script>

<template>
  <Teleport to="body">
    <div ref="layer" class="rte-bh pointer-events-none fixed inset-0 z-[55]">
      <Tooltip v-if="target && !dragging" text="Drag to move" side="bottom">
        <button
          type="button"
          class="rte-bh-handle"
          :style="{ left: px(left), top: px(top) }"
          draggable="true"
          aria-label="Drag to move"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          @click="onClick"
        >
          <RteIcon name="drag" class="size-4" />
        </button>
      </Tooltip>
    </div>
  </Teleport>
</template>

<style>
/* the grip: 24px on 4px corners, gray-400 dots that darken on a gray-100
   ground under the pointer */
.rte-bh-handle {
  @apply pointer-events-auto fixed flex size-6 items-center justify-center rounded-[4px] text-ink-gray-4 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-6;
  cursor: grab;
}
.rte-bh-handle:active {
  cursor: grabbing;
}
</style>
