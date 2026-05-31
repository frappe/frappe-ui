<script setup>
import { ref } from 'vue'
import { TextEditor, InlineKit, minimalToolbar } from 'frappe-ui/editor'

// A single-line rich title: the InlineKit + a bubble menu, no block tools.
const extensions = [InlineKit]
const title = ref('<p><strong>Editable</strong> inline title</p>')
</script>

<template>
  <div class="w-full max-w-xl">
    <TextEditor
      v-model="title"
      :extensions="extensions"
      :bubble-menu="minimalToolbar"
      placeholder="Untitled"
    />
  </div>
</template>
