<script setup lang="ts">
// Figma: espresso-2.0 › table (32157:9144). The table's controls, drawn
// over the document on a fixed layer so nothing is clipped by the table's
// scrolling card:
//
// - handles on the row and column of the cell under the pointer, or of the
//   caret's cell (32925:95940): a 12×1 gray-500 pill on a 2px white rule,
//   at the left edge of the row and the top edge of the column; a selected
//   cell (32925:96501) adds one at its right edge, and a selected run, row
//   or column keeps its handles while the pointer roams. Hovered, a handle
//   grows into the file's grip — a 10×20 (or 20×10) gray-500 pill with
//   white dots — and opens its menu
//   (32926:97034, 97642, 98372): Table Header (the first row), Colour,
//   Insert, Duplicate, Clear content, Delete for a row or column; Colour,
//   and for a run of cells Merge cells and Delete content, for a cell. The
//   file's Border options submenu is set aside for now (it lived here up
//   to 7a35865b3f; the row's border attribute and rules stay);
// - a grip dragged (4px off its press) carries its row or column, as
//   Notion's does: the row or column keeps its ring, a 3px line marks the
//   edge it will land on — above or below a row, before or after a
//   column — and the drop moves it there whole, its cells and widths with
//   it; the first rows stay header rows, whichever rows land there;
// - two 16px strips, 8px off the table's right and bottom edges, that add
//   a column or a row at the end;
// - the card is the table's viewport: a table that outgrows it scrolls
//   inside it, never the page. A fresh table shares the card's width
//   between its columns; once a column is added or resized every column
//   holds the width it has, so the new or wider one grows the table past
//   the card instead of squeezing the others.
//
// Dragging a column edge resizes it: tiptap's own behaviour and handle.
//
// The menus are the library's Dropdown, portalled into this layer so the
// file's 220px, 4px-in, 12px-radius card can be applied to them, and not
// modal: a modal menu marks every block around the editor's live regions
// aria-hidden, which ProseMirror reads back as a change to the document
// and rebuilds the table under the grips.
import { computed, h, ref, shallowRef, watch } from 'vue'
import {
  Fragment,
  type Node as PMNode,
  type ResolvedPos,
} from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import {
  CellSelection,
  TableMap,
  cellAround,
  columnResizingPluginKey,
  isInTable,
} from '@tiptap/pm/tables'
import { Dropdown } from '../../../src'
import type { MenuOptions } from '../../../src/components/Menu/types'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import type { TiptapEditor } from '../../../src/molecules/editor'
import { PALETTE_COLORS } from '../../../src/molecules/editor/extensions/shared/color-palette'
import RteIcon from './RteIcon.vue'

const editor = useResolvedEditor(() => undefined)
const icon = (name: string) => () => h(RteIcon, { name })

type Box = { left: number; top: number; width: number; height: number }
const box = (r: DOMRect): Box => ({
  left: r.left,
  top: r.top,
  width: r.width,
  height: r.height,
})

// ---- what the controls follow: the caret's cell, held as a document
// position and resolved to the DOM on each measure — a selection change
// redraws the cells it decorates, so an element held across it goes stale
const layer = ref<HTMLElement | null>(null)
const menuHost = ref<HTMLElement | null>(null)
const wrapperEl = shallowRef<HTMLElement | null>(null)
const anchorPos = ref<number | null>(null)
const rowIndex = ref(-1)
const colIndex = ref(-1)
const cellCount = ref(0)
const cellMerged = ref(false)
/** what the selection is: the caret's cell, a run of cells, a row, a column */
const selKind = ref<'caret' | 'cells' | 'row' | 'col' | null>(null)

const tableBox = ref<Box | null>(null)
const rowBox = ref<Box | null>(null)
const colBox = ref<Box | null>(null)
const cellBox = ref<Box | null>(null)
/** the cell handle's edge is within the card's visible span */
const cellKnobOn = ref(false)
/** an x within the card, the table's viewport, which clips what it holds */
function inCard(x: number): boolean {
  const t = tableBox.value
  return !!t && x >= t.left && x <= t.left + t.width
}

const rowOpen = ref(false)
const colOpen = ref(false)
const cellOpen = ref(false)
const menuOpen = computed(
  () => rowOpen.value || colOpen.value || cellOpen.value,
)

// ---- table geometry from the document
type Ctx = {
  ed: TiptapEditor
  table: PMNode
  start: number
  map: TableMap
}
function ctxAt(ed: TiptapEditor, $pos: ResolvedPos): Ctx | null {
  for (let d = $pos.depth; d >= 0; d--) {
    if ($pos.node(d).type.name === 'table') {
      const table = $pos.node(d)
      return { ed, table, start: $pos.start(d), map: TableMap.get(table) }
    }
  }
  return null
}
function ctxOf(ed: TiptapEditor): Ctx | null {
  const el = wrapperEl.value?.querySelector('table')
  if (!el || !el.isConnected) return null
  try {
    return ctxAt(ed, ed.state.doc.resolve(ed.view.posAtDOM(el, 0)))
  } catch {
    return null
  }
}
const cellPos = (c: Ctx, row: number, col: number) =>
  c.start + c.map.map[row * c.map.width + col]
/** the distinct cells of a row or column, top-left first */
function cellsIn(c: Ctx, axis: 'row' | 'col', index: number): number[] {
  const out: number[] = []
  const n = axis === 'row' ? c.map.width : c.map.height
  for (let i = 0; i < n; i++) {
    const pos = axis === 'row' ? cellPos(c, index, i) : cellPos(c, i, index)
    if (!out.includes(pos)) out.push(pos)
  }
  return out
}
function rowNodeAt(c: Ctx, row: number): { node: PMNode; pos: number } {
  let pos = c.start
  for (let i = 0; i < row; i++) pos += c.table.child(i).nodeSize
  return { node: c.table.child(row), pos }
}

