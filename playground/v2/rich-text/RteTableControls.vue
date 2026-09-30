<script setup lang="ts">
// Figma: espresso-2.0 › table (32157:9144). The table's controls, drawn
// over the document on a fixed layer so nothing is clipped by the table's
// scrolling card:
//
// - a row grip (10×20) at the left edge of the row under the pointer and a
//   column grip (20×10) at the top edge of its column, each a gray-500 pill
//   with white dots; pressed, they select the row or column and open its
//   menu — Colour, Border options (a row) or Table Header (the first row),
//   Insert, Duplicate, Clear content, Delete;
// - a cell grip at the right edge of the selected cell or run of cells —
//   Colour, and for a run, Merge cells and Delete content;
// - two 16px strips, 8px off the table's right and bottom edges, that add
//   a column or a row at the end;
//
// Dragging a column edge resizes it: tiptap's own behaviour and handle.
//
// The menus are the library's Dropdown, portalled into this layer so the
// file's 220px, 4px-in, 12px-radius card can be applied to them, and not
// modal: a modal menu marks every block around the editor's live regions
// aria-hidden, which ProseMirror reads back as a change to the document
// and rebuilds the table under the grips.
import { computed, h, ref, shallowRef, watch } from 'vue'
import type { Node as PMNode, ResolvedPos } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import {
  CellSelection,
  TableMap,
  cellAround,
  isInTable,
} from '@tiptap/pm/tables'
import { Dropdown } from '../../../src'
import type { MenuOptions } from '../../../src/components/Menu/types'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import type { TiptapEditor } from '../../../src/molecules/editor'
import { PALETTE_COLORS } from '../../../src/molecules/editor/extensions/shared/color-palette'
import RteIcon from './RteIcon.vue'
import type { RowBorder } from './extensions'

const editor = useResolvedEditor(() => undefined)
const icon = (name: string) => () => h(RteIcon, { name })

type Box = { left: number; top: number; width: number; height: number }
const box = (r: DOMRect): Box => ({
  left: r.left,
  top: r.top,
  width: r.width,
  height: r.height,
})

// ---- what the controls follow: DOM handles, re-measured on demand
const layer = ref<HTMLElement | null>(null)
const menuHost = ref<HTMLElement | null>(null)
const wrapperEl = shallowRef<HTMLElement | null>(null)
const caretCellEl = shallowRef<HTMLElement | null>(null)
const rowEl = shallowRef<HTMLElement | null>(null)
const colCellEl = shallowRef<HTMLElement | null>(null)
const rowIndex = ref(-1)
const colIndex = ref(-1)
const cellCount = ref(0)
const cellMerged = ref(false)

const tableBox = ref<Box | null>(null)
const rowBox = ref<Box | null>(null)
const colBox = ref<Box | null>(null)
const cellBox = ref<Box | null>(null)

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
  const w = wrapperEl.value
  if (!w || !w.isConnected) {
    clearAll()
    return
  }
  tableBox.value = box(w.getBoundingClientRect())
  const r = rowEl.value
  rowBox.value = r && r.isConnected ? box(r.getBoundingClientRect()) : null
  if (!rowBox.value) rowEl.value = null
  const cc = colCellEl.value
  if (cc && cc.isConnected) {
    const cr = cc.getBoundingClientRect()
    colBox.value = {
      left: cr.left,
      top: tableBox.value.top,
      width: cr.width,
      height: tableBox.value.height,
    }
  } else {
    colBox.value = null
    colCellEl.value = null
  }
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
  } else if (caretCellEl.value?.isConnected) {
    cellBox.value = box(caretCellEl.value.getBoundingClientRect())
  } else {
    cellBox.value = null
  }
}
function clearAll() {
  wrapperEl.value = null
  caretCellEl.value = null
  rowEl.value = null
  colCellEl.value = null
  tableBox.value = null
  rowBox.value = null
  colBox.value = null
  cellBox.value = null
}

