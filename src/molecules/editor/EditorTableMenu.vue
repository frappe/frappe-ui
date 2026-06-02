<script setup lang="ts">
import { nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import MenuItems from './MenuItems.vue'
import { tableToolbar } from './menu'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

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
  const { $from } = ed.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'table') {
      const dom = ed.view.nodeDOM($from.before(depth))
      // nodeDOM returns the table's wrapper (or the table itself) — both give a
      // stable bounding box to anchor against.
      if (dom instanceof HTMLElement) return dom
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
    middleware: [offset(8), flip(), shift({ padding: 8 })],
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

// (Re)subscribe whenever the editor instance changes. Repositioning is driven by
// transactions (selection / content) and by scroll/resize — anchored to the
// table, so cell-to-cell caret moves don't move the toolbar.
watch(
  editor,
  (ed, _old, onCleanup) => {
    if (typeof ed?.on !== 'function') {
      visible.value = false
      return
    }
    const onChange = () => sync()
    const onScroll = () => reposition()
    ed.on('transaction', onChange)
    ed.on('focus', onChange)
    // Capture phase so inner scroll containers are caught too.
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    sync()
    onCleanup(() => {
      ed.off('transaction', onChange)
      ed.off('focus', onChange)
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    })
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible && editor"
      ref="floating"
      data-slot="table-menu"
      class="fixed left-0 top-0 z-[100] flex items-center gap-1 rounded border border-outline-gray-2 bg-surface-white p-1 shadow-sm"
    >
      <MenuItems v-if="editor" :editor="editor" :items="tableToolbar" />
    </div>
  </Teleport>
</template>