// ---- measuring
function measure() {
  const ed = editor.value
  let cellEl: HTMLElement | null = null
  if (anchorPos.value !== null && ed && !ed.isDestroyed) {
    try {
      cellEl = cellDom(ed.view, anchorPos.value)
    } catch {
      cellEl = null
    }
  }
  if (cellEl)
    wrapperEl.value =
      cellEl.closest<HTMLElement>('.tableWrapper') ?? cellEl.closest('table')
  const w = wrapperEl.value
  if (!w || !w.isConnected) {
    clearAll()
    return
  }
  tableBox.value = box(w.getBoundingClientRect())
  const r = cellEl?.closest('tr')
  rowBox.value = r ? box(r.getBoundingClientRect()) : null
  // a column scrolled out of the card has no handle over the page
  if (cellEl) {
    const cr = cellEl.getBoundingClientRect()
    const mid = cr.left + cr.width / 2
    colBox.value = inCard(mid)
      ? {
          left: cr.left,
          top: tableBox.value.top,
          width: cr.width,
          height: tableBox.value.height,
        }
      : null
  } else colBox.value = null
  const selected = w.querySelectorAll<HTMLElement>('.selectedCell')
  if (selected.length) {
    let left = Infinity
    let top = Infinity
    let right = -Infinity
    let bottom = -Infinity
    selected.forEach((el) => {
      const b = el.getBoundingClientRect()
      left = Math.min(left, b.left)
      top = Math.min(top, b.top)
      right = Math.max(right, b.right)
      bottom = Math.max(bottom, b.bottom)
    })
    cellBox.value = { left, top, width: right - left, height: bottom - top }
    fitSelectionBox(w, cellBox.value)
    cellKnobOn.value = inCard(right)
  } else if (cellEl && selKind.value === 'caret') {
    cellBox.value = box(cellEl.getBoundingClientRect())
    cellKnobOn.value = inCard(cellBox.value.left + cellBox.value.width)
  } else {
    cellBox.value = null
    cellKnobOn.value = false
  }
}
// the run's selection box is drawn by the library on the cells' outer
// edges, which leaves its left and top lines a pixel inside the rules; it
// moves out onto them, as the cell's own ring does (a margin and a padding,
// which the library never sets, so its own redraws keep them), stops at the
// card's edge, and where it reaches a corner of the card takes the card's
// inner 11px radius, or the card clips the corner off it
function fitSelectionBox(w: HTMLElement, run: Box) {
  const ring = w.querySelector<HTMLElement>('.table-selection-box')
  const table = w.querySelector('table')
  const t = table?.getBoundingClientRect()
  if (!ring || !table || !t) return
  const at = (x: number, y: number) => Math.abs(x - y) <= 1.5
  const radius = (corner: boolean) => (corner ? '11px' : '0px')
  const top = at(run.top, t.top)
  const bottom = at(run.top + run.height, t.bottom)
  const left = at(run.left, t.left)
  const right = at(run.left + run.width, t.right)
  ring.style.marginLeft = left ? '0px' : '-1px'
  ring.style.paddingRight = left ? '0px' : '1px'
  ring.style.marginTop = top ? '0px' : '-1px'
  ring.style.paddingBottom = top ? '0px' : '1px'
  // over a scrolling table the card's bar lies on the last row's foot (the
  // table gives its height back, in the stylesheet): a run reaching it
  // closes above the bar, as the cell's own ring does
  const bar = bottom
    ? Math.max(0, -parseFloat(getComputedStyle(table).marginBottom))
    : 0
  ring.style.height = `${run.height - bar}px`
  ring.style.borderTopLeftRadius = radius(top && left)
  ring.style.borderTopRightRadius = radius(top && right)
  ring.style.borderBottomLeftRadius = radius(bottom && left)
  ring.style.borderBottomRightRadius = radius(bottom && right)
}
function clearAll() {
  wrapperEl.value = null
  anchorPos.value = null
  tableBox.value = null
  rowBox.value = null
  colBox.value = null
  cellBox.value = null
  selKind.value = null
}

// ---- the selection: a row, a column, a run of cells, or the caret's cell;
// the cell under the pointer takes over from a caret (or no caret in a
// table), so the handles sit on the row and column being pointed at; a
// selected cell or run keeps its handles, as Notion's table does
function syncSelection() {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable || menuOpen.value) return
  let view
  try {
    view = ed.view
  } catch {
    return
  }
  const { selection } = ed.state
  const $selCell = isInTable(ed.state) ? cellAround(selection.$from) : null
  let $cell = $selCell
  let kind: typeof selKind.value = null
  let count = 0
  if ($selCell) {
    const cells = asCellSelection(selection)
    if (cells) {
      cells.forEachCell(() => count++)
      kind = cells.isRowSelection()
        ? 'row'
        : cells.isColSelection()
          ? 'col'
          : 'cells'
    } else {
      count = 1
      kind = 'caret'
    }
  }
  // the pointer's cell takes the row and column handles from a caret (or
  // no caret); a selected cell, run, row or column keeps them
  if (hoverPos.value !== null && (kind === 'caret' || kind === null)) {
    const $hover = cellAt(ed, hoverPos.value)
    if ($hover) $cell = $hover
  }
  if (!$cell) {
    // the caret left the table: the controls stay while the pointer hovers
    if (!hovering) clearAll()
    anchorPos.value = null
    cellBox.value = null
    cellCount.value = 0
    selKind.value = null
    return
  }
  const c = ctxAt(ed, $cell)
  if (!c) return
  const dom = view.nodeDOM(c.start - 1)
  const tableDom =
    dom instanceof HTMLElement
      ? dom.tagName === 'TABLE'
        ? dom
        : dom.querySelector('table')
      : null
  const wrapper = tableDom?.closest<HTMLElement>('.tableWrapper') ?? tableDom
  if (wrapper) wrapperEl.value = wrapper
  // the handles sit on the cell's row and column
  const rect = c.map.findCell($cell.pos - c.start)
  anchorPos.value = $cell.pos
  rowIndex.value = rect.top
  colIndex.value = rect.left
  cellCount.value = count
  selKind.value = kind
  const cell = $selCell?.nodeAfter
  cellMerged.value =
    !!cell && (cell.attrs.colspan > 1 || cell.attrs.rowspan > 1)
  measure()
}
/** the position resolved, when it still opens on a cell */
function cellAt(ed: TiptapEditor, pos: number): ResolvedPos | null {
  try {
    const $pos = ed.state.doc.resolve(pos)
    const role = $pos.nodeAfter?.type.spec.tableRole
    return role === 'cell' || role === 'header_cell' ? $pos : null
  } catch {
    return null
  }
}
// The editor's own cell selections (a shift-click, a drag across cells)
// come from the table extension's bundled copy of prosemirror-tables, a
// different class from the one imported here, so they are told by shape.
function asCellSelection(selection: unknown): CellSelection | null {
  return selection &&
    typeof selection === 'object' &&
    '$anchorCell' in selection
    ? (selection as CellSelection)
    : null
}
function cellDom(view: TiptapEditor['view'], pos: number): HTMLElement | null {
  const dom = view.nodeDOM(pos)
  return dom instanceof HTMLElement ? dom : null
}

// ---- hovering: the handles and strips follow the cell under the pointer,
// held as a document position; a selected run, row or column keeps its own
// handles. Off the table (past the strips) the caret's cell has them back
let hovering = false
const hoverPos = ref<number | null>(null)
function onMove(e: MouseEvent) {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable || menuOpen.value) return
  if (press?.active) return
  holdBeforeResize(ed)
  const target = e.target instanceof Element ? e.target : null
  if (!target) return
  if (layer.value?.contains(target)) return
  const cell = target.closest<HTMLElement>('.rte-doc td, .rte-doc th')
  if (cell) {
    hovering = true
    let pos: number | null = null
    try {
      const $cell = cellAround(ed.state.doc.resolve(ed.view.posAtDOM(cell, 0)))
      pos = $cell ? $cell.pos : null
    } catch {
      pos = null
    }
    if (pos === null || pos === hoverPos.value) return
    hoverPos.value = pos
    syncSelection()
    return
  }
  const t = tableBox.value
  const near =
    t &&
    e.clientX >= t.left - 12 &&
    e.clientX <= t.left + t.width + 28 &&
    e.clientY >= t.top - 12 &&
    e.clientY <= t.top + t.height + 28
  if (near) return
  hovering = false
  if (hoverPos.value === null) {
    if (!isInTable(ed.state)) clearAll()
    return
  }
  hoverPos.value = null
  syncSelection()
}

