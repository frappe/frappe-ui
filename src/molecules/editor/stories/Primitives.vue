<script setup>
import { computed, ref } from 'vue'
import {
  useEditor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  EditorFloatingMenu,
  StarterKit,
  Placeholder,
  Link,
  Bold,
  Italic,
  Separator,
  BulletList,
  OrderedList,
  Blockquote,
  InsertLink,
} from 'frappe-ui/editor'

const toolbar = [
  Bold,
  Italic,
  Separator,
  BulletList,
  OrderedList,
  Blockquote,
  Separator,
  InsertLink,
]

const content = ref(`
  <p>This editor is composed by hand — no <code>&lt;Editor&gt;</code> wrapper.</p>
  <p>It owns the <code>useEditor</code> instance directly and renders the menu primitives itself.</p>
`)

// StarterKit ships its own link mark, so disable it before adding the frappe
// Link extension — otherwise tiptap warns about a duplicate "link" extension.
const editor = useEditor({
  content,
  extensions: [
    StarterKit.configure({ link: false }),
    Placeholder.configure({ placeholder: 'Write something…' }),
    Link,
  ],
})

const wordCount = computed(() => {
  const text = (editor.value?.getText() || '').trim()
  return text ? text.split(/\s+/).length : 0
})
</script>

<template>
  <div class="w-full max-w-2xl">
    <div class="overflow-hidden rounded-lg border border-outline-gray-2 bg-surface-white">
      <EditorBubbleMenu :editor="editor" :items="toolbar" />
      <EditorFloatingMenu :editor="editor" :items="toolbar" />
      <div class="border-b border-outline-gray-1 px-2 py-1.5">
        <EditorFixedMenu :editor="editor" :items="toolbar" class="flex-wrap" />
      </div>
      <EditorContent
        :editor="editor"
        class="min-h-48 px-4 py-3 text-ink-gray-8"
      />
      <div
        class="border-t border-outline-gray-1 px-3 py-1.5 text-xs text-ink-gray-5"
      >
        {{ wordCount }} words
      </div>
    </div>
  </div>
</template>
