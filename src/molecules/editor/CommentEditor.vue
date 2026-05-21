<script setup lang="ts">
import { computed, ref } from 'vue'
import type { JSONContent } from '@tiptap/core'
import { useEditor, type Editor, type UploadedFile } from './useEditor'
import EditorContent from './EditorContent.vue'
import EditorFixedMenu from './EditorFixedMenu.vue'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import { commentToolbar } from './menu'
import { StarterKit, Placeholder, Link, Image, ImageGroup, Video, ContentPaste } from './extensions'

const model = defineModel<string | JSONContent | null>({ default: '' })
const props = withDefaults(
  defineProps<{
    format?: 'html' | 'json'
    placeholder?: string
    editable?: boolean
    autofocus?: boolean
    uploadFunction?: (file: File) => Promise<UploadedFile>
    maxHeight?: string
  }>(),
  { format: 'html', placeholder: '', editable: true, autofocus: false },
)
const emit = defineEmits<{ change: [value: string | JSONContent | null] }>()
defineSlots<{ actions(props: { editor: Editor | null; isEmpty: boolean }): any }>()

const isEmpty = ref(true)
function sync(editor: Editor) {
  isEmpty.value = editor.isEmpty
}

const editor = useEditor({
  content: model,
  format: props.format,
  editable: () => props.editable,
  autofocus: props.autofocus,
  uploadFunction: props.uploadFunction,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: () => props.placeholder }),
    Link,
    Image,
    ImageGroup,
    Video,
    ContentPaste,
  ],
  onUpdate(editor) {
    sync(editor)
    emit('change', model.value)
  },
  onTransaction: sync,
})

const contentStyle = computed(() => ({ maxHeight: props.maxHeight, overflowY: props.maxHeight ? 'auto' : undefined }))
</script>

<template>
  <div data-slot="comment-editor" class="rounded border border-gray-200 bg-white">
    <EditorBubbleMenu :editor="editor" :buttons="commentToolbar" />
    <EditorContent :editor="editor" class="min-h-16 px-3 py-2 prose-sm" :style="contentStyle" />
    <div data-slot="editor-actions" class="flex items-center justify-between gap-2 border-t border-gray-200 px-2 py-1.5">
      <EditorFixedMenu :editor="editor" :buttons="commentToolbar" />
      <div class="flex items-center gap-2">
        <slot name="actions" :editor="editor" :is-empty="isEmpty" />
      </div>
    </div>
  </div>
</template>