// ---- a hovered handle only grows into its grip. A press on the grip
// selects its row or column; released in place it opens the menu, as
// Notion's does, and carried 4px it drags the row or column instead: a
// 3px line marks the edge the pointer is nearest — above or below a row,
// before or after a column — and the release moves it there. The grips
// are not the menus' triggers (those are the unseen anchors beside them,
// so the library's open-on-press stays out of the drag); the menus open
// and close through their models.
type DragKind = 'row' | 'col'
type Press = {
  kind: DragKind | 'cell'
  index: number
  x: number
  y: number
  lastX: number
  lastY: number
  el: HTMLElement
  pointerId: number
  wasOpen: boolean
  active: boolean
  to: number | null
}
let press: Press | null = null
const dragKind = ref<DragKind | null>(null)
// the landing line: where it is, and whether it shows — it keeps its
// place while hidden, so it glides from the last edge to the next
const dropLine = ref<Box | null>(null)
const dropOn = ref(false)
const stills = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const openFor = { row: rowOpen, col: colOpen, cell: cellOpen }
const DRAG_START = 4
const SCROLL_EDGE = 40

function onPress(kind: Press['kind'], e: PointerEvent) {
  if (e.button !== 0 || press) return
  const index =
    kind === 'row' ? rowIndex.value : kind === 'col' ? colIndex.value : -1
  if (kind === 'row') selectRow(index)
  else if (kind === 'col') selectCol(index)
  const el = e.currentTarget as HTMLElement
  press = {
    kind,
    index,
    x: e.clientX,
    y: e.clientY,
    lastX: e.clientX,
    lastY: e.clientY,
    el,
    pointerId: e.pointerId,
    // an open menu closes on this press (it is outside the menu), and a
    // release in place leaves it closed
    wasOpen: openFor[kind].value,
    active: false,
    to: null,
  }
  el.setPointerCapture(e.pointerId)
  // the press neither focuses the grip nor starts a text selection
  e.preventDefault()
}
function onPressMove(e: PointerEvent) {
  const p = press
  if (!p || p.pointerId !== e.pointerId) return
  p.lastX = e.clientX
  p.lastY = e.clientY
  if (!p.active) {
    if (p.kind === 'cell') return
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_START) return
    if (!canDrag(p.kind, p.index)) return
    p.active = true
    dragKind.value = p.kind
    openFor[p.kind].value = false
    document.body.classList.add('rte-tc-dragging')
    document.addEventListener('keydown', onDragKey, true)
    lift(p)
    autoScroll()
  }
  aim()
  carry(p)
}
function onRelease(e: PointerEvent) {
  const p = press
  if (!p || p.pointerId !== e.pointerId) return
  endPress()
  if (p.active) {
    if (p.to !== null) moveLine(p.kind as DragKind, p.index, p.to)
  } else if (!p.wasOpen) {
    openFor[p.kind].value = true
  }
}
function onPressCancel(e: PointerEvent) {
  if (press && press.pointerId === e.pointerId) endPress()
}
function onDragKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    endPress()
  }
}
function endPress() {
  const p = press
  press = null
  if (!p) return
  try {
    p.el.releasePointerCapture(p.pointerId)
  } catch {
    // the pointer is already gone
  }
  dragKind.value = null
  dropLine.value = null
  dropOn.value = false
  drop()
  document.body.classList.remove('rte-tc-dragging')
  document.removeEventListener('keydown', onDragKey, true)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  scrollRaf = 0
}
function openMenu(kind: Press['kind']) {
  openFor[kind].value = true
}