// ---- the selection: a row, a column, a run of cells, or the caret's cell
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
  if (!isInTable(ed.state)) {
    // the caret left the table: the controls stay while the pointer hovers
    if (!hovering) clearAll()
    caretCellEl.value = null
    cellBox.value = null
    cellCount.value = 0
    return
  }
  const $cell = cellAround(selection.$from)
  if (!$cell) return
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
  if (wrapper && wrapper !== wrapperEl.value) {
    wrapperEl.value = wrapper
    rowEl.value = null
    colCellEl.value = null
  }
  const rect = c.map.findCell($cell.pos - c.start)
  const cells = asCellSelection(selection)
  if (cells) {
    let n = 0
    cells.forEachCell(() => n++)
    cellCount.value = n
    if (cells.isRowSelection() && !hovering) {
      rowIndex.value = rect.top
      rowEl.value = cellDom(view, $cell.pos)?.closest('tr') ?? null
    } else if (cells.isColSelection() && !hovering) {
      colIndex.value = rect.left
      colCellEl.value = cellDom(view, $cell.pos)
    }
    caretCellEl.value = null
  } else {
    cellCount.value = 1
    caretCellEl.value = cellDom(view, $cell.pos)
  }
  const cell = $cell.nodeAfter
  cellMerged.value =
    !!cell && (cell.attrs.colspan > 1 || cell.attrs.rowspan > 1)
  measure()
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

// ---- hovering: the grips follow the cell under the pointer
let hovering = false
function onMove(e: MouseEvent) {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable || menuOpen.value) return
  const target = e.target instanceof Element ? e.target : null
  if (!target) return
  if (layer.value?.contains(target)) return
  const cell = target.closest<HTMLElement>('.rte-doc td, .rte-doc th')
  if (cell) {
    hoverCell(ed, cell)
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
  if (!isInTable(ed.state)) clearAll()
  else syncSelection()
}
function hoverCell(ed: TiptapEditor, cell: HTMLElement) {
  let $cell: ResolvedPos | null
  try {
    $cell = cellAround(ed.state.doc.resolve(ed.view.posAtDOM(cell, 0)))
  } catch {
    return
  }
  if (!$cell) return
  const c = ctxAt(ed, $cell)
  if (!c) return
  hovering = true
  const rect = c.map.findCell($cell.pos - c.start)
  wrapperEl.value =
    cell.closest<HTMLElement>('.tableWrapper') ?? cell.closest('table')
  rowEl.value = cell.closest('tr')
  rowIndex.value = rect.top
  colCellEl.value = cell
  colIndex.value = rect.left
  measure()
}

