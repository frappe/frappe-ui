<template>
  <p
    v-if="$slots.default || description"
    :id="id"
    data-slot="description"
    class="text-p-sm text-ink-gray-6"
  >
    <slot>{{ description }}</slot>
  </p>
</template>
<script setup lang="ts">
defineProps<{
  id: string
  description?: string
}>()
</script>
