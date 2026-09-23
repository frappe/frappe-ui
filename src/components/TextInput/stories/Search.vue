<script setup lang="ts">
import { ref } from 'vue'
import { TextInput } from 'frappe-ui'

const query = ref('')
</script>

<template>
  <TextInput
    v-model="query"
    type="search"
    placeholder="Search tasks"
    aria-label="Search tasks"
    class="w-full max-w-xs"
  >
    <template #prefix>
      <span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
    </template>
  </TextInput>
</template>
