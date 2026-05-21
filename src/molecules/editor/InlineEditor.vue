<script setup lang="ts">
import { computed } from 'vue'
import { useEditor } from './useEditor'
import EditorContent from './EditorContent.vue'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import { minimalToolbar } from './menu'
import { StarterKit, Placeholder, Link } from './extensions'

const model = defineModel<string | null>({ default: '' })
const props = withDefaults(
  defineProps<{
    placeholder?: string
    editable?: boolean
    autofocus?: boolean
  }>(),
  { placeholder: '', editable: true, autofocus: false },
)

const editor = useEditor({
  content: model,
  editable: () => props.editable,
  autofocus: props.autofocus,
  extensions: [StarterKit, Placeholder.configure({ placeholder: () => props.placeholder }), Link],
})

const singleLineOptions = computed(() => ({
  shouldShow: ({ editor }: any) => editor?.isEditable ?? false,
}))
</script>

<template>
  <div data-slot="inline-editor" class="rounded border border-gray-200 bg-white">
    <EditorBubbleMenu :editor="editor" :buttons="minimalToolbar" :options="singleLineOptions" />
    <EditorContent :editor="editor" class="px-2 py-1 prose-sm" />
  </div>
</template>
