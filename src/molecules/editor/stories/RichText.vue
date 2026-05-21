<script setup>
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { RichTextEditor } from 'frappe-ui/editor'

const content = ref(`
  <h2>Release notes</h2>
  <p>Write long-form content with headings, lists, links, tables, and media.</p>
`)
</script>

<template>
  <div class="w-full max-w-3xl">
    <RichTextEditor v-model="content" placeholder="Start writing…" max-height="320px">
      <template #actions="{ isEmpty }">
        <Button size="sm" variant="subtle">Save draft</Button>
        <Button size="sm" variant="solid" :disabled="isEmpty">Publish</Button>
      </template>
    </RichTextEditor>
  </div>
</template>