// ---- actions
// (the grips select on pointerdown: the Dropdown opens on that press and
// swallows the click that ends it)
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
  border: (border: RowBorder | null) =>
    withCtx((c) => {
      const { node, pos } = rowNodeAt(c, rowIndex.value)
      c.ed.view.dispatch(
        c.ed.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, border }),
      )
    }),
  toggleHeader: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, 0, 0))
      c.ed.commands.toggleHeaderRow()
    }),
}
const colActions = {
  insertLeft: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, 0, colIndex.value))
      c.ed.commands.addColumnBefore()
    }),
  insertRight: () =>
    withCtx((c) => {
      focusCell(c, cellPos(c, 0, colIndex.value))
      c.ed.commands.addColumnAfter()
    }),
  duplicate: () =>
    withCtx((c) => {
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
  withCtx((c) => {
    focusCell(c, cellPos(c, 0, c.map.width - 1))
    c.ed.commands.addColumnAfter()
  })
}
function addRowAtEnd() {
  withCtx((c) => {
    focusCell(c, cellPos(c, c.map.height - 1, 0))
    c.ed.commands.addRowAfter()
  })
}

// ---- the menus
// the document is not reactive: a tick per transaction lets the menus read
// the row's header and border state fresh
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
const currentBorder = computed<RowBorder | null>(() => {
  void version.value
  const ed = editor.value
  const c = ed && ctxOf(ed)
  if (!c || rowIndex.value < 0 || rowIndex.value >= c.map.height) return null
  return (c.table.child(rowIndex.value).attrs.border as RowBorder) ?? null
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
const BORDERS: Array<[RowBorder, string, string]> = [
  ['top', 'Top Border', 'border-top'],
  ['right', 'Right Border', 'border-right'],
  ['bottom', 'Bottom Border', 'border-bottom'],
  ['left', 'Left Border', 'border-left'],
  ['none', 'No Border', 'border-none'],
]
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
  ...(rowIndex.value === 0
    ? []
    : [
        {
          label: 'Border options',
          icon: icon('border-none'),
          submenu: BORDERS.map(([value, label, glyph]) => ({
            label,
            icon: icon(glyph),
            selected: currentBorder.value === value,
            // the file ticks the row's current option
            slots: {
              suffix: ({ selected }) =>
                selected
                  ? h(RteIcon, { name: 'check', class: 'size-4' })
                  : null,
            },
            onClick: () =>
              rowActions.border(currentBorder.value === value ? null : value),
          })),
        },
      ]),
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
    ed.on('transaction', schedule)
    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    onCleanup(() => {
      ed.off('transaction', schedule)
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

const px = (n: number) => `${n}px`
</script>

<template>
  <Teleport to="body">
    <div
      ref="layer"
      class="rte-tc pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="false"
    >
      <!-- the row grip -->
      <Dropdown
        v-if="rowBox && tableBox"
        v-model:open="rowOpen"
        :options="rowOptions"
        side="bottom"
        align="start"
        :offset="rowMenuOffset"
        :modal="false"
        :portal-to="menuHost ?? undefined"
      >
        <template #trigger>
          <button
            type="button"
            class="rte-tc-grip is-row"
            :class="rowOpen && 'is-open'"
            :style="{
              left: px(tableBox.left - 4),
              top: px(rowBox.top + rowBox.height / 2 - 10),
            }"
            aria-label="Row options"
            title="Row options"
            @pointerdown="selectRow(rowIndex)"
            @keydown.enter="selectRow(rowIndex)"
          >
            <RteIcon name="dot-vertical" class="size-4" />
          </button>
        </template>
      </Dropdown>

      <!-- the column grip -->
      <Dropdown
        v-if="colBox"
        v-model:open="colOpen"
        :options="colOptions"
        side="bottom"
        align="start"
        :offset="4"
        :modal="false"
        :portal-to="menuHost ?? undefined"
      >
        <template #trigger>
          <button
            type="button"
            class="rte-tc-grip is-col"
            :class="colOpen && 'is-open'"
            :style="{
              left: px(colBox.left + colBox.width / 2 - 10),
              top: px(colBox.top - 4),
            }"
            aria-label="Column options"
            title="Column options"
            @pointerdown="selectCol(colIndex)"
            @keydown.enter="selectCol(colIndex)"
          >
            <RteIcon name="dot-horizontal" class="size-4" />
          </button>
        </template>
      </Dropdown>

      <!-- the cell grip, at the right edge of the selected cell or run -->
      <Dropdown
        v-if="cellBox && cellCount > 0"
        v-model:open="cellOpen"
        :options="cellOptions"
        side="right"
        align="start"
        :offset="4"
        :modal="false"
        :portal-to="menuHost ?? undefined"
      >
        <template #trigger>
          <button
            type="button"
            class="rte-tc-grip is-row"
            :class="cellOpen && 'is-open'"
            :style="{
              left: px(cellBox.left + cellBox.width - 6),
              top: px(cellBox.top + cellBox.height / 2 - 10),
            }"
            aria-label="Cell options"
            title="Cell options"
          >
            <RteIcon name="dot-vertical" class="size-4" />
          </button>
        </template>
      </Dropdown>

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
/* a grip: a gray-500 pill on a gray-200 rule, 4px corners, under the sm
   shadow, its dots white and overflowing the pill as the file's 16px glyph
   does */
.rte-tc-grip {
  @apply pointer-events-auto fixed flex items-center justify-center rounded-[4px] border border-outline-gray-2 text-white shadow-sm transition-colors;
  background-color: var(--ink-gray-5);
  overflow: visible;
}
.rte-tc-grip.is-row {
  width: 10px;
  height: 20px;
}
.rte-tc-grip.is-col {
  width: 20px;
  height: 10px;
}
.rte-tc-grip:hover,
.rte-tc-grip.is-open {
  background-color: var(--ink-gray-6);
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
