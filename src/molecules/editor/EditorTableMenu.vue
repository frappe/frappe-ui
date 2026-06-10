<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { CellSelection, cellAround, isInTable, selectionCell } from '@tiptap/pm/tables'
import { verticalScrollParent } from './extensions/table/drag-scroll'
import MenuItems from './MenuItems.vue'
import TableContextMenu from './components/TableContextMenu.vue'
import { tableToolbar } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'
import {
  useFloatingPopup,
  type FloatingPopupHandle,
} from './composables/useFloatingPopup'

/**
 * Contextual table toolbar with row/column insert + delete, header-row toggle,
 * merge/split, and delete-table controls (see `tableToolbar`).
 *
 * Unlike a stock bubble menu — which anchors to the text selection and so jumps
 * from cell to cell as the caret moves — this anchors to the *table* element. It
 * therefore stays put while you move between cells and only re-positions when
 * you enter a different table (or the table / viewport changes). The buttons
 * still act on the active cell, so the toolbar adapts to context without moving.
 *
 * Safe to render unconditionally: it's hidden outside tables and the items
 * self-prune when the Table extension is absent, so it's inert in a comment
 * editor.
 */
const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
}>()

const editor = useResolvedEditor(() => props.editor)

const floating = useTemplateRef<HTMLElement>('floating')
const anchor = shallowRef<HTMLElement | null>(null)
const visible = ref(false)

/** The DOM element of the table the selection is currently inside, if any. */
function activeTableEl(ed: Editor): HTMLElement | null {
  if (!ed.isEditable || !ed.isActive('table')) return null
  // `editor.view` is a proxy that throws on access until the view is mounted;
  // the immediate watch can run sync() before that. `isInitialized` flips true
  // on mount, so bail until then.
  if (!ed.isInitialized) return null
  const { $from } = ed.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'table') {
      const dom = ed.view.nodeDOM($from.before(depth))
      // nodeDOM returns the table's wrapper; anchor to the inner <table> so the
      // toolbar sits against the table edge, not the wrapper's outer spacing.
      if (dom instanceof HTMLElement) {
        return dom.tagName === 'TABLE'
          ? dom
          : (dom.querySelector('table') ?? dom)
      }
    }
  }
  return null
}

/**
 * The vertical band the toolbar may occupy: the visible part of the editor's
 * scroll container (so a pinned toolbar never floats over the app chrome
 * above/below it), clamped to the viewport.
 */
function verticalBounds(table: HTMLElement): { top: number; bottom: number } {
  const parent = verticalScrollParent(table)
  if (parent === document.scrollingElement || parent === document.documentElement) {
    return { top: 0, bottom: window.innerHeight }
  }
  const rect = parent.getBoundingClientRect()
  return {
    top: Math.max(rect.top, 0),
    bottom: Math.min(rect.bottom, window.innerHeight),
  }
}

/** Whether any part of the table is visible inside its scroll container. */
function tableInView(table: HTMLElement): boolean {
  const rect = table.getBoundingClientRect()
  const bounds = verticalBounds(table)
  return (
    rect.bottom > bounds.top &&
    rect.top < bounds.bottom &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  )
}

function reposition() {
  const table = anchor.value
  const el = floating.value
  if (!table || !el) return
  // A wide table scrolls inside its `.tableWrapper` (overflow-x: auto), so the
  // table's own horizontal center can be scrolled out of view — centering the
  // toolbar on it would float it over the clipped region. Anchor instead to the
  // part of the table actually visible inside the wrapper's viewport: the
  // horizontal intersection of table and wrapper. That collapses to the table
  // for a narrow (fully visible) table and to the visible window for a wide,
  // scrolled one. Vertical anchor stays at the table's top edge.
  const wrapper = table.closest<HTMLElement>('.tableWrapper')
  const reference = wrapper
    ? {
        getBoundingClientRect: () => {
          const t = table.getBoundingClientRect()
          const w = wrapper.getBoundingClientRect()
          const left = Math.max(t.left, w.left)
          const right = Math.min(t.right, w.right)
          return new DOMRect(left, t.top, Math.max(0, right - left), 0)
        },
      }
    : table
  void computePosition(reference, el, {
    strategy: 'fixed',
    placement: 'top',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  }).then(({ x, y }) => {
    // Pin the toolbar inside the visible band while scrolling through a tall
    // table, instead of letting it follow the table's top edge off-screen.
    const bounds = verticalBounds(table)
    const minY = bounds.top + 4
    const maxY = bounds.bottom - el.offsetHeight - 4
    el.style.left = `${x}px`
    el.style.top = `${Math.min(Math.max(y, minY), Math.max(maxY, minY))}px`
  })
}

function sync() {
  const ed = editor.value
  const table = ed ? activeTableEl(ed) : null
  anchor.value = table
  visible.value = !!table && tableInView(table)
  // Wait for v-show to reveal the element before measuring it.
  if (visible.value) void nextTick(reposition)
}