/** the leading rows made of header cells */
function headerRows(c: Ctx): number {
  let n = 0
  for (let i = 0; i < c.table.childCount; i++) {
    const row = c.table.child(i)
    let all = row.childCount > 0
    for (let j = 0; j < row.childCount; j++)
      if (row.child(j).type.name !== 'tableHeader') all = false
    if (!all) break
    n++
  }
  return n
}
// a row moves whole, so only a cell spanning rows is in its way; a column
// is cut out of every row, so any merged cell is
function canDrag(kind: DragKind, index: number): boolean {
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c || index < 0) return false
  if ((kind === 'row' ? c.map.height : c.map.width) < 2) return false
  let ok = true
  c.table.descendants((node) => {
    if (!ok) return false
    const name = node.type.name
    if (name !== 'tableCell' && name !== 'tableHeader') return true
    if (node.attrs.rowspan > 1 || (kind === 'col' && node.attrs.colspan > 1))
      ok = false
    return false
  })
  return ok
}
/** the edges a row or column can land on, along its axis, in viewport px */
function edgesOf(w: HTMLElement, kind: DragKind): number[] {
  if (kind === 'row') {
    const rows = [...w.querySelectorAll<HTMLElement>('tr')].map((r) =>
      r.getBoundingClientRect(),
    )
    if (!rows.length) return []
    return [...rows.map((r) => r.top), rows[rows.length - 1].bottom]
  }
  const cells = [...(w.querySelector('tr')?.children ?? [])].map((c) =>
    c.getBoundingClientRect(),
  )
  if (!cells.length) return []
  return [...cells.map((r) => r.left), cells[cells.length - 1].right]
}
// the line goes to the edge nearest the pointer, which is the hovered
// row's top above its middle and its bottom beneath; the dragged line's
// own edges are no move, and show nothing
function aim() {
  const p = press
  const w = wrapperEl.value
  const t = tableBox.value
  if (!p || !p.active || p.kind === 'cell' || !w || !t) return
  const edges = edgesOf(w, p.kind)
  if (!edges.length) return
  const at = p.kind === 'row' ? p.lastY : p.lastX
  let to = 0
  let best = Infinity
  edges.forEach((edge, i) => {
    const d = Math.abs(edge - at)
    if (d < best) {
      best = d
      to = i
    }
  })
  const lineAt = (edge: number): Box =>
    p.kind === 'row'
      ? { left: t.left + 1, top: edge - 1.5, width: t.width - 2, height: 3 }
      : { left: edge - 1.5, top: t.top + 1, width: 3, height: t.height - 2 }
  if (to === p.index || to === p.index + 1) {
    p.to = null
    dropOn.value = false
    // not yet shown: it waits on the dragged line's own edge, to set out from
    if (!dropLine.value) dropLine.value = lineAt(edges[to])
    return
  }
  p.to = to
  dropLine.value = lineAt(edges[to])
  // a column's edge scrolled out of the card is no place to show a line;
  // the card scrolls on as the pointer nears its side
  dropOn.value = p.kind === 'row' || inCard(edges[to])
}
// ---- the ghost: a copy of the row or column, lifted under the pointer
// and carried along its axis, within the table's reach
let ghost: HTMLElement | null = null
let ghostAt = { left: 0, top: 0, size: 0 }
let grab = 0
function lift(p: Press) {
  const ed = editor.value
  const w = wrapperEl.value
  const table = w?.querySelector('table')
  if (!ed || !w || !table || p.kind === 'cell') return
  drop()
  const rows = [...w.querySelectorAll<HTMLElement>('tr')]
  const tb = table.getBoundingClientRect()
  const host = document.createElement('div')
  host.className = 'rte-tc-ghost'
  const doc = document.createElement('div')
  doc.className = ed.view.dom.className
    .replace(/\bProseMirror-\S+/g, '')
    .replace('rte-dragging', '')
  const copy = document.createElement('table')
  copy.className = table.className
  const body = document.createElement('tbody')
  if (p.kind === 'row') {
    const src = rows[p.index]
    if (!src) return
    const r = src.getBoundingClientRect()
    const cols = table.querySelector('colgroup')
    if (cols) copy.appendChild(cols.cloneNode(true))
    body.appendChild(src.cloneNode(true))
    copy.style.width = `${tb.width}px`
    ghostAt = { left: tb.left, top: r.top, size: r.height }
    grab = p.y - r.top
  } else {
    let width = 0
    rows.forEach((row) => {
      const cell = row.children[p.index] as HTMLElement | undefined
      if (!cell) return
      const r = cell.getBoundingClientRect()
      width = Math.max(width, r.width)
      const tr = document.createElement('tr')
      const td = cell.cloneNode(true) as HTMLElement
      td.style.height = `${r.height}px`
      tr.appendChild(td)
      body.appendChild(tr)
    })
    copy.style.width = `${width}px`
    const first = rows[0]?.children[p.index]?.getBoundingClientRect()
    ghostAt = { left: first?.left ?? tb.left, top: tb.top, size: width }
    grab = p.x - ghostAt.left
  }
  body
    .querySelectorAll('.selectedCell')
    .forEach((el) => el.classList.remove('selectedCell'))
  copy.appendChild(body)
  doc.appendChild(copy)
  host.appendChild(doc)
  host.style.left = `${ghostAt.left}px`
  host.style.top = `${ghostAt.top}px`
  host.style.width = `${p.kind === 'row' ? tb.width : ghostAt.size}px`
  document.body.appendChild(host)
  ghost = host
  carry(p)
  requestAnimationFrame(() => ghost?.classList.add('is-up'))
}
function carry(p: Press) {
  const t = tableBox.value
  if (!ghost || !t || p.kind === 'cell') return
  if (p.kind === 'row') {
    const top = Math.min(
      Math.max(p.lastY - grab, t.top + 1),
      t.top + t.height - 1 - ghostAt.size,
    )
    ghost.style.transform = `translate3d(0, ${top - ghostAt.top}px, 0)`
  } else {
    const left = Math.min(
      Math.max(p.lastX - grab, t.left + 1),
      t.left + t.width - 1 - ghostAt.size,
    )
    ghost.style.transform = `translate3d(${left - ghostAt.left}px, 0, 0)`
  }
}
function drop() {
  const g = ghost
  ghost = null
  if (!g) return
  g.classList.remove('is-up')
  const gone = () => g.remove()
  if (stills()) gone()
  else {
    g.addEventListener('transitionend', gone, { once: true })
    window.setTimeout(gone, 200)
  }
}
// near the scroller's edge the page scrolls on, and the line follows
let scrollRaf = 0
function scrollParentOf(el: HTMLElement | null): HTMLElement | null {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const o = getComputedStyle(n).overflowY
    if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight)
      return n
  }
  return (document.scrollingElement as HTMLElement | null) ?? null
}
function autoScroll() {
  scrollRaf = 0
  const p = press
  const w = wrapperEl.value
  if (!p || !p.active || !w) return
  let moved = false
  if (p.kind === 'row') {
    const sp = scrollParentOf(w)
    if (sp) {
      const r =
        sp === document.scrollingElement
          ? { top: 0, bottom: window.innerHeight }
          : sp.getBoundingClientRect()
      let dy = 0
      if (p.lastY < r.top + SCROLL_EDGE)
        dy = -Math.ceil((r.top + SCROLL_EDGE - p.lastY) / 4)
      else if (p.lastY > r.bottom - SCROLL_EDGE)
        dy = Math.ceil((p.lastY - (r.bottom - SCROLL_EDGE)) / 4)
      if (dy) {
        const before = sp.scrollTop
        sp.scrollTop += dy
        moved = sp.scrollTop !== before
      }
    }
  } else {
    const r = w.getBoundingClientRect()
    let dx = 0
    if (p.lastX < r.left + SCROLL_EDGE)
      dx = -Math.ceil((r.left + SCROLL_EDGE - p.lastX) / 4)
    else if (p.lastX > r.right - SCROLL_EDGE)
      dx = Math.ceil((p.lastX - (r.right - SCROLL_EDGE)) / 4)
    if (dx) {
      const before = w.scrollLeft
      w.scrollLeft += dx
      moved = w.scrollLeft !== before
    }
  }
  if (moved) {
    measure()
    aim()
  }
  scrollRaf = requestAnimationFrame(autoScroll)
}
// the move: the table rebuilt with its rows (or every row's cells) in the
// new order — the nodes themselves, content and widths untouched — and
// the moved line selected again. The header rows stay the first ones:
// cells landing there become header cells, cells leaving them plain ones
function moveLine(kind: DragKind, from: number, to: number) {
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c) return
  const at = to > from ? to - 1 : to
  if (at === from) return
  const w = wrapperEl.value
  const before = w && !stills() ? placesIn(w) : null
  const { tableCell, tableHeader } = c.ed.schema.nodes
  const header = headerRows(c)
  const rows: PMNode[] = []
  for (let i = 0; i < c.table.childCount; i++) rows.push(c.table.child(i))
  let next: PMNode[]
  if (kind === 'row') {
    const order = rows.slice()
    const [row] = order.splice(from, 1)
    order.splice(at, 0, row)
    next = order.map((row, i) => {
      const type = i < header ? tableHeader : tableCell
      const cells: PMNode[] = []
      row.forEach((cell) =>
        cells.push(
          cell.type === type
            ? cell
            : type.create(cell.attrs, cell.content, cell.marks),
        ),
      )
      return row.copy(Fragment.from(cells))
    })
  } else {
    next = rows.map((row) => {
      const cells: PMNode[] = []
      row.forEach((cell) => cells.push(cell))
      const [cell] = cells.splice(from, 1)
      cells.splice(at, 0, cell)
      return row.copy(Fragment.from(cells))
    })
  }
  const table = c.table.copy(Fragment.from(next))
  const tr = c.ed.state.tr.replaceWith(
    c.start - 1,
    c.start - 1 + c.table.nodeSize,
    table,
  )
  const map = TableMap.get(table)
  const cell = (row: number, col: number) =>
    tr.doc.resolve(c.start + map.map[row * map.width + col])
  tr.setSelection(
    kind === 'row'
      ? CellSelection.rowSelection(cell(at, 0), cell(at, map.width - 1))
      : CellSelection.colSelection(cell(0, at), cell(map.height - 1, at)),
  )
  c.ed.view.dispatch(tr)
  if (w && before) settle(w, kind, from, at, before)
}
// ---- the settle: after the move every cell slides from where it was to
// where it is (the kanban's 220ms ease), the moved line's ring arriving
// as they land. Web Animations, not styles: a style written on a cell is
// a mutation ProseMirror reads back as an edit, and resets the selection
const SETTLE = { duration: 220, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
/** every cell's place, by row and column */
function placesIn(w: HTMLElement): DOMRect[][] {
  return [...w.querySelectorAll('tr')].map((row) =>
    [...row.children].map((cell) => cell.getBoundingClientRect()),
  )
}
function settle(
  w: HTMLElement,
  kind: DragKind,
  from: number,
  at: number,
  before: DOMRect[][],
) {
  // where each row (or column) of the new order came from
  const n = kind === 'row' ? before.length : (before[0]?.length ?? 0)
  const order = [...Array(n).keys()]
  const [moved] = order.splice(from, 1)
  order.splice(at, 0, moved)
  const rows = [...w.querySelectorAll<HTMLElement>('tr')]
  const moves: [HTMLElement, number][] = []
  rows.forEach((row, r) => {
    ;[...row.children].forEach((el, col) => {
      const was =
        kind === 'row' ? before[order[r]]?.[col] : before[r]?.[order[col]]
      if (!was) return
      const now = el.getBoundingClientRect()
      const d = kind === 'row' ? was.top - now.top : was.left - now.left
      if (Math.abs(d) > 0.5) moves.push([el as HTMLElement, d])
    })
  })
  if (!moves.length) return
  const axis = kind === 'row' ? 'translateY' : 'translateX'
  moves.forEach(([el, d]) =>
    el.animate(
      [{ transform: `${axis}(${d}px)` }, { transform: 'none' }],
      SETTLE,
    ),
  )
  w.querySelector('.table-selection-box')?.animate(
    [{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }],
    { duration: 260 },
  )
}

// ---- actions
function focusCell(c: Ctx, pos: number) {
  c.ed.view.dispatch(
    c.ed.state.tr.setSelection(TextSelection.create(c.ed.state.doc, pos + 2)),
  )
}
function selectRow(row: number) {
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c) return
  const { doc } = c.ed.state
  const sel = CellSelection.rowSelection(
    doc.resolve(cellPos(c, row, 0)),
    doc.resolve(cellPos(c, row, c.map.width - 1)),
  )
  c.ed.view.dispatch(c.ed.state.tr.setSelection(sel))
}
function selectCol(col: number) {
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c) return
  const { doc } = c.ed.state
  const sel = CellSelection.colSelection(
    doc.resolve(cellPos(c, 0, col)),
    doc.resolve(cellPos(c, c.map.height - 1, col)),
  )
  c.ed.view.dispatch(c.ed.state.tr.setSelection(sel))
}
function clearCells(c: Ctx, positions: number[]) {
  const tr = c.ed.state.tr
  const paragraph = c.ed.schema.nodes.paragraph
  ;[...positions]
    .sort((a, b) => b - a)
    .forEach((pos) => {
      const cell = tr.doc.nodeAt(pos)
      if (!cell) return
      tr.replaceWith(pos + 1, pos + cell.nodeSize - 1, paragraph.create())
    })
  c.ed.view.dispatch(tr)
}
function withCtx(run: (c: Ctx) => void) {
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c) return
  run(c)
  ed.commands.focus(undefined, { scrollIntoView: false })
}

