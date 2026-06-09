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
import { CellSelection, cellAround } from '@tiptap/pm/tables'
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

function reposition() {
  const reference = anchor.value
  const el = floating.value
  if (!reference || !el) return
  void computePosition(reference, el, {
    strategy: 'fixed',
    placement: 'top',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  }).then(({ x, y }) => {
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  })
}

function sync() {
  const ed = editor.value
  const table = ed ? activeTableEl(ed) : null
  anchor.value = table
  visible.value = !!table
  // Wait for v-show to reveal the element before measuring it.
  if (table) void nextTick(reposition)
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
  if (!coords) return
  const $cell = cellAround(ed.state.doc.resolve(coords.pos))
  if (!$cell) return // not in a table — let the native menu through
  event.preventDefault()
  // Select the right-clicked cell so the actions target it.
  ed.view.dispatch(
    ed.state.tr.setSelection(CellSelection.create(ed.state.doc, $cell.pos)),
  )
  openContextMenu(ed, event.clientX, event.clientY)
}

// (Re)subscribe whenever the editor instance changes. The toolbar shows on
// transactions (selection / content) and repositions on resize. Scrolling hides
// it: it's a body-teleported, fixed-position toolbar anchored to the table top,
// so following the table on scroll would float it out of the editor and over the
// page header. It reappears the next time the caret lands in a table.
watch(
  editor,
  (ed, _old, onCleanup) => {
    if (typeof ed?.on !== 'function') {
      visible.value = false
      return
    }
    const onChange = () => sync()
    const onScroll = () => {
      visible.value = false
    }
    const onResize = () => reposition()
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
        class="fixed left-0 top-0 z-[100] flex items-center gap-1 rounded-lg border border-outline-gray-2 bg-surface-base p-1 shadow-sm"
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