// --- Right-click context menu ---------------------------------------------
let contextMenu: FloatingPopupHandle | null = null

function closeContextMenu() {
  contextMenu?.destroy()
  contextMenu = null
}

function openContextMenu(ed: Editor, clientX: number, clientY: number) {
  closeContextMenu()
  contextMenu = useFloatingPopup({
    anchor: ed.view.dom,
    component: TableContextMenu,
    props: { editor: ed, items: tableToolbar, onRun: closeContextMenu },
    // Anchor at the cursor point so the menu opens where the user clicked.
    virtualReference: {
      getBoundingClientRect: () => new DOMRect(clientX, clientY, 0, 0),
    },
    closeOnAnchorPointerDown: true,
    animate: true,
    floatingOptions: { placement: 'right-start', strategy: 'fixed', offset: 0 },
  })
}

function onContextMenu(event: MouseEvent) {
  const ed = editor.value
  if (!ed || ed.isDestroyed || !ed.isEditable) return
  // The view getter throws until the editor is mounted; a real right-click
  // always happens after mount, but guard anyway.
  let dom: HTMLElement
  try {
    dom = ed.view.dom as HTMLElement
  } catch {
    return
  }
  const target = event.target
  if (!(target instanceof Node) || !dom.contains(target)) return
  const coords = ed.view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  })
  let $cell = coords ? cellAround(ed.state.doc.resolve(coords.pos)) : null
  let point = { x: event.clientX, y: event.clientY }
  if (!$cell) {
    // A real right-click outside any table — let the native menu through.
    if (event.button === 2) return
    // Keyboard-initiated (ContextMenu key / Shift+F10) events carry no usable
    // coordinates; fall back to the active cell and anchor the menu to it.
    if (!isInTable(ed.state)) return
    $cell = selectionCell(ed.state)
    const cellDom = ed.view.nodeDOM($cell.pos)
    if (!(cellDom instanceof HTMLElement)) return
    const rect = cellDom.getBoundingClientRect()
    point = { x: rect.left + Math.min(rect.width / 2, 24), y: rect.bottom - 4 }
  }
  event.preventDefault()
  // Keep an existing multi-cell selection when the click lands inside it — the
  // menu is the natural place to act on the selected block (merge, color).
  // Otherwise select the right-clicked cell so the actions target it.
  const selection = ed.state.selection
  let inSelection = false
  if (selection instanceof CellSelection) {
    selection.forEachCell((_node, pos) => {
      if (pos === $cell!.pos) inSelection = true
    })
  }
  if (!inSelection) {
    ed.view.dispatch(
      ed.state.tr.setSelection(CellSelection.create(ed.state.doc, $cell.pos)),
    )
  }
  openContextMenu(ed, point.x, point.y)
}

// (Re)subscribe whenever the editor instance changes. The toolbar shows on
// transactions (selection / content) and follows the table on scroll/resize —
// re-clamped into the scroll container's visible band by `reposition`, and
// hidden only once the table itself scrolls out of view.
let scrollRaf = 0
watch(
  editor,
  (ed, _old, onCleanup) => {
    if (typeof ed?.on !== 'function') {
      visible.value = false
      return
    }
    const onChange = () => sync()
    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        sync()
      })
    }
    const onResize = () => sync()
    ed.on('transaction', onChange)
    ed.on('focus', onChange)
    // Capture phase so inner scroll containers are caught too.
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    // Bound on document (not the view DOM) so it never touches `ed.view` before
    // the view is mounted; the handler scopes itself to this editor.
    document.addEventListener('contextmenu', onContextMenu, true)
    sync()
    onCleanup(() => {
      ed.off('transaction', onChange)
      ed.off('focus', onChange)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      scrollRaf = 0
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('contextmenu', onContextMenu, true)
      closeContextMenu()
    })
  },
  { immediate: true },
)

onBeforeUnmount(closeContextMenu)
</script>

<template>
  <Teleport to="body">
    <Transition name="table-menu">
      <div
        v-show="visible && editor"
        ref="floating"
        data-slot="table-menu"
        class="fixed left-0 top-0 z-[100] flex items-center gap-1 rounded-lg border border-outline-gray-2 bg-surface-elevation-2 p-1 shadow-sm"
      >
        <MenuItems v-if="editor" :editor="editor" :items="tableToolbar" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Fast appear only; leave is instant so the toolbar clears the moment the
 * selection leaves a table. Mirrors EditorPopover's 90ms fade+scale. */
.table-menu-enter-active {
  transition:
    opacity 90ms ease-out,
    transform 90ms ease-out;
  transform-origin: center bottom;
}

.table-menu-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .table-menu-enter-active {
    transition: none;
  }
}
</style>
