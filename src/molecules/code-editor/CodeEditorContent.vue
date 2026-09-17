<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import type { EditorView } from '@codemirror/view'
import { useResolvedCodeEditor } from './code-editor-context'

const props = defineProps<{
  /** Optional inside <CodeEditor> — falls back to the provided view. */
  editor?: EditorView | null
}>()

const emit = defineEmits<{
  /**
   * The content crossed the height cap, or stopped crossing it. Only
   * transitions are emitted.
   *
   * CSS cannot measure the crossing: a cap clips silently, and no selector
   * matches "this element is scrolling". Three consumers draw an expand
   * affordance off exactly this fact. frappe-ui draws none of them — it emits
   * the boolean and sets `data-overflowing`.
   */
  overflow: [overflowing: boolean]
}>()

const resolved = useResolvedCodeEditor(() => props.editor)
const rootEl = useTemplateRef<HTMLElement>('rootEl')
const overflowing = ref(false)

let mounted: EditorView | null = null
let observer: ResizeObserver | null = null
// Last values written to the DOM. `measure` runs inside a ResizeObserver
// callback, so writing a style it already holds is how an observer loop starts.
let scrolledX = false
let textHeight = ''

function measure() {
  const view = mounted
  if (!view) return

  const scroller = view.scrollDOM
  const next = scroller.scrollHeight > scroller.clientHeight + 1
  if (next !== overflowing.value) {
    overflowing.value = next
    emit('overflow', next)
  }

  // Drive the gutter's horizontal-scroll shadow (see style.css). The shadow is
  // capped to the bottom of the last line rather than the full gutter height:
  // CodeMirror stretches the gutter past the code, and a shadow running down
  // into the empty area below reads as one floating in space.
  const nextScrolledX = scroller.scrollLeft > 0
  if (nextScrolledX !== scrolledX) {
    scrolledX = nextScrolledX
    view.dom.classList.toggle('code-scrolled-x', nextScrolledX)
  }

  const nextTextHeight = `${view.lineBlockAt(view.state.doc.length).bottom}px`
  if (nextTextHeight !== textHeight) {
    textHeight = nextTextHeight
    view.dom.style.setProperty('--_code-text-height', nextTextHeight)
  }
}

function unmountView() {
  if (!mounted) return
  mounted.scrollDOM.removeEventListener('scroll', measure)
  // The class lives on the view, and the part never owns the view. Left set, it
  // rides to the next part or back to this one, where `scrollLeft` is 0 after a
  // re-attach: `measure` then agrees with the cache below, never toggles, and
  // the gutter shadow stays lit with nothing scrolled.
  mounted.dom.classList.remove('code-scrolled-x')
  mounted.dom.remove()
  mounted = null
  // The observer holds the departed view's `contentDOM` and `scrollDOM`. It has
  // to go here rather than next to the re-observe below, because the part can
  // lose its view without gaining another one (`:editor="null"`, or the engine
  // destroying the view on unmount).
  observer?.disconnect()
  observer = null
  // The cached values belong to the view that just left, not to the next one.
  scrolledX = false
  textHeight = ''
  // An empty box overflows nothing. Without this the part keeps
  // `data-overflowing` set, and the consumer that drew an expand affordance off
  // the last `true` never hears it go away.
  if (overflowing.value) {
    overflowing.value = false
    emit('overflow', false)
  }
}

function mountView(view: EditorView | null) {
  const el = rootEl.value
  if (!el || mounted === view) return
  unmountView()
  if (!view) return

  // The view is created with no `parent`, so `view.dom` is detached until a
  // part appends it. This is the append. The part never destroys the view: the
  // engine owns that, and a part that outlived its editor would take it down.
  el.appendChild(view.dom)
  mounted = view
  view.scrollDOM.addEventListener('scroll', measure, { passive: true })

  if (typeof ResizeObserver !== 'undefined') {
    // `contentDOM` catches doc edits and folds; `scrollDOM` catches the cap
    // itself changing and wrapping reflow on a width change. Neither alone
    // covers both: a capped scroller keeps its box size while the content
    // height shifts under it.
    observer = new ResizeObserver(() => measure())
    observer.observe(view.contentDOM)
    observer.observe(view.scrollDOM)
  }
  measure()
}

onMounted(() => mountView(resolved.value))
watch(resolved, async (view) => {
  await nextTick()
  mountView(view)
})
onBeforeUnmount(() => unmountView())
</script>

<template>
  <!-- The box. `class` falls through the normal way (P10: no class-name prop) —
       unlike the editor family's content part, this root is ours, not the
       engine's, so nothing else writes to its class attribute. -->
  <div
    ref="rootEl"
    data-slot="code-editor-content"
    :data-overflowing="overflowing ? 'true' : undefined"
  />
</template>
