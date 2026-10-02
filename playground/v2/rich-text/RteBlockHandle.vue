<script setup lang="ts">
// A block's grip, as Notion draws it: six dots in the margin beside the
// block under the pointer, "Drag to move" beneath, that carry the block
// to wherever it is dropped. Every top-level block has one — a paragraph,
// a heading, a list, a quote, a code block, a table, an image, a callout,
// the columns — and inside a list the item under the pointer has its own,
// down to the innermost list.
//
// The drag is drawn here, as Notion draws it: the browser's snapshot is
// replaced by a translucent copy of the block that follows the pointer at
// the offset it was picked up, a line marks the edge of the block the
// pointer is over — above it in its top half, below it in its bottom — and
// the drop puts the block at that edge, wherever over the document or its
// margins the pointer lets go. A click selects the block.
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
// not reactive: a re-render of the grip while it is the source of a drag
// makes the browser end the drag, so a drag leaves the grip's DOM alone
let dragging = false

/** how far left of the document the grip still answers the pointer */
const GUTTER = 72
const SIZE = 24
/** the gap between the grip and the block */
const GAP = 6
/** how far past a block's edge, into the gap around it, its grip still answers */
const REACH = 16

/** what carries a block's first line of text */
const FIRST_LINE = 'p, h1, h2, h3, h4, h5, h6, summary, pre'
/** what the editor draws at the top level that is not a block */
const SKIP =
  '.ProseMirror-gapcursor, .ProseMirror-widget, .ProseMirror-separator, br'
const spans = (el: Element, y: number) => {
  const r = el.getBoundingClientRect()
  return y >= r.top && y < r.bottom
}