const rowActions = {
  insertAbove: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, rowIndex.value, 0))
      c.ed.commands.addRowBefore()
    }),
  insertBelow: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, rowIndex.value, 0))
      c.ed.commands.addRowAfter()
    }),
  duplicate: () =>
    withCtx((c) => {
      const { node, pos } = rowNodeAt(c, rowIndex.value)
      c.ed.view.dispatch(
        c.ed.state.tr.insert(
          pos + node.nodeSize,
          node.type.create(node.attrs, node.content),
        ),
      )
    }),
  clear: () => withCtx((c) => clearCells(c, cellsIn(c, 'row', rowIndex.value))),
  remove: () =>
    withCtx((c) => {
      if (c.map.height === 1) {
        c.ed.commands.deleteTable()
        return
      }
      selectRow(rowIndex.value)
      c.ed.commands.deleteRow()
    }),
  colour: (name: string | null) =>
    withCtx((c) => {
      selectRow(rowIndex.value)
      c.ed.commands.setCellBackground(name)
    }),
  toggleHeader: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, 0, 0))
      c.ed.commands.toggleHeaderRow()
    }),
}
const colActions = {
  insertLeft: () =>
    withCtx((c) =>
      withColumnAdded(c, colIndex.value, colIndex.value, () => {
        focusCell(c, cellPos(c, 0, colIndex.value))
        c.ed.commands.addColumnBefore()
      }),
    ),
  insertRight: () =>
    withCtx((c) =>
      withColumnAdded(c, colIndex.value + 1, colIndex.value, () => {
        focusCell(c, cellPos(c, 0, colIndex.value))
        c.ed.commands.addColumnAfter()
      }),
    ),
  duplicate: () =>
    withCtx((c) =>
      withColumnAdded(c, colIndex.value + 1, colIndex.value, () => {
        const tr = c.ed.state.tr
        cellsIn(c, 'col', colIndex.value)
          .sort((a, b) => b - a)
          .forEach((pos) => {
            const cell = tr.doc.nodeAt(pos)
            if (!cell) return
            tr.insert(
              pos + cell.nodeSize,
              cell.type.create(cell.attrs, cell.content),
            )
          })
        c.ed.view.dispatch(tr)
      }),
    ),
  clear: () => withCtx((c) => clearCells(c, cellsIn(c, 'col', colIndex.value))),
  remove: () =>
    withCtx((c) => {
      if (c.map.width === 1) {
        c.ed.commands.deleteTable()
        return
      }
      selectCol(colIndex.value)
      c.ed.commands.deleteColumn()
    }),
  colour: (name: string | null) =>
    withCtx((c) => {
      selectCol(colIndex.value)
      c.ed.commands.setCellBackground(name)
    }),
}
const cellActions = {
  colour: (name: string | null) =>
    withCtx((c) => c.ed.commands.setCellBackground(name)),
  merge: () => withCtx((c) => c.ed.commands.mergeCells()),
  split: () => withCtx((c) => c.ed.commands.splitCell()),
  clear: () =>
    withCtx((c) => {
      const { selection } = c.ed.state
      const positions: number[] = []
      const cells = asCellSelection(selection)
      if (cells) cells.forEachCell((_n, pos) => positions.push(pos))
      else {
        const $cell = cellAround(selection.$from)
        if ($cell) positions.push($cell.pos)
      }
      clearCells(c, positions)
    }),
}
function addColumnAtEnd() {
  withCtx((c) =>
    withColumnAdded(c, c.map.width, c.map.width - 1, () => {
      focusCell(c, cellPos(c, 0, c.map.width - 1))
      c.ed.commands.addColumnAfter()
    }),
  )
}

// ---- widths. A fresh table shares the card between its columns, and
// tiptap's resize sets only the dragged column's width, which would have
// the rest squeezed to fit. So before a column is added or resized every
// column is told the width it has (its cells' colwidth), the new column
// takes its neighbour's, and the table — tiptap sizes it to the sum —
// grows past the card and scrolls inside it
/** the columns' rendered widths, from tiptap's colgroup — whole pixels
 * (a colwidth is an integer) that add up to the table's own width, so
 * columns sharing the card never round up past it into a scroll */
