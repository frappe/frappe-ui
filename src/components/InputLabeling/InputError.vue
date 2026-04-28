<template>
  <div
    v-if="lines.length"
    :id="id"
    data-slot="error"
    role="alert"
    class="text-p-sm whitespace-pre-line text-ink-red-3"
  >{{ lines.join('\n') }}</div>
</template>
<script setup lang="ts">
defineProps<{
  id: string
  lines: string[]
}>()
</script>