/** the block under the pointer: a top-level block, or a list's item */
function blockAt(
  view: View,
  x: number,
  y: number,
  loose = false,
): HTMLElement | null {
  const dom = view.dom as HTMLElement
  const d = dom.getBoundingClientRect()
  // a drop answers from anywhere across the page's width
  const span = loose ? window.innerWidth : GUTTER
  if (x < d.left - span || x > d.right + span || y < d.top || y > d.bottom)
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
  if (dragging) return
  const el = target.value
  if (!el || !el.isConnected) {
    hide()
    return
  }
  const r = el.getBoundingClientRect()
  // centred on the block's first line of text — an item's, a quote's, a
  // callout's, a table's first row's, the summary of an expand block —
  // not on the block's box, which margins and padding push away from the
  // line; a block shorter than a line (a rule) has the grip centred on
  // itself
  const first = el.matches(FIRST_LINE)
    ? el
    : (el.querySelector(FIRST_LINE) ?? el)
  const fr = first.getBoundingClientRect()
  const lineHeight = parseFloat(getComputedStyle(first).lineHeight) || SIZE
  const line = Math.min(lineHeight, fr.height)
  top.value = fr.top + (line - SIZE) / 2
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
  if (dragging) return
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

// ---- the drag: the block picked up, the copy that follows the pointer,
// the line at the edge it would land on
let source: { el: HTMLElement; pos: number } | null = null
let grab = { dx: 0, dy: 0 }
let ghost: HTMLElement | null = null
let line: HTMLElement | null = null
let landing: { pos: number; before: boolean } | null = null
// the browser's own snapshot is replaced by nothing: the copy is drawn here
const blank = new Image()
blank.src =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function onDragStart(e: DragEvent) {
  const ed = editor.value
  const el = target.value
  const sel = selectBlock()
  if (!ed || !el || !sel || !e.dataTransfer) {
    e.preventDefault()
    return
  }
  const r = el.getBoundingClientRect()
  source = { el, pos: sel.from }
  grab = { dx: e.clientX - r.left, dy: e.clientY - r.top }
  // what ProseMirror would read, should a drop ever reach it: the block,
  // and that it moves
  ed.view.dragging = { slice: sel.content(), move: true }
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.clearData()
  e.dataTransfer.setData('text/html', el.outerHTML)
  e.dataTransfer.setData('text/plain', el.textContent ?? '')
  e.dataTransfer.setDragImage(blank, 0, 0)
  dragging = true
  // the grip goes out of sight, by hand: see `dragging`
  ;(e.currentTarget as HTMLElement | null)?.classList.add('is-dragging')
  ed.view.dom.classList.add('rte-dragging')
  document.body.classList.add('rte-block-drag')
  // the copy: the block as drawn, at the document's type, half seen
  ghost = document.createElement('div')
  ghost.className = 'rte-bh-ghost'
  ghost.style.width = `${r.width}px`
  const doc = document.createElement('div')
  doc.className = ed.view.dom.className
    .replace(/\bProseMirror-\S+/g, '')
    .replace('rte-dragging', '')
  const copy = el.cloneNode(true) as HTMLElement
  copy.classList.remove('ProseMirror-selectednode')
  doc.appendChild(copy)
  ghost.appendChild(doc)
  document.body.appendChild(ghost)
  moveGhost(e.clientX, e.clientY)
  line = document.createElement('div')
  line.className = 'rte-bh-line'
  line.hidden = true
  document.body.appendChild(line)
  document.addEventListener('dragover', onDragOver, true)
  document.addEventListener('dragenter', onDragOver, true)
  document.addEventListener('drop', onDrop, true)
}
function moveGhost(x: number, y: number) {
  if (ghost)
    ghost.style.transform = `translate(${x - grab.dx}px, ${y - grab.dy}px)`
}
/** the edge the pointer is over: a block's top in its upper half, else its bottom */
function landingAt(x: number, y: number) {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !source) return null
  const el = blockAt(ed.view, x, y, true)
  if (!el || el === source.el || source.el.contains(el)) return null
  const pos = posOf(ed.view, el)
  if (pos === null) return null
  const r = el.getBoundingClientRect()
  return { el, pos, before: y < r.top + r.height / 2, box: r }
}
function onDragOver(e: DragEvent) {
  if (!dragging) return
  moveGhost(e.clientX, e.clientY)
  const at = landingAt(e.clientX, e.clientY)
  if (!at) {
    landing = null
    if (line) line.hidden = true
    return
  }
  // the drop is ours, wherever the pointer is
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  landing = { pos: at.pos, before: at.before }
  if (line) {
    line.hidden = false
    line.style.left = `${at.box.left}px`
    line.style.width = `${at.box.width}px`
    line.style.top = `${at.before ? at.box.top - 3 : at.box.bottom}px`
  }
}
function onDrop(e: DragEvent) {
  if (!dragging) return
  e.preventDefault()
  e.stopPropagation()
  const ed = editor.value
  const at = landingAt(e.clientX, e.clientY) ?? landing
  const from = source
  finishDrag()
  if (!ed || ed.isDestroyed || !at || !from) return
  const { state } = ed.view
  const node = state.doc.nodeAt(from.pos)
  const beside = state.doc.nodeAt(at.pos)
  if (!node || !beside) return
  const edge = at.before ? at.pos : at.pos + beside.nodeSize
  // the block is already there
  if (edge === from.pos || edge === from.pos + node.nodeSize) return
  const tr = state.tr.delete(from.pos, from.pos + node.nodeSize)
  const to = tr.mapping.map(edge, at.before ? -1 : 1)
  // insert fits the block to its new place: an item dropped among
  // paragraphs is wrapped in a list, a paragraph among items in an item
  tr.insert(to, node)
  // the block, wherever the fit put it, stays selected
  let moved: number | null = null
  tr.doc.nodesBetween(
    Math.max(0, to - 2),
    Math.min(tr.doc.content.size, to + node.nodeSize + 2),
    (n, pos) => {
      if (moved === null && n.type === node.type && n.eq(node)) moved = pos
      return moved === null
    },
  )
  if (moved !== null) tr.setSelection(NodeSelection.create(tr.doc, moved))
  ed.view.dispatch(tr.scrollIntoView())
  ed.view.focus()
}
function finishDrag() {
  const ed = editor.value
  dragging = false
  source = null
  landing = null
  ghost?.remove()
  ghost = null
  line?.remove()
  line = null
  document.removeEventListener('dragover', onDragOver, true)
  document.removeEventListener('dragenter', onDragOver, true)
  document.removeEventListener('drop', onDrop, true)
  document.body.classList.remove('rte-block-drag')
  if (ed && !ed.isDestroyed) {
    ed.view.dom.classList.remove('rte-dragging')
    ed.view.dragging = null
  }
}
function onDragEnd(e: DragEvent) {
  ;(e.currentTarget as HTMLElement | null)?.classList.remove('is-dragging')
  finishDrag()
  hide()
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
      <!-- the grip stays mounted through a drag, hidden: the browser ends
           a drag whose source leaves the document -->
      <Tooltip v-if="target" text="Drag to move" side="bottom">
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
/* out of sight, not out of the way: the browser ends a drag whose source
   stops taking pointer events */
.rte-bh-handle.is-dragging {
  opacity: 0;
}
/* the copy that follows the pointer: the block at half strength, and the
   line at the edge it would land on, 3px of gray-900 across the block */
.rte-bh-ghost {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 70;
  pointer-events: none;
  opacity: 0.5;
  will-change: transform;
}
.rte-bh-line {
  position: fixed;
  z-index: 65;
  height: 3px;
  border-radius: 9999px;
  pointer-events: none;
  background-color: var(--surface-gray-10, #383838);
}
/* the library's drop cursor stands down while the grip's line is up */
body.rte-block-drag .editor-drop-cursor {
  display: none !important;
}
</style>
