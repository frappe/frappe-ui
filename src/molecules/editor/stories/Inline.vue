<script setup>
import { ref } from 'vue'
import {
  Editor,
  EditorContent,
  EditorBubbleMenu,
  InlineKit,
  minimalToolbar,
} from 'frappe-ui/editor'

const extensions = [InlineKit]
const title = ref('<p>Q3 launch plan</p>')
</script>

<template>
  <div class="w-full max-w-xl">
    <label class="mb-1.5 block text-sm text-ink-gray-5">Page title</label>
    <Editor v-model="title" :extensions="extensions" placeholder="Untitled">
      <EditorBubbleMenu :items="minimalToolbar" />
      <EditorContent
        class="rounded-md border border-outline-gray-2 bg-surface-base px-3 py-2 text-4xl-semibold text-ink-gray-9 focus-within:border-outline-gray-3 focus-within:ring-2 focus-within:ring-outline-gray-2"
      />
    </Editor>
    <p class="mt-2 text-sm text-ink-gray-5">
      Single line — Enter is a no-op. Select text for the bubble menu.
    </p>
  </div>
</template>
