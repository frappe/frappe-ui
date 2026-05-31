<script setup>
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { TextEditor, RichTextKit, articleToolbar } from 'frappe-ui/editor'

// An article editor is the same component with a richer kit + toolbar preset.
const extensions = [RichTextKit]
const content = ref(`
  <h2>Release notes</h2>
  <p>Write long-form content with headings, lists, links, tables, and media.</p>
`)
</script>

<template>
  <div class="w-full max-w-3xl">
    <TextEditor
      v-model="content"
      :extensions="extensions"
      :fixed-menu="articleToolbar"
      :bubble-menu="articleToolbar"
      placeholder="Start writing…"
      max-height="320px"
    >
      <template #actions="{ isEmpty }">
        <Button size="sm" variant="subtle">Save draft</Button>
        <Button size="sm" variant="solid" :disabled="isEmpty">Publish</Button>
      </template>
    </TextEditor>
  </div>
</template>
