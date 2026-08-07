<template>
  <p
    v-if="$slots.default || description"
    :id="id"
    data-slot="description"
    class="text-p-sm"
    :class="disabled ? 'text-ink-gray-3' : 'text-ink-gray-5'"
  >
    <slot>{{ description }}</slot>
  </p>
</template>
<script setup lang="ts">
defineProps<{
  id: string
  description?: string
  /** Dims the helper text to match a disabled control. */
  disabled?: boolean
}>()
</script>
