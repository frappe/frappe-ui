<script setup>
import { ref } from 'vue'
import { InlineEditor } from 'frappe-ui/editor'

const title = ref('<p><strong>Editable</strong> inline title</p>')
</script>

<template>
  <div class="w-full max-w-xl">
    <InlineEditor v-model="title" placeholder="Untitled" />
  </div>
</template>