function columnWidths(c: Ctx): number[] {
  const cols = [...(wrapperEl.value?.querySelectorAll('col') ?? [])]
  let raw: number[]
  if (cols.length === c.map.width)
    raw = cols.map((col) => col.getBoundingClientRect().width)
  else {
    raw = []
    for (let i = 0; i < c.map.width; i++) {
      const dom = c.ed.view.nodeDOM(c.start + c.map.map[i])
      raw.push(
        dom instanceof HTMLElement ? dom.getBoundingClientRect().width : 100,
      )
    }
  }
  return wholePixels(raw)
}
/** the widths rounded so their sum is the sum's rounding: each takes its
 * floor, and the pixels left over go to the largest remainders */
function wholePixels(raw: number[]): number[] {
  const total = Math.round(raw.reduce((a, b) => a + b, 0))
  const floors = raw.map((w) => Math.floor(w))
  let left = total - floors.reduce((a, b) => a + b, 0)
  const order = raw
    .map((w, i) => ({ i, rest: w - Math.floor(w) }))
    .sort((a, b) => b.rest - a.rest)
  for (const { i } of order) {
    if (left <= 0) break
    floors[i] += 1
    left -= 1
  }
  return floors
}
/** every cell told its columns' widths */
function holdWidths(c: Ctx, widths: number[]) {
  const tr = c.ed.state.tr
  const seen = new Set<number>()
  c.map.map.forEach((rel) => {
    if (seen.has(rel)) return
    seen.add(rel)
    const pos = c.start + rel
    const cell = c.ed.state.doc.nodeAt(pos)
    if (!cell) return
    const r = c.map.findCell(rel)
    const colwidth = widths.slice(r.left, r.right)
    const had = cell.attrs.colwidth as number[] | null
    if (
      had &&
      had.length === colwidth.length &&
      had.every((w, k) => w === colwidth[k])
    )
      return
    tr.setNodeMarkup(pos, null, { ...cell.attrs, colwidth })
  })
  if (tr.docChanged) c.ed.view.dispatch(tr)
}
function hasUnsizedColumn(c: Ctx): boolean {
  let unsized = false
  c.table.descendants((node) => {
    if (unsized) return false
    const name = node.type.name
    if (name !== 'tableCell' && name !== 'tableHeader') return true
    if (!node.attrs.colwidth) unsized = true
    return false
  })
  return unsized
}
/** `add` puts a column at `at`; it takes column `like`'s width */
function withColumnAdded(c: Ctx, at: number, like: number, add: () => void) {
  const widths = columnWidths(c)
  add()
  const fresh = ctxOf(c.ed)
  if (!fresh || fresh.map.width !== widths.length + 1) return
  const next = widths.slice()
  next.splice(at, 0, widths[Math.min(Math.max(like, 0), widths.length - 1)])
  holdWidths(fresh, next)
}
// a resize in the offing (tiptap's handle armed under the pointer) on a
// table with columns still sharing the card: they hold their widths now,
// before any press, so only the dragged one will change. Not on the press
// itself: the hold redraws the cells, and a press whose target is gone
// never reaches tiptap
function holdBeforeResize(ed: TiptapEditor) {
  const armed = columnResizingPluginKey.getState(ed.state)?.activeHandle ?? -1
  if (armed < 0) return
  let c: Ctx | null = null
  try {
    c = ctxAt(ed, ed.state.doc.resolve(armed))
  } catch {
    c = null
  }
  if (!c || !hasUnsizedColumn(c)) return
  holdWidths(c, columnWidths(c))
}
function addRowAtEnd() {
  withCtx((c) => {
    focusCell(c, cellPos(c, c.map.height - 1, 0))
    c.ed.commands.addRowAfter()
  })
}

// ---- the menus
// the document is not reactive: a tick per transaction lets the menus read
// the row's header state fresh
const version = ref(0)
const isHeaderRow = computed(() => {
  void version.value
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c || rowIndex.value !== 0) return false
  const first = c.table.child(0)
  for (let i = 0; i < first.childCount; i++)
    if (first.child(i).type.name !== 'tableHeader') return false
  return true
})

// the palette's names are the token hues, but for indigo, which has no
// token of its own and is drawn in violet, as the colour panel draws it
const hue = (name: string) => (name === 'indigo' ? 'violet' : name)

/** the Colour submenu: Default and the palette as 24px swatches */
function colourItem(apply: (name: string | null) => void): MenuOptions[number] {
  return {
    label: 'Colour',
    icon: icon('cell-color'),
    submenu: [
      {
        label: 'Colour',
        slots: {
          item: ({ close }) =>
            h(
              'div',
              {
                class: 'rte-tc-swatches',
                role: 'group',
                'aria-label': 'Colour',
              },
              [
                h(
                  'button',
                  {
                    type: 'button',
                    class: 'rte-tc-swatch is-default',
                    title: 'Default',
                    'aria-label': 'Default',
                    onClick: () => {
                      apply(null)
                      close()
                    },
                  },
                  'A',
                ),
                ...PALETTE_COLORS.map((p) =>
                  h('button', {
                    type: 'button',
                    class: 'rte-tc-swatch',
                    style: {
                      '--sw': `var(--${hue(p.name)}-50)`,
                      '--sw-dark': `var(--dark-${hue(p.name)}-900)`,
                    },
                    title: p.name,
                    'aria-label': p.name,
                    onClick: () => {
                      apply(p.name)
                      close()
                    },
                  }),
                ),
              ],
            ),
        },
      },
    ],
  }
}
const rowOptions = computed<MenuOptions>(() => [
  ...(rowIndex.value === 0
    ? [
        {
          label: 'Table Header',
          icon: icon('header-row'),
          switch: true as const,
          switchValue: isHeaderRow.value,
          onClick: () => rowActions.toggleHeader(),
        },
      ]
    : []),
  colourItem(rowActions.colour),
  {
    label: 'Insert above',
    icon: icon('arrow-up'),
    onClick: rowActions.insertAbove,
  },
  {
    label: 'Insert below',
    icon: icon('arrow-down'),
    onClick: rowActions.insertBelow,
  },
  {
    label: 'Duplicate',
    icon: icon('duplicate'),
    onClick: rowActions.duplicate,
  },
  {
    label: 'Clear content',
    icon: icon('small-close'),
    onClick: rowActions.clear,
  },
  { label: 'Delete', icon: icon('delete'), onClick: rowActions.remove },
])
const colOptions = computed<MenuOptions>(() => [
  colourItem(colActions.colour),
  {
    label: 'Insert right',
    icon: icon('arrow-right'),
    onClick: colActions.insertRight,
  },
  {
    label: 'Insert left',
    icon: icon('arrow-left'),
    onClick: colActions.insertLeft,
  },
  {
    label: 'Duplicate',
    icon: icon('duplicate'),
    onClick: colActions.duplicate,
  },
  {
    label: 'Clear content',
    icon: icon('small-close'),
    onClick: colActions.clear,
  },
  { label: 'Delete', icon: icon('delete'), onClick: colActions.remove },
])
const cellOptions = computed<MenuOptions>(() => [
  colourItem(cellActions.colour),
  ...(cellCount.value > 1
    ? [
        {
          label: 'Merge cells',
          icon: icon('cell-merge'),
          onClick: cellActions.merge,
        },
        {
          label: 'Delete content',
          icon: icon('delete'),
          onClick: cellActions.clear,
        },
      ]
    : cellMerged.value
      ? [
          {
            label: 'Split cell',
            icon: icon('cell-merge'),
            onClick: cellActions.split,
          },
        ]
      : []),
])

