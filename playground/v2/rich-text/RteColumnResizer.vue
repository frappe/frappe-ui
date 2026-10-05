<script setup lang="ts">
// Notion's column bar, for the rows here. In the gap between two columns
// a bar stands under the pointer — on the hairline of a text row, in the
// middle of a picture row's gutter — and dragging it gives one column what
// it takes from the other; the rest of the row keeps its shares. The
// shares are kept on the row (`widths`, extensions.ts) so a row drawn
// again, or reloaded, keeps its proportions, and a row re-counted starts
// equal again. Everything else about the row — its hairline, its gutter,
// its cells — is as it was.
import { ref, watch } from 'vue'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'

const editor = useResolvedEditor(() => undefined)

/** the bar's place: the boundary's x, the row's top and height */
const left = ref(0)
const top = ref(0)
const height = ref(0)
const shown = ref(false)
const dragging = ref(false)

/** no column goes under this share of its row */
const MIN_SHARE = 0.1
/** how far either side of the gap the bar still answers */
const REACH = 6

interface Gap {
  row: HTMLElement
  cells: HTMLElement[]
  /** the gap after this cell */
  index: number
  /** where the bar stands */
  x: number
}
let hit: Gap | null = null

/** the gap under the pointer, in any row of columns */
function gapAt(x: number, y: number): Gap | null {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable) return null
  const rows = ed.view.dom.querySelectorAll<HTMLElement>(
    '[data-type="columns"]',
  )
  for (const row of rows) {
    const r = row.getBoundingClientRect()
    if (y < r.top || y >= r.bottom || x < r.left || x > r.right) continue
    const cells = [...row.children].filter(
      (c): c is HTMLElement => c instanceof HTMLElement,
    )
    const media = row.dataset.media === 'true'
    for (let i = 0; i < cells.length - 1; i++) {
      const a = cells[i].getBoundingClientRect()
      const b = cells[i + 1].getBoundingClientRect()
      // stacked, on a narrow page: no gap to take hold of
      if (b.left <= a.right) continue
      if (x < a.right - REACH || x > b.left + REACH) continue
      // a text row's second cell carries the hairline on its left edge:
      // the bar stands on it. A picture row has no rule, so the middle.
      const at = media ? (a.right + b.left) / 2 : b.left
      return { row, cells, index: i, x: at }
    }
  }
  return null
}

function place(gap: Gap) {
  const r = gap.row.getBoundingClientRect()
  left.value = gap.x
  top.value = r.top
  height.value = r.height
}

function onMove(e: MouseEvent) {
  if (dragging.value) return
  const gap = gapAt(e.clientX, e.clientY)
  hit = gap
  shown.value = !!gap
  if (gap) place(gap)
}

/** the position of the row's node, by the element the view draws it with */
function posOf(row: HTMLElement): number | null {
  const ed = editor.value
  if (!ed || ed.isDestroyed) return null
  let found: number | null = null
  ed.state.doc.descendants((node, pos) => {
    if (found !== null) return false
    if (node.type.name === 'columns' && ed.view.nodeDOM(pos) === row)
      found = pos
    return found === null
  })
  return found
}

function onDown(e: PointerEvent) {
  const gap = hit
  const ed = editor.value
  if (!gap || e.button !== 0 || !ed || ed.isDestroyed) return
  const pos = posOf(gap.row)
  if (pos === null) return
  e.preventDefault()
  const { index } = gap
  const media = gap.row.dataset.media === 'true'
  const start = gap.cells.map((c) => c.getBoundingClientRect().width)
  const total = start.reduce((sum, w) => sum + w, 0)
  const pair = start[index] + start[index + 1]
  const floor = total * MIN_SHARE
  const x0 = e.clientX
  const original =
    (ed.state.doc.nodeAt(pos)?.attrs.widths as number[] | null) ?? null
  let shares = start.map((w) => w / total)

  // The shares go through the document, never onto the row's element: an
  // inline style written there is a mutation ProseMirror's observer answers
  // by drawing the node again, and the element in hand goes stale under
  // the pointer. The live shares are kept off the record; on release the
  // row is put back as it began and the drag written as one step, so one
  // undo takes the whole of it back.
  const write = (widths: number[] | null, record: boolean) => {
    if (ed.isDestroyed) return
    const node = ed.state.doc.nodeAt(pos)
    if (!node || node.type.name !== 'columns') return
    const tr = ed.state.tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      widths,
    })
    if (!record) tr.setMeta('addToHistory', false)
    ed.view.dispatch(tr)
  }

  dragging.value = true
  document.body.classList.add('rte-col-drag')
  const zone = e.currentTarget as HTMLElement
  zone.setPointerCapture(e.pointerId)

  const move = (ev: PointerEvent) => {
    const dx = ev.clientX - x0
    const a = Math.min(Math.max(start[index] + dx, floor), pair - floor)
    const next = start.slice()
    next[index] = a
    next[index + 1] = pair - a
    shares = next.map((w) => w / total)
    write(shares, false)
    // the row is drawn anew with each share: the bar follows the boundary
    // the new drawing puts down
    const row = ed.view.nodeDOM(pos)
    if (!(row instanceof HTMLElement)) return
    const cells = [...row.children].filter(
      (c): c is HTMLElement => c instanceof HTMLElement,
    )
    const ra = cells[index]?.getBoundingClientRect()
    const rb = cells[index + 1]?.getBoundingClientRect()
    if (ra && rb) left.value = media ? (ra.right + rb.left) / 2 : rb.left
  }
  const up = () => {
    zone.removeEventListener('pointermove', move)
    zone.removeEventListener('pointerup', up)
    zone.removeEventListener('pointercancel', up)
    document.body.classList.remove('rte-col-drag')
    dragging.value = false
    write(original, false)
    write(shares, true)
    hit = null
    shown.value = false
  }
  zone.addEventListener('pointermove', move)
  zone.addEventListener('pointerup', up)
  zone.addEventListener('pointercancel', up)
}

watch(
  () => editor.value,
  (ed, _old, onCleanup) => {
    if (!ed) return
    const hide = () => {
      if (!dragging.value) shown.value = false
    }
    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('scroll', hide, true)
    document.addEventListener('mouseleave', hide)
    onCleanup(() => {
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('scroll', hide, true)
      document.removeEventListener('mouseleave', hide)
    })
  },
  { immediate: true },
)

const px = (n: number) => `${n}px`
</script>

<template>
  <Teleport to="body">
    <div
      v-if="shown || dragging"
      class="rte-cr"
      :class="dragging && 'is-dragging'"
      :style="{ left: px(left), top: px(top), height: px(height) }"
      aria-hidden="true"
      @pointerdown="onDown"
    >
      <div class="rte-cr-bar" />
    </div>
  </Teleport>
</template>

<style>
/* the hand's target is 12px across the gap; the bar in it is 3px on full
   corners, gray-400, gray-600 under the pointer and while it drags */
.rte-cr {
  position: fixed;
  z-index: 54;
  display: flex;
  width: 12px;
  margin-left: -6px;
  justify-content: center;
  cursor: col-resize;
  touch-action: none;
}
.rte-cr-bar {
  width: 3px;
  height: 100%;
  border-radius: 9999px;
  background: var(--outline-gray-4);
  transition: background-color 120ms;
}
.rte-cr:hover .rte-cr-bar,
.rte-cr.is-dragging .rte-cr-bar {
  background: var(--ink-gray-6);
}
body.rte-col-drag {
  cursor: col-resize;
  user-select: none;
}
</style>
