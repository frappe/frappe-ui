<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import type { JSONContent } from '@tiptap/core'
import type { Extension } from '@tiptap/core'
import type { Props as TippyProps } from 'tippy.js'
import { useEditor, type Editor, type UploadedFile } from './useEditor'
import EditorContent from './EditorContent.vue'
import EditorFixedMenu from './EditorFixedMenu.vue'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import EditorFloatingMenu from './EditorFloatingMenu.vue'
import type { MenuItem } from './menu'

type Content = string | JSONContent | null

const model = defineModel<Content>()

const props = withDefaults(
  defineProps<{
    // capability — the complete extension list; include a kit
    extensions: Extension[]

    // content / behavior knobs
    format?: 'html' | 'json'
    placeholder?: string
    editable?: boolean
    autofocus?: boolean
    uploadFunction?: (file: File) => Promise<UploadedFile>
    maxHeight?: string

    // chrome — default off, explicit for tree-shaking
    fixedMenu?: MenuItem[] | false
    fixedMenuPosition?: 'top' | 'bottom'
    bubbleMenu?: MenuItem[] | false
    bubbleMenuOptions?: {
      shouldShow?: (props: any) => boolean
      tippyOptions?: Partial<TippyProps>
    }
    floatingMenu?: MenuItem[] | false
  }>(),
  {
    format: 'html',
    editable: true,
    autofocus: false,
    fixedMenu: false,
    fixedMenuPosition: 'top',
    bubbleMenu: false,
    floatingMenu: false,
  },
)

const emit = defineEmits<{ change: [value: Content] }>()

defineSlots<{
  default?(props: { editor: Editor | null; isEmpty: boolean }): any
  actions?(props: { editor: Editor | null; isEmpty: boolean }): any
  fixedMenu?(props: { editor: Editor | null }): any
  bubbleMenu?(props: { editor: Editor | null }): any
  floatingMenu?(props: { editor: Editor | null }): any
}>()

const isEmpty = ref(true)
function syncIsEmpty(editor: Editor) {
  isEmpty.value = editor.isEmpty
}

const editor = useEditor({
  content: model,
  format: props.format,
  editable: () => props.editable,
  autofocus: props.autofocus,
  uploadFunction: props.uploadFunction,
  extensions: props.extensions,
  onUpdate(editor) {
    syncIsEmpty(editor)
    // Emit the freshly-written value directly from the editor (P1: a side-event,
    // independent of v-model timing).
    emit(
      'change',
      props.format === 'json' ? editor.getJSON() : editor.getHTML(),
    )
  },
  onTransaction: syncIsEmpty,
})

if (editor.value) syncIsEmpty(editor.value)

// Thread the reactive `placeholder` prop into the kit's Placeholder extension via
// editor.storage.placeholder (see spec §2). This never reconfigures a
// consumer-supplied extension; an explicit Placeholder.configure({ placeholder })
// wins, and if no Placeholder extension is present the prop is a no-op.
watch(
  () => props.placeholder,
  (text) => {
    const instance = editor.value
    const storage = (instance?.storage as Record<string, any> | undefined)
      ?.placeholder as { text: string | null } | undefined
    if (!instance || !storage) return
    storage.text = text ?? null
    // Recompute the placeholder decoration without emitting a content update.
    instance.view?.dispatch(instance.state.tr)
  },
  { immediate: true },
)

const contentStyle = computed(() => ({
  maxHeight: props.maxHeight,
  overflowY: props.maxHeight ? ('auto' as const) : undefined,
}))

// The persistent toolbar row appears when a fixed menu (prop or slot) or the
// actions slot exists.
const slots = useSlots()
const showToolbar = computed(
  () =>
    Boolean(props.fixedMenu) ||
    Boolean(slots.fixedMenu) ||
    Boolean(slots.actions),
)
</script>

<template>
  <!-- L3: the #default slot owns the whole layout; the component still owns the
       editor lifecycle, v-model, upload threading, and placeholder. -->
  <slot v-if="$slots.default" :editor="editor" :is-empty="isEmpty" />

  <div
    v-else
    data-slot="text-editor"
    class="rounded border border-gray-200 bg-white"
  >
    <div
      v-if="showToolbar && fixedMenuPosition === 'top'"
      data-slot="toolbar"
      class="flex items-center justify-between gap-2 border-b border-gray-200 px-2 py-1.5"
    >
      <slot name="fixedMenu" :editor="editor">
        <EditorFixedMenu v-if="fixedMenu" :editor="editor" :items="fixedMenu" />
        <span v-else />
      </slot>
      <div class="flex items-center gap-2">
        <slot name="actions" :editor="editor" :is-empty="isEmpty" />
      </div>
    </div>

    <slot name="bubbleMenu" :editor="editor">
      <EditorBubbleMenu
        v-if="bubbleMenu"
        :editor="editor"
        :items="bubbleMenu"
        :options="bubbleMenuOptions"
      />
    </slot>
    <slot name="floatingMenu" :editor="editor">
      <EditorFloatingMenu
        v-if="floatingMenu"
        :editor="editor"
        :items="floatingMenu"
      />
    </slot>

    <EditorContent
      :editor="editor"
      class="prose-sm px-3 py-2"
      :style="contentStyle"
    />

    <div
      v-if="showToolbar && fixedMenuPosition === 'bottom'"
      data-slot="toolbar"
      class="flex items-center justify-between gap-2 border-t border-gray-200 px-2 py-1.5"
    >
      <slot name="fixedMenu" :editor="editor">
        <EditorFixedMenu v-if="fixedMenu" :editor="editor" :items="fixedMenu" />
        <span v-else />
      </slot>
      <div class="flex items-center gap-2">
        <slot name="actions" :editor="editor" :is-empty="isEmpty" />
      </div>
    </div>
  </div>
</template>