// the row menu opens 4px under its row, the column menu 4px under its grip
const rowMenuOffset = computed(() => {
  const r = rowBox.value
  if (!r) return 4
  const gripBottom = r.top + r.height / 2 + 10
  return Math.round(r.top + r.height - gripBottom + 4)
})

// ---- subscriptions
// batched on a microtask, not an animation frame: the view has already
// updated when the transaction fires, and a frame may not come for a while
// on an idle page
let pending = false
const schedule = () => {
  version.value++
  if (pending) return
  pending = true
  queueMicrotask(() => {
    pending = false
    if (!menuOpen.value) syncSelection()
    measure()
  })
}
watch(
  () => editor.value,
  (ed, _old, onCleanup) => {
    if (!ed) return
    // the hovered cell rides along with the document it points into
    const onTransaction = ({
      transaction,
    }: {
      transaction: { mapping: { map: (pos: number) => number } }
    }) => {
      if (hoverPos.value !== null)
        hoverPos.value = transaction.mapping.map(hoverPos.value)
      schedule()
    }
    ed.on('transaction', onTransaction)
    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    onCleanup(() => {
      ed.off('transaction', onTransaction)
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    })
  },
  { immediate: true },
)
// a closed menu lets the pointer take over again; the row/column stays
// selected until the pointer moves on
watch(menuOpen, (open) => {
  if (!open) schedule()
})
// the table's own changes of shape: a column being resized is tiptap
// writing the columns' widths straight into the DOM, with no transaction
// until the pointer lets go, so the handles re-measure on the table's
// mutations and resizes as well (its selection box left out: that is
// what measure() writes, and would echo)
watch(wrapperEl, (w, _old, onCleanup) => {
  if (!w) return
  const mo = new MutationObserver((records) => {
    if (
      records.some(
        (r) =>
          !(r.target instanceof Element) ||
          !r.target.classList.contains('table-selection-box'),
      )
    )
      schedule()
  })
  mo.observe(w, { attributes: true, attributeFilter: ['style'], subtree: true })
  const ro = new ResizeObserver(schedule)
  ro.observe(w)
  const table = w.querySelector('table')
  if (table) ro.observe(table)
  // the card scrolls its columns, never its rows: its bar lies on the last
  // row's foot, which ProseMirror would scroll a caret there up out of
  // (an overflow it can still move, hidden or not) — the card stays put
  const level = () => {
    if (w.scrollTop) w.scrollTop = 0
  }
  level()
  w.addEventListener('scroll', level)
  onCleanup(() => {
    mo.disconnect()
    ro.disconnect()
    w.removeEventListener('scroll', level)
  })
})

const px = (n: number) => `${n}px`
</script>

<template>
  <Teleport to="body">
    <div
      ref="layer"
      class="rte-tc pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="false"
    >
      <!-- the row handle, at the left edge of the caret's row: its pill on
           the table's first line (the card's edge is a pixel out). Its menu
           anchors to the unseen span in the same place -->
      <template v-if="rowBox && tableBox && selKind !== 'col'">
        <Dropdown
          v-model:open="rowOpen"
          :options="rowOptions"
          side="bottom"
          align="start"
          :offset="rowMenuOffset"
          :modal="false"
          :portal-to="menuHost ?? undefined"
        >
          <template #trigger>
            <span
              class="rte-tc-anchor"
              :style="{
                left: px(tableBox.left - 4),
                top: px(rowBox.top + rowBox.height / 2 - 10),
                width: px(10),
                height: px(20),
              }"
              aria-hidden="true"
            />
          </template>
        </Dropdown>
        <button
          type="button"
          class="rte-tc-handle is-row"
          :class="(rowOpen || dragKind === 'row') && 'is-open'"
          :style="{
            left: px(tableBox.left - 4),
            top: px(rowBox.top + rowBox.height / 2 - 10),
          }"
          aria-label="Row options"
          title="Row options"
          aria-haspopup="menu"
          :aria-expanded="rowOpen"
          @pointerdown="onPress('row', $event)"
          @pointermove="onPressMove"
          @pointerup="onRelease"
          @pointercancel="onPressCancel"
          @keydown.enter.prevent="openMenu('row')"
        >
          <span class="rte-tc-pill" aria-hidden="true" />
          <span class="rte-tc-dots" aria-hidden="true" />
        </button>
      </template>

      <!-- the column handle, at the top edge of the caret's column -->
      <template v-if="colBox && selKind !== 'row'">
        <Dropdown
          v-model:open="colOpen"
          :options="colOptions"
          side="bottom"
          align="start"
          :offset="4"
          :modal="false"
          :portal-to="menuHost ?? undefined"
        >
          <template #trigger>
            <span
              class="rte-tc-anchor"
              :style="{
                left: px(colBox.left + colBox.width / 2 - 10),
                top: px(colBox.top - 4),
                width: px(20),
                height: px(10),
              }"
              aria-hidden="true"
            />
          </template>
        </Dropdown>
        <button
          type="button"
          class="rte-tc-handle is-col"
          :class="(colOpen || dragKind === 'col') && 'is-open'"
          :style="{
            left: px(colBox.left + colBox.width / 2 - 10),
            top: px(colBox.top - 4),
          }"
          aria-label="Column options"
          title="Column options"
          aria-haspopup="menu"
          :aria-expanded="colOpen"
          @pointerdown="onPress('col', $event)"
          @pointermove="onPressMove"
          @pointerup="onRelease"
          @pointercancel="onPressCancel"
          @keydown.enter.prevent="openMenu('col')"
        >
          <span class="rte-tc-pill" aria-hidden="true" />
          <span class="rte-tc-dots" aria-hidden="true" />
        </button>
      </template>

      <!-- the cell handle, at the right edge of the selected cell or run:
           its pill on the ring's right line -->
      <template v-if="cellBox && cellKnobOn && selKind === 'cells'">
        <Dropdown
          v-model:open="cellOpen"
          :options="cellOptions"
          side="right"
          align="start"
          :offset="4"
          :modal="false"
          :portal-to="menuHost ?? undefined"
        >
          <template #trigger>
            <span
              class="rte-tc-anchor"
              :style="{
                left: px(cellBox.left + cellBox.width - 6),
                top: px(cellBox.top + cellBox.height / 2 - 10),
                width: px(10),
                height: px(20),
              }"
              aria-hidden="true"
            />
          </template>
        </Dropdown>
        <button
          type="button"
          class="rte-tc-handle is-row is-cell"
          :class="cellOpen && 'is-open'"
          :style="{
            left: px(cellBox.left + cellBox.width - 6),
            top: px(cellBox.top + cellBox.height / 2 - 10),
          }"
          aria-label="Cell options"
          title="Cell options"
          aria-haspopup="menu"
          :aria-expanded="cellOpen"
          @pointerdown="onPress('cell', $event)"
          @pointermove="onPressMove"
          @pointerup="onRelease"
          @pointercancel="onPressCancel"
          @keydown.enter.prevent="openMenu('cell')"
        >
          <span class="rte-tc-pill" aria-hidden="true" />
          <span class="rte-tc-dots" aria-hidden="true" />
        </button>
      </template>

      <!-- the line a dragged row or column will land on -->
      <div
        v-if="dragKind && dropLine"
        class="rte-tc-drop"
        :class="dropOn && 'is-on'"
        :style="{
          left: px(dropLine.left),
          top: px(dropLine.top),
          width: px(dropLine.width),
          height: px(dropLine.height),
        }"
        aria-hidden="true"
      />

      <!-- the add strips: a column at the right, a row beneath -->
      <template v-if="tableBox">
        <button
          type="button"
          class="rte-tc-strip"
          :style="{
            left: px(tableBox.left + tableBox.width + 8),
            top: px(tableBox.top),
            width: px(16),
            height: px(tableBox.height),
          }"
          aria-label="Add column"
          title="Add column"
          @click="addColumnAtEnd"
        >
          <RteIcon name="add-12" class="size-3" />
        </button>
        <button
          type="button"
          class="rte-tc-strip"
          :style="{
            left: px(tableBox.left),
            top: px(tableBox.top + tableBox.height + 8),
            width: px(tableBox.width),
            height: px(16),
          }"
          aria-label="Add row"
          title="Add row"
          @click="addRowAtEnd"
        >
          <RteIcon name="add-12" class="size-3" />
        </button>
      </template>

      <!-- the menus land here so the file's card can be applied to them -->
      <div ref="menuHost" class="rte-tc-menus pointer-events-auto" />
    </div>
  </Teleport>
