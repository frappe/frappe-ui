<script setup>
import { ref } from 'vue'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  StarterKit,
  Placeholder,
  Link,
  minimalToolbar,
} from 'frappe-ui/editor'

const html = ref(
  '<p>Select text to see the bubble menu, or use the toolbar below.</p>',
)

const editor = useEditor({
  content: html,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Write something…' }),
    Link,
  ],
})
</script>

<template>
  <div class="w-full max-w-2xl rounded border border-gray-200 bg-white">
    <EditorBubbleMenu :editor="editor" :items="minimalToolbar" />
    <EditorContent :editor="editor" class="min-h-24 px-3 py-2 prose-sm" />
    <div class="border-t border-gray-200 px-2 py-1.5">
      <EditorFixedMenu :editor="editor" :items="minimalToolbar" />
    </div>
  </div>
</template>
