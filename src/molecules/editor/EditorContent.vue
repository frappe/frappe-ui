<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  normalizeClass,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import type { Editor } from './useEditor'
import { useResolvedEditor } from './editor-context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  // Optional inside <Editor> — falls back to the provided editor context.
  editor?: Editor | null
}>()

const resolvedEditor = useResolvedEditor(() => props.editor)

const attrs = useAttrs()
const rootEl = useTemplateRef<HTMLElement>('rootEl')
const instance = getCurrentInstance()
let mountedEditor: Editor | null = null

/**
 * Default editor typography.
 *
 * `prose-v3` is applied BY DEFAULT so consumers get the v1 prose styling without
 * opting in. But if the consumer passes a Tailwind Typography size modifier
 * (`prose-sm`/`prose-base`/`prose-lg`/`prose-xl`/`prose-2xl`), we DROP `prose-v3`
 * so their choice wins — `prose-v3` and `prose-lg` are both single-class
 * components, so leaving both on the element would just be a cascade-order
 * fight. Detecting the override and omitting `prose-v3` is what actually lets it
 * be overridden.
 *
 * Note: only `prose`/`prose-v3` (components) live here — never a font-size/
 * line-height *utility* like `text-base`, which (emitted after components) would
 * always beat `prose-v3`'s line-height.
 */
const PROSE_SIZE_OVERRIDE = /(?:^|\s)prose-(?:sm|base|lg|xl|2xl)(?:\s|$)/
const proseClass = computed(() => {
  const incoming = normalizeClass(attrs.class)
  const overridden = PROSE_SIZE_OVERRIDE.test(incoming)
  return overridden ? 'prose max-w-none' : 'prose max-w-none prose-v3'
})

const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

/**
 * The content-styling tokens this component owns: our default prose typography
 * plus whatever the consumer passed via `class`.
 */
const editorClassTokens = computed(() =>
  normalizeClass([proseClass.value, attrs.class]).split(' ').filter(Boolean),
)

/**
 * Apply `editorClassTokens` to the element with `classList`, adding/removing
 * only the tokens we own.
 *
 * ProseMirror mounts directly onto `rootEl` and shares its `class` attribute:
 * it adds `ProseMirror`/`tiptap` and toggles `ProseMirror-focused`. A Vue
 * `:class` bound to the same element would be a second, non-surgical writer —
 * each re-render replaces the whole token list, dropping ProseMirror's classes
 * and silently breaking every `.ProseMirror`-scoped editor style (table borders,
 * etc.). ProseMirror itself only ever adds/removes its own decoration tokens
 * (see prosemirror-view `patchAttributes`), so mirroring that here — touching
 * only our tokens — lets both owners coexist on one attribute.
 */
let appliedTokens: string[] = []
function syncClasses() {
  const el = rootEl.value
  if (!el) return
  const next = editorClassTokens.value
  for (const token of appliedTokens) {
    if (!next.includes(token)) el.classList.remove(token)
  }
  el.classList.add(...next)
  appliedTokens = next
}

function mountEditor(editor: Editor | null) {
  const el = rootEl.value
  if (!el) return
  if (mountedEditor === editor) return

  unmountEditor()
  if (!editor) return

  const tiptapEditor = editor as any
  tiptapEditor.contentComponent = instance?.ctx._
  if (instance) {
    tiptapEditor.appContext = {
      ...instance.appContext,
      provides: instance.provides,
    }
  }

  editor.mount({ mount: el } as any)
  editor.createNodeViews()
  mountedEditor = editor
}

function unmountEditor() {
  if (!mountedEditor) return
  const tiptapEditor = mountedEditor as any
  tiptapEditor.contentComponent = null
  tiptapEditor.appContext = null
  mountedEditor.unmount()
  mountedEditor = null
}

onMounted(() => {
  syncClasses()
  mountEditor(resolvedEditor.value)
})

watch(resolvedEditor, async (editor) => {
  await nextTick()
  mountEditor(editor)
})

// Reactive consumer/prose classes update via our own surgical classList sync,
// not a Vue `:class` binding (which would clobber ProseMirror's classes).
watch(editorClassTokens, syncClasses)

onBeforeUnmount(() => unmountEditor())
</script>

<template>
  <!--
    No `:class` here on purpose — `rootEl` is also ProseMirror's editor element,
    so its `class` attribute has two owners. Vue's `:class` is a wholesale
    replace and would drop ProseMirror's classes; instead `syncClasses` manages
    only our tokens via classList. See `editorClassTokens` above.
  -->
  <div ref="rootEl" data-slot="editor-content" v-bind="rootAttrs" />
</template>