</template>

<style>
/* a handle: the file's knob (32925:95940) — a 12×1 gray-500 line in a
   2px white notch, on the edge's line (the file draws a 3×14 pill under
   a 2px white stroke, which comes to the same). Hovered or open it is
   the file's grip (32926:97027): a 10×20 (20×10 for a column) gray-500
   pill on 4px corners with three 3px white dots 5px apart — drawn flat,
   without the file's shadows. The pill is pinned so the handle placed
   4px (or 6px) off a 1px line puts it exactly on that line */
.rte-tc-handle {
  @apply pointer-events-auto fixed flex items-center justify-center rounded-[4px] border border-transparent transition-colors;
  overflow: visible;
  cursor: grab;
  touch-action: none;
}
.rte-tc-handle.is-cell {
  cursor: pointer;
}
/* the menu's anchor: the grip's place, nothing drawn */
.rte-tc-anchor {
  position: fixed;
  pointer-events: none;
}
/* a drag: the pointer holds, the page's text stays unselected, and the
   landing line is the editor's own drop line, 3px rounded gray-900 */
body.rte-tc-dragging,
body.rte-tc-dragging .rte-tc-handle {
  cursor: grabbing;
  user-select: none;
}
.rte-tc-drop {
  position: fixed;
  z-index: 75;
  border-radius: 9999px;
  pointer-events: none;
  background-color: var(--surface-gray-10, #383838);
  opacity: 0;
  transition:
    top 120ms cubic-bezier(0.2, 0, 0, 1),
    left 120ms cubic-bezier(0.2, 0, 0, 1),
    opacity 120ms;
}
.rte-tc-drop.is-on {
  opacity: 1;
}
/* the ghost: the row or column lifted, on the card's surface under the
   lg shadow, fading up as it rises and down as it lands */
.rte-tc-ghost {
  @apply shadow-lg;
  position: fixed;
  z-index: 70;
  pointer-events: none;
  overflow: hidden;
  border-radius: 6px;
  background-color: var(--surface-elevation-2);
  opacity: 0;
  transition: opacity 140ms;
  will-change: transform;
}
.rte-tc-ghost.is-up {
  opacity: 0.85;
}
.rte-tc-ghost table {
  margin: 0;
}
@media (prefers-reduced-motion: reduce) {
  .rte-tc-drop,
  .rte-tc-ghost {
    transition: none;
  }
}
.rte-tc-handle.is-row {
  width: 10px;
  height: 20px;
}
.rte-tc-handle.is-col {
  width: 20px;
  height: 10px;
}
.rte-tc-pill {
  position: absolute;
  display: block;
  border-radius: 4px;
  background-color: var(--ink-gray-5);
  box-shadow: 0 0 0 2px var(--surface-elevation-2);
}
.rte-tc-handle.is-row .rte-tc-pill {
  left: 4px;
  top: 3px;
  width: 1px;
  height: 12px;
}
.rte-tc-handle.is-col .rte-tc-pill {
  left: 3px;
  top: 4px;
  width: 12px;
  height: 1px;
}
.rte-tc-dots {
  position: absolute;
  inset: -1px;
  display: none;
}
.rte-tc-handle.is-row .rte-tc-dots {
  background-image:
    radial-gradient(circle at 5px 5px, #fff 1.5px, transparent 1.75px),
    radial-gradient(circle at 5px 10px, #fff 1.5px, transparent 1.75px),
    radial-gradient(circle at 5px 15px, #fff 1.5px, transparent 1.75px);
}
.rte-tc-handle.is-col .rte-tc-dots {
  background-image:
    radial-gradient(circle at 5px 5px, #fff 1.5px, transparent 1.75px),
    radial-gradient(circle at 10px 5px, #fff 1.5px, transparent 1.75px),
    radial-gradient(circle at 15px 5px, #fff 1.5px, transparent 1.75px);
}
.rte-tc-handle:hover,
.rte-tc-handle.is-open {
  background-color: var(--ink-gray-5);
}
.rte-tc-handle:hover .rte-tc-pill,
.rte-tc-handle.is-open .rte-tc-pill {
  display: none;
}
.rte-tc-handle:hover .rte-tc-dots,
.rte-tc-handle.is-open .rte-tc-dots {
  display: block;
}
/* a strip: gray-50 on a gray-100 rule, 4px corners, the plus gray-400 */
.rte-tc-strip {
  @apply pointer-events-auto fixed flex items-center justify-center rounded-[4px] border border-outline-gray-1 bg-surface-gray-1 text-ink-gray-4 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-6;
}
/* the menus: the file's 220px card, 4px in on a 12px radius under the xl
   shadow, its rows 28px on an 8px radius with a 16px glyph 6px off the
   14/16 label */
.rte-tc-menus .menu-content[data-slot='content'] {
  @apply w-[220px] p-0 shadow-xl;
  min-width: 0;
  border-radius: 12px !important;
  --tw-ring-color: transparent;
}
.rte-tc-menus [data-slot='item'] {
  @apply text-ink-gray-7;
}
/* the Colour submenu: Default and the palette, 24px on 8px corners */
.rte-tc-swatches {
  @apply grid grid-cols-6 gap-1.5 p-1;
}
.rte-tc-swatch {
  @apply flex size-6 items-center justify-center rounded-4 border border-outline-gray-2 text-base leading-none text-ink-gray-7 transition-shadow;
  background-color: var(--sw, transparent);
}
.rte-tc-swatch:hover {
  box-shadow: 0 0 0 2px var(--outline-gray-3);
}
[data-theme='dark'] .rte-tc-swatch {
  background-color: var(--sw-dark, transparent);
}
</style>
